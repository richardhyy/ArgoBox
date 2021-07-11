import re
import psycopg2
from os import listdir
from os.path import isfile, join
# import traceback

db_schema = 'argodata'
db_table = 'argo_meta'

meta_keys = ("platform_number", "transmission_id", "transmission_system", "transmission_frequency", "transmission_system_id", "positioning_system", "platform_model", "platform_maker", "platform_firmware_version", "float_serial_number", "float_manual_version", "standard_format_id", "dac_fromat_id", "wmo_instrument_type", "project_name", "data_centre", "pi_name", "startup_date", "launch_date", "launch_latitude", "launch_longitude", "deployment_platform", "deployment_cruise_id", "sensors", "sensor_maker", "sensor_model", "sensor_serial_number", "sensor_units", "sensor_accuracy", "sensor_resolution", "cycle_time", "down_time", "up_time", "parking_time", "descent_profiling_time", "ascent_profiling_time", "park_pressure", "profile_pressure", "creation_date", "update_date")

def meta_data_to_json(path):
    meta = {}
    for key in meta_keys:
        meta[key] = None

    key_replace_dict = {
        "startup_date_of_the_float": "startup_date",
        "sensors_on_the_float": "sensors",
        "date_of_creation": "creation_date", 
        "date_of_update": "update_date"
    }

    value_replace_dict = {
        # dealing with the f**king chaotic naming convention in the metadata
        "n/a": None,
        "N/A": None,
        "NA": None, # what the ..
        "nan": None
    }

    ignore = (
        "format_version"
    )

    file = open(path, 'r')
    lines = file.readlines()
    
    for line in lines:
        if line == "" or not line[0] == " ":
            continue

        line = line.replace("\n", "")
        split = line.split(":", 1)
        
        if len(split) != 2:
            raise Exception("Format error: `{}`".format(line))
        
        split[0] = re.sub(r" \(.*\)", "", split[0])
        split[0] = split[0].strip()
        split[0] = split[0].replace(" ", "_").lower()

        if split[0] in ignore:
            continue
        
        if split[0] in key_replace_dict:
            split[0] = key_replace_dict[split[0]]
        
        if not split[0] in meta:
            raise Exception("Extra key {} found".format(split[0]))

        if split[1] != "":
            _value = split[1].replace("(YYYYMMDDHHMISS)", "").strip()
            
            if _value in value_replace_dict:
                _value = value_replace_dict[_value]
            
            if _value != None and len(_value) == 14: # time
                meta[split[0]] = _value
            else:
                try:
                    meta[split[0]] = int(_value)
                except:
                    try:
                        meta[split[0]] = float(_value)
                    except:
                        meta[split[0]] = _value

    return meta


if __name__ == "__main__":
    path = input("Path to Argo metadata folder: ").replace('\'', '')
    files = [f for f in listdir(path) if isfile(join(path, f))]

    meta_list = []
    for file in files:
        meta_list.append(meta_data_to_json(path + "/" + file))
    
    print("{} meta files loaded".format(len(meta_list)))

    conn = psycopg2.connect("dbname='argo' user='postgres' host='localhost' password='masterkey'")

    cur = conn.cursor()

    cur.execute("SET TIME ZONE 'UTC'")

    sql = """INSERT INTO {}.{}(
	platform_number, transmission_id, transmission_system, transmission_frequency, transmission_system_id, positioning_system, platform_model, platform_maker, platform_firmware_version, float_serial_number, float_manual_version, standard_format_id, dac_fromat_id, wmo_instrument_type, project_name, data_centre, pi_name, startup_date, launch_date, launch_latitude, launch_longitude, deployment_platform, deployment_cruise_id, sensors, sensor_maker, sensor_model, sensor_serial_number, sensor_units, sensor_accuracy, sensor_resolution, cycle_time, down_time, up_time, parking_time, descent_profiling_time, ascent_profiling_time, park_pressure, profile_pressure, creation_date, update_date)
	VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, TO_TIMESTAMP(%s,'YYYYMMDDHH24MISS'), TO_TIMESTAMP(%s,'YYYYMMDDHH24MISS'), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, TO_TIMESTAMP(%s,'YYYYMMDDHH24MISS'), TO_TIMESTAMP(%s,'YYYYMMDDHH24MISS'))""".format(db_schema, db_table)

    for meta in meta_list:
            values = []
            for key in meta_keys:
                values.append(meta[key])
            records = cur.execute(sql, values)
            
            # print("Record inserted (#{})".format(meta["platform_number"]))
        
        # except Exception as ex:
        #     traceback.print_exception(type(ex), ex, ex.__traceback__)
        #     print("SQL: {}".format(sql))
        #     print("Values: {}".format(", ".join([str(x) for x in values])))

    conn.commit()
    print("Committed")

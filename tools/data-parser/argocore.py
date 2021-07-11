from collections import OrderedDict
import psycopg2
from os import listdir
from os.path import isfile, join
import argoheader

db_schema = 'argodata'
db_table = 'argo_core'

field_format_dict = OrderedDict([
    ('platform_number', '%s'),
    ('cycle_number', '%s'),
    ('pressure', '\'{pressure}\''),
    ('cpressure', '\'{cpressure}\''),
    ('qpressure', '\'{qpressure}\''),
    ('temperature', '\'{temperature}\''),
    ('ctemperature', '\'{ctemperature}\''),
    ('qtemperature', '\'{qtemperature}\''),
    ('salinity', '\'{salinity}\''),
    ('csalinity', '\'{csalinity}\''),
    ('qsalinity', '\'{qsalinity}\''),
])


def profile_data_to_json(path):
    argoheader.parse_and_append_header_tsv(path, 'argoheader.tsv')

    def remove_space(text):
        return text.replace(' ', '')

    def contain_ignore_space(full, sub):
        return remove_space(sub) in full


    entry = {}

    # spaces will be removed automatically
    column_header_prefix_field_dict = {
        'Pressure (dbar)': 'pressure',
        'Corrected Pressure (dbar)': 'cpressure',
        'Quality on Pressure': 'qpressure',
        'Temperature (degree_Celsius)': 'temperature',
        'Corrected Temperature (degree_Celsius)': 'ctemperature',
        'Quality on Temperature': 'qtemperature',
        'Salinity (PSU)': 'salinity',
        'Corrected Salinity (PSU)': 'csalinity',
        'Quality on Salinity': 'qsalinity'
    }

    column_index_field_dict = {}

    file = open(path, 'r')
    lines = file.readlines()
    
    data_table = {}

    data_section = False
    for line in lines:
        line = line.replace('\n', '')
        if line == '':
            continue


        if line.startswith('=============='):
            data_section = True
            
            for index in column_index_field_dict.keys():
                data_table[index] = []
            
            continue

        if data_section:
            line = line.replace('  ', ' ').replace('  ', ' ')
            line = line.removeprefix(' ').removesuffix(' ')
            split = line.split(' ')
            for i in range(0, len(split)):
                _value = split[i]
                data_table[i].append(_value)
        else:
            line = remove_space(line)
            if contain_ignore_space(line, 'PLATFORM NUMBER'):
                split = line.split(':', 1)
                entry['platform_number'] = split[1]
            elif contain_ignore_space(line, 'CYCLE NUMBER'):
                split = line.split(':', 1)
                entry['cycle_number'] = split[1]
            elif contain_ignore_space(line, 'COLUMN'):
                # Example:
                #     COLUMN 1              :Pressure (dbar)                             F7.1
                split = line.split(':', 1)
                _index = int(split[0].removeprefix('COLUMN')) - 1
                _field_name = None
                for prefix in column_header_prefix_field_dict.keys():
                    if split[1].startswith(remove_space(prefix)):
                        _field_name = column_header_prefix_field_dict[prefix]
                
                if _field_name == None:
                    print('column `{}` does not match with any known fields'.format(split[1]))
                else:
                    column_index_field_dict[_index] = _field_name
    
    for col_index in column_index_field_dict.keys():
        field = column_index_field_dict[col_index]
        list_str = '{' + (','.join(data_table[col_index])) + '}'
        entry[field] = list_str

    return entry


if __name__ == "__main__":
    path = input("Path to Argo core profile folder: ").replace('\'', '')
    files = [f for f in listdir(path) if isfile(join(path, f))]

    entries = []
    for file in files:
        entries.append(profile_data_to_json(path + "/" + file))
    
    print("{} meta files loaded".format(len(entries)))

    conn = psycopg2.connect("dbname='argo' user='postgres' host='localhost' password='masterkey'")

    cur = conn.cursor()

    cur.execute("SET TIME ZONE 'UTC'")

    fields = list(field_format_dict.keys())
    fields_str = ''
    values_str = ''
    first = True
    for field in fields:
        fields_str += (', ' if not first else '') + field
        values_str += (', ' if not first else '') + field_format_dict[field]
        first = False
    
    sql = 'INSERT INTO {}.{}({}) VALUES ({})'.format(db_schema, db_table, fields_str, values_str)

    print(sql)

    for entry in entries:
        values = []
        _sql = sql
        for key in entry.keys():
            _raw_key_str = '{' + key + '}'
            _value = entry[key]
            if _raw_key_str in sql:
                # concat sql instead of prepared
                _sql = _sql.replace(_raw_key_str, _value)
            else:
                # w/ placeholder
                values.append(_value)
        records = cur.execute(_sql, values)
    
    conn.commit()
    print("Committed")

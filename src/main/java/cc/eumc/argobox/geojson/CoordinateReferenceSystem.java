package cc.eumc.argobox.geojson;

import java.util.HashMap;
import java.util.Map;

public class CoordinateReferenceSystem {
    /*
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:EPSG::4326"
        }
     */
    public String type;
    public Map<String, String> properties = new HashMap<>();
}

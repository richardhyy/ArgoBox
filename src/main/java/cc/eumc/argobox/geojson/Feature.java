package cc.eumc.argobox.geojson;

import java.util.HashMap;
import java.util.Map;

public class Feature {
    public String type;
    public String id;
    public Geometry geometry;
    public String geometry_name;
    public Map<String, Object> properties = new HashMap<>();
}

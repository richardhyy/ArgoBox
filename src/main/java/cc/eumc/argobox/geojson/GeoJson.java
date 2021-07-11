package cc.eumc.argobox.geojson;

import cc.eumc.argobox.util.Timestamp;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class GeoJson {
    private final transient Gson gson = new Gson();

    public String type;
    public Feature[] features;
    public int totalFeatures;
    public int numberMatched;
    public int numberReturned;
    public final String timeStamp;
    public CoordinateReferenceSystem crs;

    @Override
    public String toString() {
        return gson.toJson(this);
    }

    public GeoJson() {
        this.timeStamp = Timestamp.toFormattedTime(Timestamp.getSecondsSince1970());
    }

    public static GeoJson create(Feature[] features) {
        GeoJson geojson = new GeoJson();

        geojson.type = "FeatureCollection";
        geojson.features = features;

        geojson.totalFeatures = features.length;
        geojson.numberMatched = geojson.totalFeatures;
        geojson.numberReturned = geojson.totalFeatures;

        geojson.crs = new CoordinateReferenceSystem();
        geojson.crs.type = "name";
        geojson.crs.properties.put("name", "urn:ogc:def:crs:EPSG::4326");

        return geojson;
    }
}

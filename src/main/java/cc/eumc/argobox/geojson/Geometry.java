package cc.eumc.argobox.geojson;

public class Geometry {
    public String type;
    public double[] coordinates;

    public static Geometry createPoint(double x, double y) {
        Geometry geometry = new Geometry();

        geometry.type = "Point";
        geometry.coordinates = new double[] {x, y};

        return geometry;
    }
}

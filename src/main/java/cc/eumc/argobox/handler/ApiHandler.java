package cc.eumc.argobox.handler;

import cc.eumc.argobox.ArgoBox;
import cc.eumc.argobox.ArgoDatabase;
import cc.eumc.argobox.geojson.Feature;
import cc.eumc.argobox.geojson.GeoJson;
import cc.eumc.argobox.geojson.Geometry;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ApiHandler implements HttpHandler {
    private ArgoBox instance;

    public ApiHandler(ArgoBox instance) {
        this.instance = instance;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String uri = exchange.getRequestURI().toString().substring(4); // remove `/api` at the start of the URI
        if (uri.startsWith("/")) {
            uri = uri.substring(1);
        }

        String[] route = uri.split("/");

        String response = "";
        try {
            response = route(route);
        } catch (Exception ex) {
            StringBuilder stacktrace = new StringBuilder();
            for (StackTraceElement element : ex.getStackTrace()) {
                stacktrace.append(element);
                stacktrace.append("\n");
            }
            instance.sendError(exchange, 500, ex.getMessage() + "\n" + stacktrace.toString());
        }
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    private String route(String[] route) throws Exception {
        String errorMessage = "Error";

        return switch (route.length) {
            case 0 -> "Hello API";
            case 2 -> switch (route[0].toLowerCase()) {
                case "meta" -> getMetadata(route[1]);
                case "header" -> getHeader(route[1], "all");
                default -> errorMessage;
            };
            case 3 -> switch (route[0].toLowerCase()) {
                case "header" -> getHeader(route[1], route[2]);
                case "core" -> getCoreProfile(route[1], route[2]);
                default -> errorMessage;
            };
            default -> errorMessage;
        };
    }

    /**
     * Get argo core profile
     * @param platformNumber
     * @param cycleNumber
     * @return GeoJson string
     * @throws Exception
     */
    private String getCoreProfile(String platformNumber, String cycleNumber) throws Exception {
        ArgoDatabase db = instance.getDatabase();
        PreparedStatement statement = db.getConnection().prepareStatement("SELECT cpressure, ctemperature, csalinity FROM argodata.argo_core WHERE platform_number = ? AND cycle_number = ?");
        statement.setInt(1, Integer.parseInt(platformNumber));
        statement.setInt(2, Integer.parseInt(cycleNumber));

        ResultSet rs = statement.executeQuery();
        List<Feature> features = new ArrayList<>();
        while (rs.next()) {
            Feature feature = floatFeatureBuilder(platformNumber, null, null);
            feature.properties.put("cpressure", sqlArrayToDoubleArray(rs.getArray("cpressure")));
            feature.properties.put("ctemperature", sqlArrayToDoubleArray(rs.getArray("ctemperature")));
            feature.properties.put("csalinity", sqlArrayToDoubleArray(rs.getArray("csalinity")));
            features.add(feature);
        }
        return GeoJson.create(features.toArray(new Feature[0])).toString();
    }

    /**
     * Get argo platform data header
     * @param platformNumber "all" | specified-id
     * @param cycleNumber "all" | "latest" | specified-cycle
     * @return GeoJson string
     * @throws Exception
     */
    private String getHeader(String platformNumber, String cycleNumber) throws Exception {
        String sql = "";
        List<Integer> values = new ArrayList<>();
        if (platformNumber.equalsIgnoreCase("all")) {
            // headers for all platforms
            switch (cycleNumber.toLowerCase()) {
                case "latest" -> sql = "SELECT a.platform_number, a.cycle_number, project_name, a.date, a.longitude, a.latitude FROM argodata.argo_header a " +
                        "INNER JOIN (" +
                        "SELECT platform_number, MAX(cycle_number) cycle_number " +
                        "FROM argodata.argo_header " +
                        "GROUP BY platform_number" +
                        ") b ON a.platform_number = b.platform_number AND a.cycle_number = b.cycle_number";

                case "all" -> sql = "SELECT platform_number, cycle_number, project_name, date, longitude, latitude FROM argodata.argo_header ORDER BY cycle_number";

                default -> {
                    sql = "SELECT platform_number, cycle_number, project_name, date, longitude, latitude FROM argodata.argo_header WHERE cycle_number = ?";
                    values.add(Integer.valueOf(cycleNumber));
                }
            }
        } else {
            // headers for the specified platform
            switch (cycleNumber.toLowerCase()) {
                case "latest" -> {
                    sql = "SELECT a.platform_number, a.cycle_number, a.project_name, a.date, a.longitude, a.latitude FROM argodata.argo_header a " +
                            "INNER JOIN (" +
                            "SELECT platform_number, MAX(cycle_number) cycle_number " +
                            "FROM argodata.argo_header " +
                            "GROUP BY platform_number " +
                            "HAVING platform_number = ?" +
                            ") b ON a.platform_number = b.platform_number AND a.cycle_number = b.cycle_number";
                    values.add(Integer.valueOf(platformNumber));
                }
                case "all" -> {
                    sql = "SELECT platform_number, cycle_number, project_name, date, longitude, latitude FROM argodata.argo_header WHERE platform_number = ? ORDER BY cycle_number";
                    values.add(Integer.valueOf(platformNumber));
                }
                default -> {
                    sql = "SELECT platform_number, cycle_number, project_name, date, longitude, latitude FROM argodata.argo_header WHERE platform_number = ? AND cycle_number = ?";
                    values.add(Integer.valueOf(platformNumber));
                    values.add(Integer.valueOf(cycleNumber));
                }
            }
        }

        ArgoDatabase db = instance.getDatabase();
        PreparedStatement statement = db.getConnection().prepareStatement(sql);
        for (int i=1; i<=values.size(); i++) {
            statement.setInt(i, values.get(i - 1));
        }
        ResultSet rs = statement.executeQuery();

        List<Feature> features = new ArrayList<>();
        while (rs.next()) {
            String platformNumberStr = String.valueOf(rs.getInt("platform_number"));
            String cycleNumberStr = String.valueOf(rs.getInt("cycle_number"));
            Feature _feature = floatFeatureBuilder(platformNumberStr + " @ " + cycleNumberStr, rs.getDouble("longitude"), rs.getDouble("latitude"));
            _feature.properties.put("platform_number", platformNumberStr);
            _feature.properties.put("cycle_number", cycleNumberStr);
            _feature.properties.put("project_name", rs.getString("project_name"));
            _feature.properties.put("date", rs.getString("date"));
            features.add(_feature);
        }

        return GeoJson.create(features.toArray(new Feature[0])).toString();
    }

    /**
     * get metadata for platform
     * @param platformNumber
     * @return GeoJson string
     * @throws Exception
     */
    private String getMetadata(String platformNumber) throws Exception {
        ArgoDatabase db = instance.getDatabase();
        PreparedStatement statement = db.getConnection().prepareStatement("SELECT launch_latitude, launch_longitude FROM argodata.argo_meta WHERE platform_number = ?");
        statement.setInt(1, Integer.parseInt(platformNumber));
        ResultSet rs = statement.executeQuery();

        List<Feature> features = new ArrayList<>();
        while (rs.next()) {
            Feature feature = floatFeatureBuilder(platformNumber, rs.getDouble("launch_longitude"), rs.getDouble("launch_latitude"));
            features.add(feature);
        }
        return GeoJson.create(features.toArray(new Feature[0])).toString();
    }

    // MARK: - Utils
    private double[] sqlArrayToDoubleArray(java.sql.Array sqlArray) throws SQLException {
        List<BigDecimal> result = new ArrayList<>();
        for (Object o : (Object[]) sqlArray.getArray()) {
            result.add((BigDecimal)o); // throws
        }
        return result.stream()
                .mapToDouble(BigDecimal::doubleValue)
                .toArray();
    }

    private Feature floatFeatureBuilder(String id, Double longitude, Double latitude) {
        Feature feature = new Feature();
        feature.geometry_name = "geom";
        feature.type = "Feature";
        feature.id = "float_" + id;
        if (longitude != null && latitude != null) {
            feature.geometry = Geometry.createPoint(longitude, latitude);
        }
        return feature;
    }
}

package cc.eumc.argobox;

import java.sql.*;

public class ArgoDatabase {
    private Connection connection = null;

    /**
     *
     * @param dbUrl e.g. `localhost:5432/lakes`
     * @param user
     * @param password
     */
    ArgoDatabase(String dbUrl, String user, String password) {
        try {
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection("jdbc:postgresql://" + dbUrl, user, password);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
        }
        System.out.println("Connected to database.");
    }

    // MARK: - Getter
    public Connection getConnection() {
        return connection;
    }
}

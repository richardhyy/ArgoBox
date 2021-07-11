package cc.eumc.argobox;

import cc.eumc.argobox.handler.ApiHandler;
import cc.eumc.argobox.handler.DocumentRequestHandler;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class ArgoBox {
    private HttpServer server;
    private boolean isRunning = false;
    ArgoDatabase database;

    private File htdocsRoot;
    private String[] defaultDocuments = new String[] {"index.html"};

    public static void main(String[] args) {
        // Bogus: Hard-coded port listening config
        ArgoBox instance = new ArgoBox("0.0.0.0", 8080);
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        if (instance.getServer() == null) {
            System.out.println("Failed starting server.");
            return;
        }

        System.out.println("Done! Type \"help\" for help.");

        while (true) {
            if (!instance.isRunning()) {
                System.out.println("Goodbye.");
                System.exit(0);
            }

            System.out.print("> ");
            try {
                String command = reader.readLine();
                instance.processCommand(command);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    ArgoBox(String host, int port) {
        this.htdocsRoot = new File("htdocs");

        initialize();

        try {
            System.out.println(String.format("Starting server on %s:%s", host, port));
            server = HttpServer.create(new InetSocketAddress(host, port), 0);
            System.out.println(String.format("Server started @ http://%s:%s", host, port));
            this.isRunning = true;
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }
        server.createContext("/api", new ApiHandler(this));
        server.createContext("/", new DocumentRequestHandler(this));
        server.setExecutor(Executors.newFixedThreadPool(4));
        server.start();

        // Bogus: Hard-coded database connection info
        this.database = new ArgoDatabase("localhost:5432/argo", "postgres", "masterkey");
    }

    private void initialize() {
        if (!htdocsRoot.exists()) {
            htdocsRoot.mkdir();
            System.out.printf("Created folder: %s%n", htdocsRoot.toPath().toAbsolutePath());
        }
    }

    public void stop() {
        server.stop(0);
        isRunning = false;
    }

    private void processCommand(String command) {
        String[] split = command.split(" ");
        if (split.length == 1) {
            switch (split[0].toLowerCase()) {
                case "quit":
                    System.out.println("Stopping the server...");
                    this.stop();
                    return;
                case "help":
                    System.out.println("quit: stop the server");
                    return;
            }
        }

        System.out.println("Unknown command. Type `help` for help.");
    }


    // MARK: - Utils
    private void writeResourceToFile(String resourceName, File destination) throws IOException {
        InputStream in = this.getClass().getResourceAsStream(resourceName);
        OutputStream out = new FileOutputStream(destination);
        int bytesRead;
        byte[] buffer = new byte[4096];
        while ((bytesRead = in.read(buffer)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
    }

    public void sendError(HttpExchange exchange, Integer code) throws IOException {
        sendError(exchange, code, "We encountered an error.");
    }

    public void sendError(HttpExchange exchange, Integer code, String message) throws IOException {
        String response = String.format("<html><body><h1>%s</h1><p>%s</p></body></html>", code, message.replace("\n", "<br>"));
        exchange.sendResponseHeaders(code, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    // MARK: - Getters
    public HttpServer getServer() {
        return server;
    }

    public boolean isRunning() {
        return isRunning;
    }

    public ArgoDatabase getDatabase() {
        return database;
    }

    public File getHtdocsRoot() {
        return htdocsRoot;
    }

    public String[] getDefaultDocuments() {
        return defaultDocuments;
    }
}

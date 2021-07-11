package cc.eumc.argobox.handler;

import cc.eumc.argobox.ArgoBox;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

public class DocumentRequestHandler implements HttpHandler {
    private ArgoBox instance;

    public DocumentRequestHandler(ArgoBox instance) {
        this.instance = instance;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String uri = exchange.getRequestURI().toString();
        if (uri.equals("/")) {
            // default document
            for (String filename : instance.getDefaultDocuments()) {
                if (new File(instance.getHtdocsRoot(), filename).exists()) {
                    uri += filename;
                    break;
                }
            }
        }
        else if (uri.contains("/.")) {
            // potentially malicious request
            instance.sendError(exchange, 401, "Forbidden");
            return;
        }

        File requestedFile = new File(instance.getHtdocsRoot(), uri);

        if (!requestedFile.exists()) {
            instance.sendError(exchange, 404);
            return;
        }

        byte[] response = Files.readAllBytes(requestedFile.toPath());
        exchange.sendResponseHeaders(200, response.length);
        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }
}
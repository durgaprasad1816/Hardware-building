package purchase;

import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;

public class PurchaseServer {

    public static void main(String[] args) {

        try {

            // Test database connection
            DatabaseConnection.getConnection();

            // Create server on port 8055
            HttpServer server = HttpServer.create(
                    new InetSocketAddress(8055),
                    0
            );

            // Purchase API
            server.createContext(
                    "/purchase",
                    new PurchaseHandler()
            );

            // Start server
            server.setExecutor(null);

            server.start();

            System.out.println(
                    "Purchase Java Backend Started"
            );

            System.out.println(
                    "Server running at http://localhost:8055"
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}
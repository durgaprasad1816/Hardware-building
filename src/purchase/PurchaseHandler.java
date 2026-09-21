package purchase;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

public class PurchaseHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        // ==========================================
        // CORS
        // ==========================================

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "POST, OPTIONS"
        );

        // ==========================================
        // OPTIONS REQUEST
        // ==========================================

        if ("OPTIONS".equalsIgnoreCase(
                exchange.getRequestMethod())) {

            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // ==========================================
        // ONLY POST REQUEST
        // ==========================================

        if (!"POST".equalsIgnoreCase(
                exchange.getRequestMethod())) {

            sendResponse(
                    exchange,
                    405,
                    "Only POST method is allowed"
            );

            return;
        }

        try {

            // ==========================================
            // READ FRONTEND DATA
            // ==========================================

            InputStream inputStream =
                    exchange.getRequestBody();

            String requestData =
                    new String(
                            inputStream.readAllBytes(),
                            StandardCharsets.UTF_8
                    );

            System.out.println(
                    "Data received from frontend:"
            );

            System.out.println(requestData);

            // ==========================================
            // PARSE FORM DATA
            // ==========================================

            Map<String, String> data =
                    parseFormData(requestData);

            // ==========================================
            // GET PURCHASE DATA
            // ==========================================

            String purchaseDate =
                    data.get("purchaseDate");

            String supplierName =
                    data.get("supplierName");

            String totalProductsValue =
                    data.get("totalProducts");

            String totalQuantityValue =
                    data.get("totalQuantity");

            String overallDiscountValue =
                    data.get("overallDiscount");

            String grandTotalValue =
                    data.get("grandTotal");

            String productsData =
                    data.get("products");

            // ==========================================
            // VALIDATE PURCHASE DATE
            // ==========================================

            if (purchaseDate == null ||
                    purchaseDate.trim().isEmpty()) {

                sendResponse(
                        exchange,
                        400,
                        "Purchase date is required"
                );

                return;
            }

            // ==========================================
            // VALIDATE SUPPLIER
            // ==========================================

            if (supplierName == null ||
                    supplierName.trim().isEmpty()) {

                sendResponse(
                        exchange,
                        400,
                        "Supplier name is required"
                );

                return;
            }

            // ==========================================
            // VALIDATE NUMERIC VALUES
            // ==========================================

            if (totalProductsValue == null ||
                    totalQuantityValue == null ||
                    overallDiscountValue == null ||
                    grandTotalValue == null) {

                sendResponse(
                        exchange,
                        400,
                        "Required purchase values are missing"
                );

                return;
            }

            // ==========================================
            // CONVERT VALUES
            // ==========================================

            int totalProducts =
                    Integer.parseInt(
                            totalProductsValue.trim()
                    );

            int totalQuantity =
                    Integer.parseInt(
                            totalQuantityValue.trim()
                    );

            double overallDiscount =
                    Double.parseDouble(
                            overallDiscountValue.trim()
                    );

            double grandTotal =
                    Double.parseDouble(
                            grandTotalValue.trim()
                    );

            // ==========================================
            // SAVE PURCHASE
            // ==========================================

            int purchaseId =
                    savePurchase(
                            purchaseDate,
                            supplierName,
                            totalProducts,
                            totalQuantity,
                            overallDiscount,
                            grandTotal
                    );

            // ==========================================
            // SAVE PRODUCTS
            // ==========================================

            if (productsData != null &&
                    !productsData.trim().isEmpty()) {

                saveProducts(
                        purchaseId,
                        productsData
                );
            }

            // ==========================================
            // SUCCESS RESPONSE
            // ==========================================

            sendResponse(
                    exchange,
                    200,
                    "Purchase saved successfully. Purchase ID: "
                            + purchaseId
            );

        } catch (NumberFormatException e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    400,
                    "Invalid number format: "
                            + e.getMessage()
            );

        } catch (IllegalArgumentException e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    400,
                    "Invalid data: "
                            + e.getMessage()
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "Server error: "
                            + e.getMessage()
            );
        }
    }

    // ==================================================
    // SAVE PURCHASE
    // ==================================================

    private int savePurchase(
            String purchaseDate,
            String supplierName,
            int totalProducts,
            int totalQuantity,
            double overallDiscount,
            double grandTotal
    ) throws SQLException {

        String sql =
                "INSERT INTO purchases " +
                "(purchase_date, supplier_name, " +
                "total_products, total_quantity, " +
                "overall_discount, grand_total) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                sql,
                                Statement.RETURN_GENERATED_KEYS
                        )
        ) {

            statement.setDate(
                    1,
                    Date.valueOf(purchaseDate)
            );

            statement.setString(
                    2,
                    supplierName
            );

            statement.setInt(
                    3,
                    totalProducts
            );

            statement.setInt(
                    4,
                    totalQuantity
            );

            statement.setDouble(
                    5,
                    overallDiscount
            );

            statement.setDouble(
                    6,
                    grandTotal
            );

            statement.executeUpdate();

            // ==========================================
            // GET GENERATED PURCHASE ID
            // ==========================================

            try (
                    ResultSet result =
                            statement.getGeneratedKeys()
            ) {

                if (result.next()) {

                    return result.getInt(1);
                }
            }
        }

        throw new SQLException(
                "Unable to generate Purchase ID"
        );
    }

    // ==================================================
    // SAVE PRODUCTS
    // ==================================================

    private void saveProducts(
            int purchaseId,
            String productsData
    ) throws SQLException {

        /*
         * Product format:
         *
         * PRODUCT_NAME|COST|QUANTITY|STOCK|DISCOUNT|DISCOUNT_AMOUNT|TOTAL
         *
         * Example:
         *
         * Paint|500|2|10|5|50|950
         *
         * Multiple products:
         *
         * Paint|500|2|10|5|50|950##
         * Cement|400|3|20|10|120|1080
         */

        String[] products =
                productsData.split("##");

        String sql =
                "INSERT INTO purchase_items " +
                "(purchase_id, product_name, cost, " +
                "quantity, stock, discount_percent, " +
                "discount_amount, total_amount) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            for (String product : products) {

                if (product == null ||
                        product.trim().isEmpty()) {

                    continue;
                }

                String[] values =
                        product.split("\\|", -1);

                // ==========================================
                // NEED AT LEAST 7 VALUES
                // ==========================================

                if (values.length < 7) {

                    System.out.println(
                            "Invalid product data: "
                                    + product
                    );

                    continue;
                }

                // ==========================================
                // PURCHASE ID
                // ==========================================

                statement.setInt(
                        1,
                        purchaseId
                );

                // ==========================================
                // PRODUCT NAME
                // ==========================================

                statement.setString(
                        2,
                        values[0].trim()
                );

                // ==========================================
                // COST
                // ==========================================

                statement.setDouble(
                        3,
                        Double.parseDouble(
                                values[1].trim()
                        )
                );

                // ==========================================
                // QUANTITY
                // ==========================================

                statement.setInt(
                        4,
                        Integer.parseInt(
                                values[2].trim()
                        )
                );

                // ==========================================
                // STOCK
                // ==========================================

                statement.setInt(
                        5,
                        Integer.parseInt(
                                values[3].trim()
                        )
                );

                // ==========================================
                // DISCOUNT %
                // ==========================================

                statement.setDouble(
                        6,
                        Double.parseDouble(
                                values[4].trim()
                        )
                );

                // ==========================================
                // DISCOUNT AMOUNT
                // ==========================================

                statement.setDouble(
                        7,
                        Double.parseDouble(
                                values[5].trim()
                        )
                );

                // ==========================================
                // TOTAL AMOUNT
                // ==========================================

                statement.setDouble(
                        8,
                        Double.parseDouble(
                                values[6].trim()
                        )
                );

                statement.addBatch();
            }

            // ==========================================
            // INSERT PRODUCTS
            // ==========================================

            statement.executeBatch();
        }
    }

    // ==================================================
    // PARSE FORM DATA
    // ==================================================

    private Map<String, String> parseFormData(
            String data
    ) throws IOException {

        Map<String, String> map =
                new HashMap<>();

        if (data == null ||
                data.trim().isEmpty()) {

            return map;
        }

        String[] pairs =
                data.split("&");

        for (String pair : pairs) {

            if (pair == null ||
                    pair.isEmpty()) {

                continue;
            }

            String[] keyValue =
                    pair.split("=", 2);

            if (keyValue.length == 2) {

                String key =
                        URLDecoder.decode(
                                keyValue[0],
                                StandardCharsets.UTF_8
                        );

                String value =
                        URLDecoder.decode(
                                keyValue[1],
                                StandardCharsets.UTF_8
                        );

                map.put(
                        key,
                        value
                );
            }
        }

        return map;
    }

    // ==================================================
    // SEND RESPONSE
    // ==================================================

    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response
    ) throws IOException {

        byte[] responseBytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "text/plain; charset=UTF-8"
        );

        exchange.sendResponseHeaders(
                statusCode,
                responseBytes.length
        );

        try (
                OutputStream outputStream =
                        exchange.getResponseBody()
        ) {

            outputStream.write(
                    responseBytes
            );
        }
    }
}
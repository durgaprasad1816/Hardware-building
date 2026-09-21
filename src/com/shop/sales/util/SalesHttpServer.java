package com.shop.sales.util;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class SalesHttpServer {

    public static void main(String[] args) {

        try {

            HttpServer server =
                    HttpServer.create(
                            new InetSocketAddress(8081),
                            0
                    );

            server.createContext(
                    "/sales",
                    SalesHttpServer::handleSales
            );

            server.setExecutor(null);

            server.start();

            System.out.println(
                    "Sales HTTP Server started on port 8081"
            );

        } catch (IOException e) {

            e.printStackTrace();
        }
    }


    private static void handleSales(
            HttpExchange exchange) throws IOException {

        exchange.getResponseHeaders()
                .add(
                        "Access-Control-Allow-Origin",
                        "*"
                );

        exchange.getResponseHeaders()
                .add(
                        "Access-Control-Allow-Methods",
                        "POST, OPTIONS"
                );

        exchange.getResponseHeaders()
                .add(
                        "Access-Control-Allow-Headers",
                        "Content-Type"
                );


        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(204, -1);

            exchange.close();

            return;
        }


        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    "Only POST request is allowed.",
                    405
            );

            return;
        }


        try {

            String requestData =
                    new String(
                            exchange.getRequestBody()
                                    .readAllBytes(),
                            StandardCharsets.UTF_8
                    );


            System.out.println(
                    "Sale data received:"
            );

            System.out.println(requestData);


            // Read basic sale details

            int customerId =
                    getIntValue(
                            requestData,
                            "customerId"
                    );


            double tax =
                    getDoubleValue(
                            requestData,
                            "tax"
                    );


            String paymentMethod =
                    getStringValue(
                            requestData,
                            "paymentMethod"
                    );


            String paymentStatus =
                    getStringValue(
                            requestData,
                            "paymentStatus"
                    );


            System.out.println(
                    "Customer ID: " + customerId
            );

            System.out.println(
                    "Tax: " + tax
            );

            System.out.println(
                    "Payment Method: "
                            + paymentMethod
            );

            System.out.println(
                    "Payment Status: "
                            + paymentStatus
            );


            // Create Sale object

            Sale sale =
                    new Sale();


            sale.setCustomerId(
                    customerId
            );

            sale.setTax(
                    tax
            );

            sale.setPaymentMethod(
                    paymentMethod
            );

            sale.setPaymentStatus(
                    paymentStatus
            );


            // Read subtotal and grand total

            double subtotal =
                    getDoubleValue(
                            requestData,
                            "subtotal"
                    );


            double grandTotal =
                    getDoubleValue(
                            requestData,
                            "grandTotal"
                    );


            sale.setSubtotal(
                    subtotal
            );

            sale.setGrandTotal(
                    grandTotal
            );


            // Create SaleItem objects

            SaleItem[] items =
                    parseItems(requestData);


            // Save sale into MySQL

            SaleDAO saleDAO =
                    new SaleDAO();


            int saleId =
                    saleDAO.saveSale(
                            sale,
                            items
                    );


            // Send success response

            sendResponse(
                    exchange,
                    "Sale Completed Successfully! Sale ID: "
                            + saleId,
                    200
            );


        } catch (Exception e) {

            e.printStackTrace();


            sendResponse(
                    exchange,
                    "Error: " + e.getMessage(),
                    500
            );
        }
    }


    private static int getIntValue(
            String json,
            String key) {

        String value =
                getRawValue(
                        json,
                        key
                );


        return Integer.parseInt(value);
    }


    private static double getDoubleValue(
            String json,
            String key) {

        String value =
                getRawValue(
                        json,
                        key
                );


        return Double.parseDouble(value);
    }


    private static String getStringValue(
            String json,
            String key) {

        String value =
                getRawValue(
                        json,
                        key
                );


        return value
                .replace("\"", "")
                .trim();
    }


    private static String getRawValue(
            String json,
            String key) {

        String search =
                "\"" + key + "\":";

        int start =
                json.indexOf(search);

        if (start == -1) {

            throw new IllegalArgumentException(
                    "Missing field: " + key
            );
        }

        start += search.length();

        int comma =
                json.indexOf(",", start);

        int brace =
                json.indexOf("}", start);

        int end;

        if (comma == -1 && brace == -1) {

            throw new IllegalArgumentException(
                    "Invalid value for field: " + key
            );

        } else if (comma == -1) {

            end = brace;

        } else if (brace == -1) {

            end = comma;

        } else {

            end = Math.min(comma, brace);
        }

        return json
                .substring(start, end)
                .trim();
    }
    
    private static SaleItem[] parseItems(String json) {

        String itemsStart = "\"items\":[";

        int start = json.indexOf(itemsStart);

        if (start == -1) {
            throw new IllegalArgumentException("Items not found.");
        }

        start += itemsStart.length();

        int end = json.indexOf("]", start);

        if (end == -1) {
            throw new IllegalArgumentException("Invalid items data.");
        }

        String itemsData =
                json.substring(start, end).trim();

        if (itemsData.isEmpty()) {
            throw new IllegalArgumentException("No sale items found.");
        }

        String[] itemObjects =
                itemsData.split("\\},\\{");

        SaleItem[] items =
                new SaleItem[itemObjects.length];

        for (int i = 0; i < itemObjects.length; i++) {

            String itemJson =
                    itemObjects[i]
                            .replace("{", "")
                            .replace("}", "")
                            .trim();

            SaleItem item = new SaleItem();

            item.setProductId(
                    getItemIntValue(itemJson, "productId")
            );

            item.setQuantity(
                    getItemIntValue(itemJson, "quantity")
            );

            item.setAvailable(
                    getItemIntValue(itemJson, "available")
            );

            item.setUnitPrice(
                    getItemDoubleValue(itemJson, "unitPrice")
            );

            item.setDiscount(
                    getItemDoubleValue(itemJson, "discount")
            );

            item.setTotal(
                    getItemDoubleValue(itemJson, "total")
            );

            items[i] = item;
        }

        return items;
    }


    private static int getItemIntValue(
            String itemJson,
            String key) {

        String search =
                "\"" + key + "\":";

        int start =
                itemJson.indexOf(search);

        if (start == -1) {
            throw new IllegalArgumentException(
                    "Missing item field: " + key
            );
        }

        start += search.length();

        int end =
                itemJson.indexOf(",", start);

        if (end == -1) {
            end = itemJson.length();
        }

        String value =
                itemJson.substring(start, end).trim();

        return Integer.parseInt(value);
    }


    private static double getItemDoubleValue(
            String itemJson,
            String key) {

        String search =
                "\"" + key + "\":";

        int start =
                itemJson.indexOf(search);

        if (start == -1) {
            throw new IllegalArgumentException(
                    "Missing item field: " + key
            );
        }

        start += search.length();

        int end =
                itemJson.indexOf(",", start);

        if (end == -1) {
            end = itemJson.length();
        }

        String value =
                itemJson.substring(start, end).trim();

        return Double.parseDouble(value);
    }

    private static void sendResponse(
            HttpExchange exchange,
            String response,
            int statusCode)
            throws IOException {


        byte[] responseBytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );


        exchange.sendResponseHeaders(
                statusCode,
                responseBytes.length
        );


        exchange.getResponseBody()
                .write(responseBytes);


        exchange.close();
    }
}
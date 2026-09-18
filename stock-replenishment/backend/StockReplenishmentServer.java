package BUILDING_APPLICATION;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import java.net.InetSocketAddress;

import java.nio.charset.StandardCharsets;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Time;
import java.sql.Types;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


public class StockReplenishmentServer {


    private static final int PORT = 8085;


    public static void main(String[] args)
            throws Exception {


        DBConnection.testConnection();


        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(PORT),
                        0
                );


        server.createContext(
                "/stock-replenishment",
                StockReplenishmentServer::handleRequest
        );


        server.createContext(
                "/health",
                StockReplenishmentServer::handleHealth
        );


        server.setExecutor(null);


        System.out.println(
                "======================================"
        );

        System.out.println(
                "Stock Replenishment Server Started"
        );

        System.out.println(
                "Server Port : " + PORT
        );

        System.out.println(
                "======================================"
        );


        server.start();

    }


    // =====================================================
    // HEALTH CHECK
    // =====================================================

    private static void handleHealth(
            HttpExchange exchange)
            throws IOException {


        addCorsHeaders(exchange);


        String response =
                "{\"status\":\"Server Running\"}";


        sendResponse(
                exchange,
                200,
                response
        );

    }


    // =====================================================
    // MAIN REQUEST
    // =====================================================

    private static void handleRequest(
            HttpExchange exchange)
            throws IOException {


        addCorsHeaders(exchange);


        if ("OPTIONS".equalsIgnoreCase(
                exchange.getRequestMethod())) {


            exchange.sendResponseHeaders(
                    204,
                    -1
            );


            exchange.close();


            return;

        }


        if (!"POST".equalsIgnoreCase(
                exchange.getRequestMethod())) {


            sendResponse(
                    exchange,
                    405,
                    "{\"message\":\"Only POST request is allowed.\"}"
            );


            return;

        }


        try {


            String json =
                    readRequestBody(exchange);


            System.out.println(
                    "\nReceived JSON:"
            );


            System.out.println(json);


            saveRequest(json);


            sendResponse(
                    exchange,
                    200,
                    "{\"message\":\"Stock replenishment request saved successfully.\"}"
            );


        } catch (Exception e) {


            e.printStackTrace();


            String message =
                    e.getMessage();


            if (message == null) {

                message =
                        "Unknown server error";

            }


            message =
                    message.replace(
                            "\"",
                            "\\\""
                    );


            sendResponse(
                    exchange,
                    500,
                    "{\"message\":\"" +
                            message +
                            "\"}"
            );

        }

    }


    // =====================================================
    // SAVE COMPLETE REQUEST
    // =====================================================

    private static void saveRequest(
            String json)
            throws Exception {


        SimpleJsonParser parser =
                new SimpleJsonParser(json);


        String requestId =
                parser.getString(
                        "requestId"
                );


        String requestDate =
                parser.getString(
                        "requestDate"
                );


        String requiredByDate =
                parser.getString(
                        "requiredByDate"
                );


        String priority =
                parser.getString(
                        "priority"
                );


        String requestStatus =
                parser.getString(
                        "requestStatus"
                );


        // =================================================
        // SHOP
        // =================================================

        String shopName =
                parser.getNestedString(
                        "shop",
                        "shopName"
                );


        String shopId =
                parser.getNestedString(
                        "shop",
                        "shopId"
                );


        String ownerManager =
                parser.getNestedString(
                        "shop",
                        "ownerManager"
                );


        String shopPhone =
                parser.getNestedString(
                        "shop",
                        "phone"
                );


        String shopEmail =
                parser.getNestedString(
                        "shop",
                        "email"
                );


        String shopAddress =
                parser.getNestedString(
                        "shop",
                        "address"
                );


        // =================================================
        // SUPPLIER
        // =================================================

        String supplierName =
                parser.getNestedString(
                        "supplier",
                        "supplierName"
                );


        String supplierId =
                parser.getNestedString(
                        "supplier",
                        "supplierId"
                );


        String contactPerson =
                parser.getNestedString(
                        "supplier",
                        "contactPerson"
                );


        String supplierPhone =
                parser.getNestedString(
                        "supplier",
                        "phone"
                );


        String supplierEmail =
                parser.getNestedString(
                        "supplier",
                        "email"
                );


        String supplierAddress =
                parser.getNestedString(
                        "supplier",
                        "address"
                );


        // =================================================
        // DELIVERY
        // =================================================

        String deliveryAddress =
                parser.getNestedString(
                        "delivery",
                        "address"
                );


        String deliveryDate =
                parser.getNestedString(
                        "delivery",
                        "date"
                );


        String deliveryTime =
                parser.getNestedString(
                        "delivery",
                        "time"
                );


        String deliveryInstructions =
                parser.getNestedString(
                        "delivery",
                        "instructions"
                );


        // =================================================
        // ADDITIONAL
        // =================================================

        String reasonForRequest =
                parser.getNestedString(
                        "additional",
                        "reason"
                );


        String remarks =
                parser.getNestedString(
                        "additional",
                        "remarks"
                );


        // =================================================
        // AMOUNT
        // =================================================

        double totalQuantity =
                parser.getNestedDouble(
                        "amount",
                        "totalQuantity"
                );


        double estimatedAmount =
                parser.getNestedDouble(
                        "amount",
                        "estimatedAmount"
                );


        double discount =
                parser.getNestedDouble(
                        "amount",
                        "discount"
                );


        double tax =
                parser.getNestedDouble(
                        "amount",
                        "tax"
                );


        double deliveryCharges =
                parser.getNestedDouble(
                        "amount",
                        "deliveryCharges"
                );


        double finalAmount =
                parser.getNestedDouble(
                        "amount",
                        "finalAmount"
                );


        int totalProducts =
                parser.getNestedInt(
                        "amount",
                        "totalProducts"
                );


        // =================================================
        // ATTACHMENT
        // =================================================

        String attachmentName = null;

        String attachmentType = null;

        String attachmentPath = null;


        String attachmentFileData =
                parser.getNestedString(
                        "additional",
                        "attachment",
                        "fileData"
                );


        if (
                attachmentFileData != null &&
                !attachmentFileData.isEmpty()
        ) {


            attachmentName =
                    parser.getNestedString(
                            "additional",
                            "attachment",
                            "fileName"
                    );


            attachmentType =
                    parser.getNestedString(
                            "additional",
                            "attachment",
                            "fileType"
                    );


            attachmentPath =
                    saveAttachment(
                            requestId,
                            attachmentName,
                            attachmentFileData
                    );

        }


        // =================================================
        // DATABASE
        // =================================================

        Connection connection =
                null;


        try {


            connection =
                    DBConnection.getConnection();


            connection.setAutoCommit(false);


            // =================================================
            // REQUEST SQL
            // =================================================

            String requestSql =

                    "INSERT INTO stock_requests (" +

                    "request_id, " +
                    "request_date, " +
                    "required_by_date, " +
                    "priority, " +
                    "request_status, " +

                    "shop_name, " +
                    "shop_id, " +
                    "owner_manager, " +
                    "shop_phone, " +
                    "shop_email, " +
                    "shop_address, " +

                    "supplier_name, " +
                    "supplier_id, " +
                    "contact_person, " +
                    "supplier_phone, " +
                    "supplier_email, " +
                    "supplier_address, " +

                    "delivery_address, " +
                    "preferred_delivery_date, " +
                    "preferred_delivery_time, " +
                    "delivery_instructions, " +

                    "reason_for_request, " +
                    "remarks, " +

                    "attachment_name, " +
                    "attachment_type, " +
                    "attachment_path, " +

                    "total_number_of_products, " +
                    "total_requested_quantity, " +
                    "estimated_total_amount, " +
                    "discount, " +
                    "tax, " +
                    "delivery_charges, " +
                    "final_estimated_amount" +

                    ") VALUES (" +

                    "?, ?, ?, ?, ?, " +

                    "?, ?, ?, ?, ?, ?, " +

                    "?, ?, ?, ?, ?, ?, " +

                    "?, ?, ?, ?, " +

                    "?, ?, " +

                    "?, ?, ?, " +

                    "?, ?, ?, ?, ?, ?, ?" +

                    ")";


            PreparedStatement statement =
                    connection.prepareStatement(
                            requestSql
                    );


            int i = 1;


            statement.setString(
                    i++,
                    requestId
            );


            statement.setDate(
                    i++,
                    Date.valueOf(requestDate)
            );


            statement.setDate(
                    i++,
                    Date.valueOf(requiredByDate)
            );


            statement.setString(
                    i++,
                    priority
            );


            statement.setString(
                    i++,
                    requestStatus
            );


            // SHOP

            statement.setString(
                    i++,
                    shopName
            );


            statement.setString(
                    i++,
                    shopId
            );


            statement.setString(
                    i++,
                    ownerManager
            );


            statement.setString(
                    i++,
                    shopPhone
            );


            statement.setString(
                    i++,
                    shopEmail
            );


            statement.setString(
                    i++,
                    shopAddress
            );


            // SUPPLIER

            statement.setString(
                    i++,
                    supplierName
            );


            statement.setString(
                    i++,
                    supplierId
            );


            statement.setString(
                    i++,
                    contactPerson
            );


            statement.setString(
                    i++,
                    supplierPhone
            );


            statement.setString(
                    i++,
                    supplierEmail
            );


            statement.setString(
                    i++,
                    supplierAddress
            );


            // DELIVERY

            statement.setString(
                    i++,
                    deliveryAddress
            );


            setNullableDate(
                    statement,
                    i++,
                    deliveryDate
            );


            setNullableTime(
                    statement,
                    i++,
                    deliveryTime
            );


            statement.setString(
                    i++,
                    deliveryInstructions
            );


            // ADDITIONAL

            statement.setString(
                    i++,
                    reasonForRequest
            );


            statement.setString(
                    i++,
                    remarks
            );


            // ATTACHMENT

            statement.setString(
                    i++,
                    attachmentName
            );


            statement.setString(
                    i++,
                    attachmentType
            );


            statement.setString(
                    i++,
                    attachmentPath
            );


            // AMOUNT

            statement.setInt(
                    i++,
                    totalProducts
            );


            statement.setDouble(
                    i++,
                    totalQuantity
            );


            statement.setDouble(
                    i++,
                    estimatedAmount
            );


            statement.setDouble(
                    i++,
                    discount
            );


            statement.setDouble(
                    i++,
                    tax
            );


            statement.setDouble(
                    i++,
                    deliveryCharges
            );


            statement.setDouble(
                    i++,
                    finalAmount
            );


            statement.executeUpdate();


            statement.close();


            // =================================================
            // PRODUCTS
            // =================================================

            List<String> productObjects =
                    parser.getArrayObjects(
                            "products"
                    );


            String productSql =

                    "INSERT INTO stock_request_products (" +

                    "request_id, " +
                    "product_id, " +
                    "product_name, " +
                    "category, " +
                    "current_stock, " +
                    "minimum_stock_level, " +
                    "requested_quantity, " +
                    "unit, " +
                    "last_purchase_price, " +
                    "expected_quoted_price, " +
                    "reason_for_refill" +

                    ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


            PreparedStatement productStatement =
                    connection.prepareStatement(
                            productSql
                    );


            for (
                    String productJson :
                    productObjects
            ) {


                SimpleJsonParser product =
                        new SimpleJsonParser(
                                productJson
                        );


                int p = 1;


                productStatement.setString(
                        p++,
                        requestId
                );


                productStatement.setString(
                        p++,
                        product.getString(
                                "productId"
                        )
                );


                productStatement.setString(
                        p++,
                        product.getString(
                                "productName"
                        )
                );


                productStatement.setString(
                        p++,
                        product.getString(
                                "category"
                        )
                );


                productStatement.setDouble(
                        p++,
                        product.getDouble(
                                "currentStock"
                        )
                );


                productStatement.setDouble(
                        p++,
                        product.getDouble(
                                "minimumStock"
                        )
                );


                productStatement.setDouble(
                        p++,
                        product.getDouble(
                                "requestedQuantity"
                        )
                );


                productStatement.setString(
                        p++,
                        product.getString(
                                "unit"
                        )
                );


                productStatement.setDouble(
                        p++,
                        product.getDouble(
                                "lastPurchasePrice"
                        )
                );


                productStatement.setDouble(
                        p++,
                        product.getDouble(
                                "quotedPrice"
                        )
                );


                productStatement.setString(
                        p++,
                        product.getString(
                                "reason"
                        )
                );


                productStatement.executeUpdate();

            }


            productStatement.close();


            connection.commit();


            System.out.println(
                    "Request saved: " +
                            requestId
            );


        } catch (Exception e) {


            if (connection != null) {

                connection.rollback();

            }


            throw e;


        } finally {


            if (connection != null) {

                connection.close();

            }

        }

    }


    // =====================================================
    // SAVE ATTACHMENT
    // =====================================================

    private static String saveAttachment(
            String requestId,
            String fileName,
            String base64Data)
            throws IOException {


        String folder =
                "uploads";


        Files.createDirectories(
                Paths.get(folder)
        );


        String safeFileName =
                fileName.replaceAll(
                        "[^a-zA-Z0-9._-]",
                        "_"
                );


        String finalFileName =
                requestId +
                        "_" +
                        safeFileName;


        Path filePath =
                Paths.get(
                        folder,
                        finalFileName
                );


        byte[] data =
                Base64.getDecoder().decode(
                        base64Data
                );


        Files.write(
                filePath,
                data
        );


        return filePath.toString();

    }


    // =====================================================
    // DATE
    // =====================================================

    private static void setNullableDate(
            PreparedStatement statement,
            int index,
            String value)
            throws SQLException {


        if (
                value == null ||
                value.trim().isEmpty()
        ) {


            statement.setNull(
                    index,
                    Types.DATE
            );


        } else {


            statement.setDate(
                    index,
                    Date.valueOf(value)
            );

        }

    }


    // =====================================================
    // TIME
    // =====================================================

    private static void setNullableTime(
            PreparedStatement statement,
            int index,
            String value)
            throws SQLException {


        if (
                value == null ||
                value.trim().isEmpty()
        ) {


            statement.setNull(
                    index,
                    Types.TIME
            );


        } else {


            statement.setTime(
                    index,
                    Time.valueOf(
                            value + ":00"
                    )
            );

        }

    }


    // =====================================================
    // READ REQUEST BODY
    // =====================================================

    private static String readRequestBody(
            HttpExchange exchange)
            throws IOException {


        InputStream input =
                exchange.getRequestBody();


        ByteArrayOutputStream output =
                new ByteArrayOutputStream();


        byte[] buffer =
                new byte[4096];


        int length;


        while (
                (length = input.read(buffer))
                != -1
        ) {


            output.write(
                    buffer,
                    0,
                    length
            );

        }


        return output.toString(
                StandardCharsets.UTF_8
        );

    }


    // =====================================================
    // CORS
    // =====================================================

    private static void addCorsHeaders(
            HttpExchange exchange) {


        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Origin",
                        "*"
                );


        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Methods",
                        "GET, POST, OPTIONS"
                );


        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Headers",
                        "Content-Type"
                );


        exchange.getResponseHeaders()
                .set(
                        "Content-Type",
                        "application/json"
                );

    }


    // =====================================================
    // SEND RESPONSE
    // =====================================================

    private static void sendResponse(
            HttpExchange exchange,
            int status,
            String response)
            throws IOException {


        byte[] data =
                response.getBytes(
                        StandardCharsets.UTF_8
                );


        exchange.sendResponseHeaders(
                status,
                data.length
        );


        OutputStream output =
                exchange.getResponseBody();


        output.write(data);

        output.close();

    }


    // =====================================================
    // SIMPLE JSON PARSER
    // =====================================================

    static class SimpleJsonParser {


        private final String json;


        SimpleJsonParser(String json) {

            this.json =
                    json.trim();

        }


        // -------------------------------------------------
        // STRING VALUE
        // -------------------------------------------------

        String getString(String key) {


            String value =
                    findValue(
                            json,
                            key
                    );


            return cleanString(value);

        }


        // -------------------------------------------------
        // DOUBLE VALUE
        // -------------------------------------------------

        double getDouble(String key) {


            String value =
                    findValue(
                            json,
                            key
                    );


            if (
                    value == null ||
                    value.isEmpty()
            ) {

                return 0;

            }


            try {

                return Double.parseDouble(
                        value
                );

            } catch (Exception e) {

                return 0;

            }

        }


        // -------------------------------------------------
        // INTEGER VALUE
        // -------------------------------------------------

        int getInt(String key) {


            String value =
                    findValue(
                            json,
                            key
                    );


            if (
                    value == null ||
                    value.isEmpty()
            ) {

                return 0;

            }


            try {

                return Integer.parseInt(
                        value
                );

            } catch (Exception e) {

                return 0;

            }

        }


        // -------------------------------------------------
        // NESTED STRING
        // -------------------------------------------------

        String getNestedString(
                String objectName,
                String key) {


            String object =
                    getObject(
                            objectName
                    );


            if (object == null) {

                return null;

            }


            return cleanString(
                    findValue(
                            object,
                            key
                    )
            );

        }


        // -------------------------------------------------
        // DEEP NESTED STRING
        // -------------------------------------------------

        String getNestedString(
                String objectName,
                String childObject,
                String key) {


            String object =
                    getObject(
                            objectName
                    );


            if (object == null) {

                return null;

            }


            String child =
                    getObjectFrom(
                            object,
                            childObject
                    );


            if (child == null) {

                return null;

            }


            return cleanString(
                    findValue(
                            child,
                            key
                    )
            );

        }


        // -------------------------------------------------
        // NESTED DOUBLE
        // -------------------------------------------------

        double getNestedDouble(
                String objectName,
                String key) {


            String value =
                    getNestedString(
                            objectName,
                            key
                    );


            if (
                    value == null ||
                    value.isEmpty()
            ) {

                return 0;

            }


            try {

                return Double.parseDouble(
                        value
                );

            } catch (Exception e) {

                return 0;

            }

        }


        // -------------------------------------------------
        // NESTED INTEGER
        // -------------------------------------------------

        int getNestedInt(
                String objectName,
                String key) {


            String value =
                    getNestedString(
                            objectName,
                            key
                    );


            if (
                    value == null ||
                    value.isEmpty()
            ) {

                return 0;

            }


            try {

                return Integer.parseInt(
                        value
                );

            } catch (Exception e) {

                return 0;

            }

        }


        // -------------------------------------------------
        // GET OBJECT
        // -------------------------------------------------

        private String getObject(
                String objectName) {


            return getObjectFrom(
                    json,
                    objectName
            );

        }


        // -------------------------------------------------
        // GET OBJECT FROM JSON
        // -------------------------------------------------

        private String getObjectFrom(
                String source,
                String objectName) {


            String key =
                    "\"" +
                            objectName +
                            "\"";


            int keyPosition =
                    source.indexOf(key);


            if (keyPosition == -1) {

                return null;

            }


            int colon =
                    source.indexOf(
                            ":",
                            keyPosition +
                                    key.length()
                    );


            if (colon == -1) {

                return null;

            }


            int start =
                    source.indexOf(
                            "{",
                            colon
                    );


            if (start == -1) {

                return null;

            }


            int end =
                    findClosingBracket(
                            source,
                            start,
                            '{',
                            '}'
                    );


            if (end == -1) {

                return null;

            }


            return source.substring(
                    start,
                    end + 1
            );

        }


        // -------------------------------------------------
        // FIND VALUE
        // -------------------------------------------------

        private String findValue(
                String source,
                String key) {


            String search =
                    "\"" +
                            key +
                            "\"";


            int keyPosition =
                    source.indexOf(
                            search
                    );


            if (keyPosition == -1) {

                return null;

            }


            int colon =
                    source.indexOf(
                            ":",
                            keyPosition +
                                    search.length()
                    );


            if (colon == -1) {

                return null;

            }


            int start =
                    colon + 1;


            while (
                    start < source.length() &&
                    Character.isWhitespace(
                            source.charAt(start)
                    )
            ) {

                start++;

            }


            if (
                    start >= source.length()
            ) {

                return null;

            }


            // STRING

            if (
                    source.charAt(start)
                    == '"'
            ) {


                int end =
                        start + 1;


                while (
                        end < source.length()
                ) {


                    if (
                            source.charAt(end)
                            == '"' &&
                            source.charAt(end - 1)
                            != '\\'
                    ) {

                        break;

                    }


                    end++;

                }


                return source.substring(
                        start,
                        Math.min(
                                end + 1,
                                source.length()
                        )
                );

            }


            // OBJECT

            if (
                    source.charAt(start)
                    == '{'
            ) {


                int end =
                        findClosingBracket(
                                source,
                                start,
                                '{',
                                '}'
                        );


                if (end == -1) {

                    return null;

                }


                return source.substring(
                        start,
                        end + 1
                );

            }


            // ARRAY

            if (
                    source.charAt(start)
                    == '['
            ) {


                int end =
                        findClosingBracket(
                                source,
                                start,
                                '[',
                                ']'
                        );


                if (end == -1) {

                    return null;

                }


                return source.substring(
                        start,
                        end + 1
                );

            }


            // NUMBER / BOOLEAN / NULL

            int end =
                    start;


            while (
                    end < source.length()
            ) {


                char character =
                        source.charAt(end);


                if (
                        character == ',' ||
                        character == '}'
                ) {

                    break;

                }


                end++;

            }


            return source.substring(
                    start,
                    end
            ).trim();

        }


        // -------------------------------------------------
        // CLEAN STRING
        // -------------------------------------------------

        private String cleanString(
                String value) {


            if (
                    value == null ||
                    value.equals("null")
            ) {

                return null;

            }


            value =
                    value.trim();


            if (
                    value.startsWith("\"") &&
                    value.endsWith("\"")
            ) {


                value =
                        value.substring(
                                1,
                                value.length() - 1
                        );


                value =
                        value.replace(
                                "\\\"",
                                "\""
                        );


                value =
                        value.replace(
                                "\\n",
                                "\n"
                        );


                value =
                        value.replace(
                                "\\r",
                                "\r"
                        );


                value =
                        value.replace(
                                "\\\\",
                                "\\"
                        );

            }


            return value;

        }


        // -------------------------------------------------
        // ARRAY OBJECTS
        // -------------------------------------------------

        List<String> getArrayObjects(
                String key) {


            List<String> result =
                    new ArrayList<>();


            String array =
                    findValue(
                            json,
                            key
                    );


            if (
                    array == null ||
                    array.length() < 2
            ) {

                return result;

            }


            int position = 1;


            while (
                    position < array.length() - 1
            ) {


                while (
                        position < array.length() &&
                        (
                                Character.isWhitespace(
                                        array.charAt(position)
                                ) ||
                                array.charAt(position)
                                        == ','
                        )
                ) {

                    position++;

                }


                if (
                        position >= array.length() - 1
                ) {

                    break;

                }


                if (
                        array.charAt(position)
                                != '{'
                ) {

                    break;

                }


                int end =
                        findClosingBracket(
                                array,
                                position,
                                '{',
                                '}'
                        );


                if (end == -1) {

                    break;

                }


                result.add(
                        array.substring(
                                position,
                                end + 1
                        )
                );


                position =
                        end + 1;

            }


            return result;

        }


        // -------------------------------------------------
        // FIND CLOSING BRACKET
        // -------------------------------------------------

        private int findClosingBracket(
                String text,
                int start,
                char open,
                char close) {


            int count = 0;

            boolean insideString = false;

            boolean escaped = false;


            for (
                    int i = start;
                    i < text.length();
                    i++
            ) {


                char c =
                        text.charAt(i);


                if (
                        c == '"' &&
                        !escaped
                ) {

                    insideString =
                            !insideString;

                }


                if (!insideString) {


                    if (c == open) {

                        count++;

                    }


                    if (c == close) {

                        count--;


                        if (count == 0) {

                            return i;

                        }

                    }

                }


                if (
                        c == '\\' &&
                        !escaped
                ) {

                    escaped = true;

                } else {

                    escaped = false;

                }

            }


            return -1;

        }

    }

}
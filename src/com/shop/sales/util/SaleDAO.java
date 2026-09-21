package com.shop.sales.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SaleDAO {

    public int saveSale(Sale sale, SaleItem[] items) throws SQLException {

        String saleSql = """
                INSERT INTO sales
                (customer_id, subtotal, tax, grand_total, payment_method, payment_status)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        String itemSql = """
                INSERT INTO sale_items
                (sale_id, product_id, quantity, available, unit_price, discount, total)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        Connection connection = null;

        try {
            connection = DBConnection.getConnection();

            // Start transaction
            connection.setAutoCommit(false);

            int saleId;

            // Save sale
            try (PreparedStatement saleStatement =
                         connection.prepareStatement(
                                 saleSql,
                                 PreparedStatement.RETURN_GENERATED_KEYS)) {

                saleStatement.setInt(1, sale.getCustomerId());
                saleStatement.setDouble(2, sale.getSubtotal());
                saleStatement.setDouble(3, sale.getTax());
                saleStatement.setDouble(4, sale.getGrandTotal());
                saleStatement.setString(5, sale.getPaymentMethod());
                saleStatement.setString(6, sale.getPaymentStatus());

                saleStatement.executeUpdate();

                try (ResultSet keys = saleStatement.getGeneratedKeys()) {

                    if (!keys.next()) {
                        throw new SQLException("Sale ID was not generated.");
                    }

                    saleId = keys.getInt(1);
                }
            }

            // Save sale items
            try (PreparedStatement itemStatement =
                         connection.prepareStatement(itemSql)) {

                for (SaleItem item : items) {

                    itemStatement.setInt(1, saleId);
                    itemStatement.setInt(2, item.getProductId());
                    itemStatement.setInt(3, item.getQuantity());
                    itemStatement.setInt(4, item.getAvailable());
                    itemStatement.setDouble(5, item.getUnitPrice());
                    itemStatement.setDouble(6, item.getDiscount());
                    itemStatement.setDouble(7, item.getTotal());

                    itemStatement.addBatch();
                }

                itemStatement.executeBatch();
            }

            // Save everything
            connection.commit();

            return saleId;

        } catch (SQLException e) {

            // Undo if anything fails
            if (connection != null) {
                connection.rollback();
            }

            throw e;

        } finally {

            if (connection != null) {
                connection.setAutoCommit(true);
                connection.close();
            }
        }
    }
}
package purchase;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/purchase_db";

    private static final String USER =
            "root";

    private static final String PASSWORD =
            "";

    public static Connection getConnection() {

        Connection connection = null;

        try {

            Class.forName("com.mysql.cj.jdbc.Driver");

            connection = DriverManager.getConnection(
                    URL,
                    USER,
                    PASSWORD
            );

            System.out.println(
                    "MySQL Database Connected Successfully"
            );

        } catch (Exception e) {

            System.out.println(
                    "Database Connection Failed"
            );

            e.printStackTrace();
        }

        return connection;
    }
}
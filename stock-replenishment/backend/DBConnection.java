package BUILDING_APPLICATION;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/buildmart_db";

    private static final String USER =
            "root";

    private static final String PASSWORD =
            "root";


    static {

        try {

            Class.forName("com.mysql.cj.jdbc.Driver");

        } catch (ClassNotFoundException e) {

            e.printStackTrace();

        }

    }


    public static Connection getConnection()
            throws SQLException {

        return DriverManager.getConnection(
                URL,
                USER,
                PASSWORD
        );

    }


    public static void testConnection() {

        try {

            Connection connection =
                    getConnection();

            System.out.println(
                    "Database Connected Successfully!"
            );

            connection.close();

        } catch (SQLException e) {

            System.out.println(
                    "Database Connection Failed!"
            );

            e.printStackTrace();

        }

    }

}
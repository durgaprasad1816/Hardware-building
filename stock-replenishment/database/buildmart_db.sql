-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 18, 2026 at 12:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buildmart_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `stock_requests`
--

CREATE TABLE `stock_requests` (
  `id` int(11) NOT NULL,
  `request_id` varchar(50) NOT NULL,
  `request_date` date NOT NULL,
  `required_by_date` date NOT NULL,
  `priority` enum('Low','Medium','High','Urgent') NOT NULL,
  `request_status` enum('Pending','Approved','Rejected','Fulfilled','Draft') DEFAULT 'Pending',
  `shop_name` varchar(150) NOT NULL,
  `shop_id` varchar(50) NOT NULL,
  `owner_manager` varchar(150) NOT NULL,
  `shop_phone` varchar(30) NOT NULL,
  `shop_email` varchar(150) NOT NULL,
  `shop_address` text NOT NULL,
  `supplier_name` varchar(150) NOT NULL,
  `supplier_id` varchar(50) NOT NULL,
  `contact_person` varchar(150) NOT NULL,
  `supplier_phone` varchar(30) NOT NULL,
  `supplier_email` varchar(150) NOT NULL,
  `supplier_address` text NOT NULL,
  `delivery_address` text NOT NULL,
  `preferred_delivery_date` date DEFAULT NULL,
  `preferred_delivery_time` time DEFAULT NULL,
  `delivery_instructions` text DEFAULT NULL,
  `reason_for_request` text NOT NULL,
  `remarks` text DEFAULT NULL,
  `attachment_name` varchar(255) DEFAULT NULL,
  `attachment_type` varchar(100) DEFAULT NULL,
  `attachment_path` varchar(500) DEFAULT NULL,
  `total_number_of_products` int(11) DEFAULT 0,
  `total_requested_quantity` decimal(15,2) DEFAULT 0.00,
  `estimated_total_amount` decimal(15,2) DEFAULT 0.00,
  `discount` decimal(15,2) DEFAULT 0.00,
  `tax` decimal(15,2) DEFAULT 0.00,
  `delivery_charges` decimal(15,2) DEFAULT 0.00,
  `final_estimated_amount` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_request_products`
--

CREATE TABLE `stock_request_products` (
  `id` int(11) NOT NULL,
  `request_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `current_stock` decimal(15,2) NOT NULL,
  `minimum_stock_level` decimal(15,2) NOT NULL,
  `requested_quantity` decimal(15,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `last_purchase_price` decimal(15,2) DEFAULT 0.00,
  `expected_quoted_price` decimal(15,2) DEFAULT 0.00,
  `reason_for_refill` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `stock_requests`
--
ALTER TABLE `stock_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `request_id` (`request_id`),
  ADD KEY `idx_request_status` (`request_status`),
  ADD KEY `idx_request_date` (`request_date`),
  ADD KEY `idx_shop_id` (`shop_id`),
  ADD KEY `idx_supplier_id` (`supplier_id`);

--
-- Indexes for table `stock_request_products`
--
ALTER TABLE `stock_request_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `stock_requests`
--
ALTER TABLE `stock_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_request_products`
--
ALTER TABLE `stock_request_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stock_request_products`
--
ALTER TABLE `stock_request_products`
  ADD CONSTRAINT `stock_request_products_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `stock_requests` (`request_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

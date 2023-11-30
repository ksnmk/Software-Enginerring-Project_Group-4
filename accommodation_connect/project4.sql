-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2023 at 06:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project4`
--

-- --------------------------------------------------------

--
-- Table structure for table `billpayment`
--

CREATE TABLE `billpayment` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `property_id` int(11) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payment_data`)),
  `payment_status` varchar(255) DEFAULT NULL,
  `payment_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billpayment`
--

INSERT INTO `billpayment` (`payment_id`, `user_id`, `property_id`, `payment_method`, `payment_data`, `payment_status`, `payment_time`) VALUES
(15, 3, 10, 'Credit/Debit Card', '{\"cardNo\":\"random\",\"validity\":\"12/12\",\"expiry\":\"21/21\",\"cvv\":\"123\",\"cardHolderName\":\"random rao\"}', 'Paid', '2023-11-04 07:59:29'),
(16, 2, 14, 'UPI', '{\"phoneNumber\":\"112345666666667\"}', 'Paid', '2023-11-29 04:55:38'),
(17, 2, 10, 'UPI', '{\"phoneNumber\":\"7671831838\"}', 'Paid', '2023-11-29 05:10:23'),
(18, 2, 13, 'UPI', '{\"phoneNumber\":\"7671831838\"}', 'Paid', '2023-11-29 05:22:20');

-- --------------------------------------------------------

--
-- Table structure for table `landlords`
--

CREATE TABLE `landlords` (
  `landlord_id` int(11) NOT NULL,
  `firstname` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `username` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `contact_no` bigint(20) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `landlords`
--

INSERT INTO `landlords` (`landlord_id`, `firstname`, `lastname`, `username`, `email`, `contact_no`, `password`) VALUES
(1, 'sample', 'sample', 'sample', 'sampleuser@gmail.com', 9582314675, 'sampleuser'),
(2, 'yash', 'yash', 'yash', 'yash@gmail.com', 9885451274, 'yashyash');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `notification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `sender_id`, `recipient_id`, `message`, `notification_time`) VALUES
(9, 3, 1, 'Verification completed for property Osama Property from asd.', '2023-11-04 07:59:16'),
(10, 3, 1, 'Payment of 35 has been received for property Osama Property from asd.', '2023-11-04 07:59:29'),
(11, 2, 1, 'Verification completed for property Osama from Ram.', '2023-11-29 04:55:24'),
(12, 2, 1, 'Payment of 600 has been received for property Osama from Ram.', '2023-11-29 04:55:38'),
(13, 2, 1, 'Verification completed for property Osama Property from Ram.', '2023-11-29 05:10:17'),
(14, 2, 1, 'Payment of 35 has been received for property Osama Property from Ram.', '2023-11-29 05:10:23'),
(15, 2, 1, 'Verification completed for property Yahoo properties from Ram.', '2023-11-29 05:11:40'),
(16, 2, 1, 'Verification completed for property Yahoo properties from Ram.', '2023-11-29 05:14:06'),
(17, 2, 1, 'Payment of 50 has been received for property Yahoo properties from Ram.', '2023-11-29 05:22:20');

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `problem` text DEFAULT NULL,
  `solution` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`id`, `name`, `email`, `location`, `problem`, `solution`) VALUES
(4, 'Suresh', 'Suresh@virtusa.com', 'New Jersey', 'I need temporary accomadation in new jersey', 'Please Contact this number 123454');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `property_id` int(11) NOT NULL,
  `landlord_id` int(11) NOT NULL,
  `property_type` varchar(50) NOT NULL,
  `property_name` varchar(120) NOT NULL,
  `location` varchar(100) NOT NULL,
  `rent` decimal(10,2) NOT NULL,
  `bedrooms` int(11) NOT NULL,
  `max_members` int(11) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`property_id`, `landlord_id`, `property_type`, `property_name`, `location`, `rent`, `bedrooms`, `max_members`, `description`, `image_path`) VALUES
(10, 1, 'apartment', 'Osama Property', 'beside apartment', 35.00, 3, 3, 'good', 'uploads\\image-1697091598102.jpg'),
(13, 1, 'apartment', 'Yahoo properties', 'beside apartment', 50.00, 2, 3, 'good', 'uploads\\image-1697089864973.jpg'),
(14, 1, 'Room', 'Osama', 'New Jersey', 600.00, 6, 4, 'Good Atmosphere', 'uploads\\image-1697090024470.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `report_type` varchar(50) DEFAULT NULL,
  `report_text` text DEFAULT NULL,
  `reported_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`report_id`, `user_id`, `report_type`, `report_text`, `reported_at`) VALUES
(1, 3, 'Fraud', 'asdasd', '2023-10-12 14:26:19'),
(2, 3, 'Fraud', 'asd', '2023-10-12 14:26:26'),
(3, 3, 'Fraud', 'sasd', '2023-10-12 14:49:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `username` varchar(120) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_no` bigint(20) NOT NULL,
  `password` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `username`, `email`, `contact_no`, `password`) VALUES
(2, 'Ram', 'Raju', 'Ram_raj', 'ram@gmail.com', 9685741235, 'ramaraju'),
(3, 'asd', 'asd', 'asd', 'asd@gmail.com', 9856745124, 'asdasdasd'),
(6, 'arjun', 'arjun', 'arjun', 'arjun@gmail.com', 9456823147, 'arjunarjun'),
(7, 'test', 'test', 'test', 'test@gmail.com', 8574965896, 'testtest'),
(8, 'robo', 'robo', 'robo', 'robo@gmail.com', 9876543212, 'roborobo');

-- --------------------------------------------------------

--
-- Table structure for table `verification`
--

CREATE TABLE `verification` (
  `verification_id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `passport_number` varchar(20) NOT NULL,
  `us_since_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verification`
--

INSERT INTO `verification` (`verification_id`, `property_id`, `user_id`, `passport_number`, `us_since_date`) VALUES
(1, 10, 3, 'asd123asd123', '2022-11-19'),
(9, 10, 2, '1231231231', '2022-06-02'),
(16, 13, 2, 'rqweq21231', '2021-02-04'),
(17, 14, 2, 'asdasdas', '2023-11-02'),
(18, 14, 2, '5598745@ASa', '2020-06-04'),
(19, 13, 3, 'asdasdasd', '2019-07-04'),
(20, 14, 3, 'ASG234AS', '2022-06-04'),
(21, 10, 3, '25465A12', '2021-07-04'),
(22, 14, 2, 'Welcome123', '2023-11-15'),
(23, 10, 2, '12345', '2023-11-30'),
(24, 13, 2, '134552', '2023-11-22'),
(25, 13, 2, '1323', '2023-11-21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billpayment`
--
ALTER TABLE `billpayment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `landlords`
--
ALTER TABLE `landlords`
  ADD PRIMARY KEY (`landlord_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recipient_id` (`recipient_id`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`property_id`),
  ADD KEY `landlord_id` (`landlord_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `verification`
--
ALTER TABLE `verification`
  ADD PRIMARY KEY (`verification_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billpayment`
--
ALTER TABLE `billpayment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `landlords`
--
ALTER TABLE `landlords`
  MODIFY `landlord_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `property_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `verification`
--
ALTER TABLE `verification`
  MODIFY `verification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billpayment`
--
ALTER TABLE `billpayment`
  ADD CONSTRAINT `billpayment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `billpayment_ibfk_2` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `landlords` (`landlord_id`);

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`landlord_id`) REFERENCES `landlords` (`landlord_id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `verification`
--
ALTER TABLE `verification`
  ADD CONSTRAINT `verification_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`),
  ADD CONSTRAINT `verification_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2024 at 10:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `empower_her`
--

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `limit` int(11) NOT NULL DEFAULT -1,
  `amount` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `title`, `code`, `limit`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, '17% Discount', 'SAVE17', -1, 1, '2024-09-30 08:24:48', '2024-09-30 08:24:48');

-- --------------------------------------------------------

--
-- Table structure for table `discover_her_contents`
--

CREATE TABLE `discover_her_contents` (
  `id` int(11) NOT NULL,
  `category` enum('article','video','tools') NOT NULL,
  `header_file` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `date` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discover_her_contents`
--

INSERT INTO `discover_her_contents` (`id`, `category`, `header_file`, `title`, `description`, `is_active`, `date`, `createdAt`, `updatedAt`) VALUES
(1, 'article', 'http://localhost:8080/uploads/header_file-1727685292903-493650629.jpg', 'Empowering Women in Tech', 'An article discussing the rise of women in the tech industry', 1, '2023-09-01 00:00:00', '2024-09-30 08:34:52', '2024-09-30 08:34:52');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` enum('online','on-site','both') NOT NULL,
  `category` enum('event','workshop') NOT NULL,
  `status` enum('upcoming','cancelled','ongoing') NOT NULL DEFAULT 'upcoming',
  `Languages` enum('english','french','arabic') NOT NULL DEFAULT 'english',
  `price` double NOT NULL,
  `is_accepted` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `user_id`, `image`, `title`, `description`, `date`, `start_time`, `end_time`, `location`, `type`, `category`, `status`, `Languages`, `price`, `is_accepted`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'http://localhost:8080/uploads/image-1727683659935-266221386.jpg', 'trying automatic ticket creation', 'Alha ystur yarab nasrak', '2024-09-17', '09:00:00', '04:00:00', '27 Main St, City', 'both', 'workshop', 'upcoming', 'english', 37.77, 0, '2024-09-30 08:07:39', '2024-09-30 08:07:39');

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE `forms` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `status` enum('new','inprogress','responded','closed') NOT NULL DEFAULT 'new',
  `type` enum('sponsorship') DEFAULT 'sponsorship'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forms`
--

INSERT INTO `forms` (`id`, `first_name`, `last_name`, `email`, `phone_number`, `content`, `category`, `organization`, `status`, `type`) VALUES
(1, 'John', 'Doe', 'johndoe@example.com', '123-456-7890', 'I would like to inquire about partnership opportunities.', 'contact_us', NULL, 'new', 'sponsorship');

-- --------------------------------------------------------

--
-- Table structure for table `get_involved_programs`
--

CREATE TABLE `get_involved_programs` (
  `id` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `get_involved_programs`
--

INSERT INTO `get_involved_programs` (`id`, `icon`, `title`, `description`, `is_active`, `createdAt`, `updatedAt`) VALUES
(1, 'https://example.com/icon.png', 'Volunteer Program', 'Join our efforts to make a difference.', 0, '2024-09-30 08:25:44', '2024-09-30 08:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `information_contacts`
--

CREATE TABLE `information_contacts` (
  `id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `value` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `information_contacts`
--

INSERT INTO `information_contacts` (`id`, `image`, `title`, `description`, `value`, `type`) VALUES
(1, 'http://localhost:8080/uploads/image-1727683749496-314581552.jpg', 'LinkedIn2', 'connect with us on LinkedIn', 'https://linkedin.com/company/empowerher', 'social_link');

-- --------------------------------------------------------

--
-- Table structure for table `memberships`
--

CREATE TABLE `memberships` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` enum('individual','corporate','basic') NOT NULL DEFAULT 'basic',
  `start_date` datetime NOT NULL,
  `expiry_date` datetime NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `memberships`
--

INSERT INTO `memberships` (`id`, `title`, `description`, `type`, `start_date`, `expiry_date`, `price`, `createdAt`, `updatedAt`) VALUES
(1, 'Baisc Membership', 'Access to all premium content and events.', 'individual', '2024-09-17 00:00:00', '2024-10-17 00:00:00', 0, '2024-09-30 08:24:30', '2024-09-30 08:24:30');

-- --------------------------------------------------------

--
-- Table structure for table `nomination_types`
--

CREATE TABLE `nomination_types` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nomination_types`
--

INSERT INTO `nomination_types` (`id`, `title`, `is_active`, `createdAt`, `updatedAt`) VALUES
(1, 'Outstanding Leadership', 1, '2024-09-30 08:10:01', '2024-09-30 08:10:01');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `header_image` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `header_image`, `title`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'http://localhost:8080/uploads/header_image-1727684957751-979180521.jpg', 'WESA', 'this is the wesa home page', '2024-09-30 08:29:17', '2024-09-30 08:29:17');

-- --------------------------------------------------------

--
-- Table structure for table `page_sections`
--

CREATE TABLE `page_sections` (
  `id` int(11) NOT NULL,
  `page_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `position` enum('left','right','center') NOT NULL,
  `type` enum('content_box','list') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_sections`
--

INSERT INTO `page_sections` (`id`, `page_id`, `title`, `description`, `image`, `position`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Event Objective', 'The objective of the event is to empower women in the energy sector', 'http://localhost:8080/uploads/image-1727685266525-837291244.mp4', 'left', 'content_box', '2024-09-30 08:34:26', '2024-09-30 08:34:26');

-- --------------------------------------------------------

--
-- Table structure for table `partnership_types`
--

CREATE TABLE `partnership_types` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partnership_types`
--

INSERT INTO `partnership_types` (`id`, `title`, `is_active`, `createdAt`, `updatedAt`) VALUES
(1, 'Corporate Partnership', 1, '2024-09-30 08:09:49', '2024-09-30 08:09:49');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'read_user', '2024-09-28 13:00:18', '2024-09-28 13:00:18'),
(2, 'create_user', '2024-09-28 13:00:32', '2024-09-28 13:00:32'),
(3, 'update_user', '2024-09-28 13:00:41', '2024-09-28 13:00:41'),
(4, 'delete_user', '2024-09-28 13:00:49', '2024-09-28 13:00:49'),
(5, 'read_event', '2024-09-28 13:01:35', '2024-09-28 13:01:35'),
(6, 'create_event', '2024-09-28 13:01:42', '2024-09-28 13:01:42'),
(7, 'update_event', '2024-09-28 13:01:54', '2024-09-28 13:01:54'),
(8, 'delete_event', '2024-09-28 13:02:02', '2024-09-28 13:02:02'),
(9, 'read_reserved-events', '2024-09-28 13:03:27', '2024-09-28 13:03:27'),
(10, 'create_reserved-events', '2024-09-28 13:03:34', '2024-09-28 13:03:34'),
(11, 'update_reserved-events', '2024-09-28 13:03:42', '2024-09-28 13:03:42'),
(12, 'delete_reserved-events', '2024-09-28 13:03:51', '2024-09-28 13:03:51');

-- --------------------------------------------------------

--
-- Table structure for table `reserved_events`
--

CREATE TABLE `reserved_events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL DEFAULT 1,
  `coupon_used_id` int(11) DEFAULT NULL,
  `payment_data` varchar(255) NOT NULL,
  `ticket_quantity` int(11) NOT NULL,
  `total_price` double NOT NULL,
  `is_paid` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reserved_events`
--

INSERT INTO `reserved_events` (`id`, `user_id`, `event_id`, `ticket_id`, `coupon_used_id`, `payment_data`, `ticket_quantity`, `total_price`, `is_paid`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, NULL, 'Payment receipt details2', 2, 75.54, 0, '2024-09-30 08:25:10', '2024-09-30 08:25:10');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'User', '2024-09-28 12:59:21', '2024-09-28 12:59:21'),
(2, 'Admin', '2024-09-28 12:59:29', '2024-09-28 12:59:29'),
(3, 'Operator', '2024-09-30 07:26:51', '2024-09-30 07:26:51');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `createdAt`, `updatedAt`) VALUES
(1, 2, 1, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(2, 2, 2, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(3, 2, 3, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(4, 2, 4, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(5, 2, 5, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(6, 2, 6, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(7, 2, 7, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(8, 2, 8, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(9, 2, 9, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(10, 2, 10, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(11, 2, 11, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(12, 2, 12, '2024-09-28 13:06:40', '2024-09-28 13:06:40'),
(13, 1, 1, '2024-09-28 13:08:13', '2024-09-28 13:08:13'),
(14, 1, 5, '2024-09-28 13:08:13', '2024-09-28 13:08:13'),
(15, 1, 9, '2024-09-28 13:08:13', '2024-09-28 13:08:13');

-- --------------------------------------------------------

--
-- Table structure for table `static_pages`
--

CREATE TABLE `static_pages` (
  `id` int(11) NOT NULL,
  `key` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `static_pages`
--

INSERT INTO `static_pages` (`id`, `key`, `image`, `title`, `description`, `button_text`, `button_link`, `createdAt`, `updatedAt`) VALUES
(1, 'home7', 'http://localhost:8080/uploads/image-1727684842956-343184594.png', 'Welcome to Empower Her', 'Empowering women through education and collaboration.', 'https://example.com/home.jpg', 'BUTTON', '2024-09-30 08:27:22', '2024-09-30 08:27:22');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `title`, `position`, `description`, `image`, `is_active`, `createdAt`, `updatedAt`) VALUES
(1, 'ronaldo', 'webdev', 'at saudi league', 'http://localhost:8080/uploads/image-1727684791357-964367093.jpg', 1, '2024-09-30 08:26:31', '2024-09-30 08:26:31');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `qrcode` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `reserved_event_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `is_used`, `qrcode`, `amount`, `createdAt`, `updatedAt`, `reserved_event_id`) VALUES
(1, 1, 0, 'ticket-1-ab48184c-9ca9-4927-8e8a-d875a5c10dbc', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(2, 1, 0, 'ticket-1-5fabb947-9296-46c7-9e29-c685e623f29a', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(3, 1, 0, 'ticket-1-de03abe6-975a-4196-9b95-33c0b37611ae', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(4, 1, 0, 'ticket-1-89d2cd56-9b4d-4bd2-ba14-d961db040370', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(5, 1, 0, 'ticket-1-51e9f5d8-1543-48d6-ac06-f0c19cb38a7a', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(6, 1, 0, 'ticket-1-87b247da-b3a1-4864-812f-9edb52df389c', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(7, 1, 0, 'ticket-1-ffd56236-7c2b-4de7-a580-dab3d964f69d', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(8, 1, 0, 'ticket-1-1a41a078-1740-4698-8b64-8383b93df72e', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(9, 1, 0, 'ticket-1-88415338-8988-4659-bf45-c3d6ade7f8e0', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(10, 1, 0, 'ticket-1-d8be7470-c4de-44b0-bcda-533d7bf2abf0', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 1,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `newsletter_subscribed` tinyint(1) DEFAULT 0,
  `membership_role_id` varchar(255) DEFAULT 'basic',
  `membership_updated_at` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','inactive','idle') DEFAULT 'inactive',
  `is_verified` tinyint(1) DEFAULT 0,
  `is_accepted` tinyint(1) DEFAULT 0,
  `otp` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `newsletter_subscribed`, `membership_role_id`, `membership_updated_at`, `password`, `status`, `is_verified`, `is_accepted`, `otp`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'fadel', 'hmd', 'fadel.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$LS8ij5RR62qhPcPIr4eeqOWABTvXjUAEaDQeLBmG4D6KyDjiLLcQe', 'active', 1, 1, NULL, '2024-09-28 13:22:15', '2024-09-28 13:24:21');

-- --------------------------------------------------------

--
-- Table structure for table `user_tools`
--

CREATE TABLE `user_tools` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `discover_her_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_tools`
--

INSERT INTO `user_tools` (`id`, `user_id`, `discover_her_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2024-09-30 08:35:04', '2024-09-30 08:35:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discover_her_contents`
--
ALTER TABLE `discover_her_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `get_involved_programs`
--
ALTER TABLE `get_involved_programs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `information_contacts`
--
ALTER TABLE `information_contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nomination_types`
--
ALTER TABLE `nomination_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_sections`
--
ALTER TABLE `page_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_id` (`page_id`);

--
-- Indexes for table `partnership_types`
--
ALTER TABLE `partnership_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `reserved_events`
--
ALTER TABLE `reserved_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `coupon_used_id` (`coupon_used_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permissions_permission_id_role_id_unique` (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `static_pages`
--
ALTER TABLE `static_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qrcode` (`qrcode`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `reserved_event_id` (`reserved_event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_tools`
--
ALTER TABLE `user_tools`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `discover_her_id` (`discover_her_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `discover_her_contents`
--
ALTER TABLE `discover_her_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `get_involved_programs`
--
ALTER TABLE `get_involved_programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `information_contacts`
--
ALTER TABLE `information_contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `nomination_types`
--
ALTER TABLE `nomination_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `page_sections`
--
ALTER TABLE `page_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `partnership_types`
--
ALTER TABLE `partnership_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reserved_events`
--
ALTER TABLE `reserved_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `static_pages`
--
ALTER TABLE `static_pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_tools`
--
ALTER TABLE `user_tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `page_sections`
--
ALTER TABLE `page_sections`
  ADD CONSTRAINT `page_sections_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reserved_events`
--
ALTER TABLE `reserved_events`
  ADD CONSTRAINT `reserved_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reserved_events_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reserved_events_ibfk_3` FOREIGN KEY (`coupon_used_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`reserved_event_id`) REFERENCES `reserved_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_tools`
--
ALTER TABLE `user_tools`
  ADD CONSTRAINT `user_tools_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_tools_ibfk_2` FOREIGN KEY (`discover_her_id`) REFERENCES `discover_her_contents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

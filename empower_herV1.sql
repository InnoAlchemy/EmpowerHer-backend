-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 15, 2024 at 02:20 PM
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
(1, 'article', 'http://localhost:8080/uploads/header_file-1727685292903-493650629.jpg', 'Empowering Women in Tech', 'An article discussing the rise of women in the tech industry', 1, '2023-09-01 00:00:00', '2024-09-30 08:34:52', '2024-09-30 08:34:52'),
(2, 'article', 'http://localhost:8080/uploads/header_file-1728563291211-373163248.png', 'Leading the Charge: Adiba El Masri’s\nJourney in Sustainable Architecture and\nEnergy Innovation', 'Adiba El Masri is an accomplished architect and\nsustainability advocate with a strong focus on\nenergy efficiency in the built environment.\nHer journey in the energy sector was inspired...', 1, '2024-10-01 00:00:00', '2024-10-10 12:28:11', '2024-10-10 12:28:11'),
(3, 'article', 'http://localhost:8080/uploads/header_file-1728563303407-84096696.png', 'Leading the Charge: Adiba El Masri’s\nJourney in Sustainable Architecture and\nEnergy Innovation', 'Adiba El Masri is an accomplished architect and\nsustainability advocate with a strong focus on\nenergy efficiency in the built environment.\nHer journey in the energy sector was inspired...', 1, '2024-10-05 00:00:00', '2024-10-10 12:28:23', '2024-10-10 12:28:23'),
(4, 'article', 'http://localhost:8080/uploads/header_file-1728563309400-690683601.png', 'Leading the Charge: Adiba El Masri’s\nJourney in Sustainable Architecture and\nEnergy Innovation', 'Adiba El Masri is an accomplished architect and\nsustainability advocate with a strong focus on\nenergy efficiency in the built environment.\nHer journey in the energy sector was inspired...', 1, '2024-10-09 00:00:00', '2024-10-10 12:28:29', '2024-10-10 12:28:29');

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
(1, 1, 'http://localhost:8080/uploads/image-1727683659935-266221386.jpg', 'trying automatic ticket creation', 'Alha ystur yarab nasrak', '2024-09-17', '09:00:00', '04:00:00', '27 Main St, City', 'both', 'workshop', 'upcoming', 'english', 37.77, 0, '2024-09-30 08:07:39', '2024-09-30 08:07:39'),
(2, 1, 'http://localhost:8080/uploads/image-1728563509906-518129981.png', 'MEET & GREET', 'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.\nsed do eiusmod tempor\nincididunt ut labore et\ndolore', '2024-09-17', '09:00:00', '04:00:00', '27 Main St, City', 'both', 'workshop', 'upcoming', 'english', 37.77, 0, '2024-10-10 12:31:49', '2024-10-10 12:31:49'),
(3, 1, 'http://localhost:8080/uploads/image-1728563526915-408590506.png', 'MEET & GREET', 'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.\nsed do eiusmod tempor\nincididunt ut labore et\ndolore', '2024-09-12', '09:00:00', '02:00:00', '27 Main St, City', 'both', 'workshop', 'upcoming', 'english', 37.77, 0, '2024-10-10 12:32:06', '2024-10-10 12:32:06'),
(4, 1, 'http://localhost:8080/uploads/image-1728563549670-937494518.png', 'MEET & GREET', 'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.\nsed do eiusmod tempor\nincididunt ut labore et\ndolore', '2024-10-25', '09:00:00', '06:00:00', '27 Main St, City', 'both', 'workshop', 'upcoming', 'english', 37.77, 0, '2024-10-10 12:32:29', '2024-10-10 12:32:29');

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
(2, NULL, 'Facebook', 'connect with us on Facebook', 'https://facebook.com/company/empowerher', 'social_link'),
(3, NULL, 'Twitter', 'connect with us on Twitter', 'https://twitter.com/company/empowerher', 'social_link'),
(4, NULL, 'Intsagram', 'connect with us on Instagram', 'https://Instagram.com/company/empowerher', 'social_link'),
(5, NULL, '+961 71 123456', 'connect with via phone number', '+961 71 123456', 'phone_number'),
(6, NULL, '+961 70 123456', 'connect with via phone number', '+961 70 123456', 'phone_number'),
(7, NULL, 'Locations', 'where are we located', 'maps', 'location');

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
(2, 'home_about_us', 'http://localhost:8080/uploads/image-1728566413701-975478481.png', 'About Us', 'Get to Know Us: Our Story and Team\nWelcome to EmpowerHer. Energy, where we are dedicated to unlocking the power and potential of women across industries. Our platform is committed to supporting women in sectors where they are traditionally underrepresented compared to men, \nincluding STEM, leadership and executive positions, finance and  investment banking, construction, and skilled trades.  Born from a passionate desire to foster growth, empowerment, and advancement for women, EmpowerHer. Energy is a beacon of inspiration and support for women professionals, entrepreneurs, and enthusiasts alike. \nWhat to expect?\nWith a rallying cry to redefine possibilities and shatter  barriers, EmpowerHer.Energy embarks on a mission to illuminate these sectors with the brilliance and resilience of empowered women. This isn\'t just a platform; it is a movement—a journey of transformation where each empowered woman becomes a catalyst for a brighter, more inclusive energy future and where we teach men to live with empowered women.', 'Find Out More', '/find-out-more', '2024-10-08 11:12:32', '2024-10-10 14:37:51'),
(3, 'Programs & Initiatives', 'http://localhost:8080/uploads/image-1728386465323-970047489.png', 'Welcome to Empower Her', 'Empowering women through education and collaboration.', 'Programs & Initiatives', '/programs-initatives', '2024-10-08 11:21:05', '2024-10-08 11:21:05'),
(4, 'Get Involved', 'http://localhost:8080/uploads/image-1728386525273-897995602.png', 'Welcome to Empower Her', 'Empowering women through education and collaboration.', 'Get Involved', '/get-involved', '2024-10-08 11:22:05', '2024-10-08 11:22:05'),
(5, 'Discover Her', 'http://localhost:8080/uploads/image-1728386563689-212817928.png', 'Welcome to Empower Her', 'Empowering women through education and collaboration.', 'Discover Her', '/discover-her', '2024-10-08 11:22:43', '2024-10-08 11:22:43'),
(6, 'Contact Us', 'http://localhost:8080/uploads/image-1728386603174-983749170.png', 'Welcome to Empower Her', 'Empowering women through education and collaboration.', 'Contact Us', '/contact-us', '2024-10-08 11:23:23', '2024-10-08 11:23:23'),
(7, 'home_header', 'http://localhost:8080/uploads/image-1728566660505-55084170.png', 'Be Part of the  Movement to Empower Women Worldwide!', 'no', 'Become A Member', '/become-a-member', '2024-10-10 13:24:20', '2024-10-10 13:24:20');

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
(1, 'ronaldo', 'webdev', 'at saudi league', 'http://localhost:8080/uploads/image-1727684791357-964367093.jpg', 1, '2024-09-30 08:26:31', '2024-09-30 08:26:31'),
(2, 'raul', 'elcaptian', 'retired', 'http://localhost:8080/uploads/image-1728563015293-87111078.jpg', 1, '2024-10-10 12:23:35', '2024-10-10 12:23:35'),
(3, 'ramos', 'elmatador', 'free agent', 'http://localhost:8080/uploads/image-1728563067857-491997147.jpg', 1, '2024-10-10 12:24:27', '2024-10-10 12:24:27');

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
(10, 1, 0, 'ticket-1-d8be7470-c4de-44b0-bcda-533d7bf2abf0', 1, '2024-09-30 08:07:40', '2024-09-30 08:07:40', NULL),
(11, 2, 0, 'ticket-2-175f273a-61d9-40b0-9ec8-cec1f7f8efb9', 1, '2024-10-10 12:31:49', '2024-10-10 12:31:49', NULL),
(12, 2, 0, 'ticket-2-8aca3348-866b-40aa-a4d6-1973051f2c5e', 1, '2024-10-10 12:31:49', '2024-10-10 12:31:49', NULL),
(13, 2, 0, 'ticket-2-96002620-996e-48c7-8c97-739ad53bdc76', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(14, 2, 0, 'ticket-2-d8426e17-1dba-4527-89a1-1eca3821c5a8', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(15, 2, 0, 'ticket-2-9c0fda08-96a3-41bc-92be-3531d46d8072', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(16, 2, 0, 'ticket-2-08c7ddb4-93f8-4854-896c-7eaeb73bd37a', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(17, 2, 0, 'ticket-2-0f924b68-ec21-41f3-aa56-e24d8d3cdc1b', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(18, 2, 0, 'ticket-2-2c416cb3-bd66-4a14-859a-258e1453e07b', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(19, 2, 0, 'ticket-2-4aa4aea2-9891-4dc7-bfdf-dc2d8b4cb99d', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(20, 2, 0, 'ticket-2-28e9bcd7-74eb-4663-b400-9c1555865a55', 1, '2024-10-10 12:31:50', '2024-10-10 12:31:50', NULL),
(21, 3, 0, 'ticket-3-66cea205-a5e0-401f-b725-e4ea33112ef7', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(22, 3, 0, 'ticket-3-17c4837c-f4c5-46e8-b331-49d64c448004', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(23, 3, 0, 'ticket-3-b4a0f3e5-d3ea-41a2-a47c-13ecb02fe7e8', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(24, 3, 0, 'ticket-3-105f6225-f676-4047-add1-fc654bb9b335', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(25, 3, 0, 'ticket-3-6394330c-eeda-44a4-a382-012ca0b9a208', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(26, 3, 0, 'ticket-3-096746f5-8f4e-4cc2-aa07-eb8fcd3318b9', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(27, 3, 0, 'ticket-3-cfa6bcb2-1849-4e42-bdc8-be074cdddc83', 1, '2024-10-10 12:32:06', '2024-10-10 12:32:06', NULL),
(28, 3, 0, 'ticket-3-5a5fbc76-5f99-4cf5-8d7c-9edd8c91bf59', 1, '2024-10-10 12:32:07', '2024-10-10 12:32:07', NULL),
(29, 3, 0, 'ticket-3-ef65deb7-b9b8-4bea-8687-8e965d0a049d', 1, '2024-10-10 12:32:07', '2024-10-10 12:32:07', NULL),
(30, 3, 0, 'ticket-3-94f831f2-de7c-4924-b6a1-b7675448570c', 1, '2024-10-10 12:32:07', '2024-10-10 12:32:07', NULL),
(31, 4, 0, 'ticket-4-69529cde-34cb-4c89-baee-d0779e574ffc', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(32, 4, 0, 'ticket-4-32660594-688b-4f9a-980e-1fe0fe958e95', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(33, 4, 0, 'ticket-4-b5fe3af5-e056-4240-89f4-8f325caba218', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(34, 4, 0, 'ticket-4-6c94f60a-e6de-4d6a-ada6-63cec176c30b', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(35, 4, 0, 'ticket-4-0626f480-993c-4e14-852f-210a117accb0', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(36, 4, 0, 'ticket-4-3fa7e825-5fe9-4593-aa0a-a890792b0e6f', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(37, 4, 0, 'ticket-4-200fa221-7264-43e8-bd62-427777927ff2', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(38, 4, 0, 'ticket-4-dfd4029c-5306-4b49-b2d3-e961aa9ebfd9', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(39, 4, 0, 'ticket-4-1932c42e-82cf-49f3-86fa-4a37285f50a5', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL),
(40, 4, 0, 'ticket-4-566a36f3-4bd9-4008-9263-a2d953f9d393', 1, '2024-10-10 12:32:29', '2024-10-10 12:32:29', NULL);

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
(1, 2, 'fadel', 'hmd', 'fadel.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$gmhfEOgUXEO6d936GrJ5huteTpd8uWUUF7f20CVnAPB2rc4Hv.Pa.', 'active', 1, 1, NULL, '2024-09-28 13:22:15', '2024-10-15 11:11:52'),
(2, 1, 'Raul', 'Gon', 'fadelG.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$O5hcjUR6GQDFEBBGLf/rh.rPA4oIrsQ0dnt/ys7afFjWU8RJze3tK', 'inactive', 0, 0, 204008, '2024-10-15 09:05:34', '2024-10-15 09:05:34'),
(3, 1, 'Fadel', 'Hammoud', 'fadelc.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$ot3Y6m2MsYNVPDTm9zmE1eYPejVhTiNQixGIdL9JK2XlsOPBaQqry', 'inactive', 0, 0, 475247, '2024-10-15 09:12:32', '2024-10-15 09:12:32'),
(4, 1, 'Fadel', 'Hammoud', 'fadeld.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$lU8QTS3WK69R7f4SQvR8ueVTEZqC/84tpuPAIfCiCaWRC4dFWfkyK', 'inactive', 0, 0, 946772, '2024-10-15 09:33:14', '2024-10-15 09:33:14'),
(5, 1, 'Fadel', 'Hammoud', 'fadel3.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$uAwJFit.As0Vhm7znRlFUeg4FRDFeK/5RGxJjKHE/ogcQt5NytwFO', 'inactive', 0, 0, 548032, '2024-10-15 09:47:14', '2024-10-15 09:47:14'),
(6, 1, 'vegito', 'Hammoud', 'fadelV.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$BJEWr653CdSG4cvWpwSMeuNMn.almYi6YHF.yHqXiapK5fif8GL5C', 'inactive', 1, 0, 995260, '2024-10-15 09:55:53', '2024-10-15 10:00:35'),
(7, 1, 'Fadel', 'hmdw', 'fadelL.ahammoud@gmail.com', 0, 'basic', NULL, '$2b$10$Dqly8DItZTi7.mwYqTPFfuMR.PMjY5zQMSeckKPKgaBhLDWiNAXhy', 'inactive', 1, 0, NULL, '2024-10-15 10:03:38', '2024-10-15 10:05:20');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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

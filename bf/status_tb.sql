-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 18, 2015 at 01:20 AM
-- Server version: 5.5.34-cll
-- PHP Version: 5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `easysubl_easysublease`
--

-- --------------------------------------------------------

--
-- Table structure for table `status_tb`
--

CREATE TABLE IF NOT EXISTS `status_tb` (
  `id` int(10) unsigned NOT NULL,
  `isexpired` tinyint(1) unsigned NOT NULL,
  `date` datetime NOT NULL,
  `cat` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cat` (`cat`),
  KEY `date` (`date`),
  KEY `isexpired` (`isexpired`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `status_tb`
--

INSERT INTO `status_tb` (`id`, `isexpired`, `date`, `cat`) VALUES
(3, 0, '2015-03-17 05:12:35', 1),
(4, 0, '2015-03-17 05:22:05', 0),
(5, 0, '2015-03-17 05:24:34', 1),
(6, 0, '2015-03-17 05:26:23', 0),
(7, 0, '2015-03-17 05:29:00', 0),
(8, 0, '2015-03-17 05:30:33', 1),
(9, 0, '2015-03-17 05:31:39', 0),
(10, 0, '2015-03-17 05:33:02', 0),
(11, 0, '2015-03-17 05:35:39', 1),
(12, 0, '2015-03-17 05:37:28', 0),
(13, 0, '2015-03-17 05:38:33', 1),
(14, 0, '2015-03-17 05:39:39', 1),
(15, 0, '2015-03-17 05:41:11', 1),
(16, 0, '2015-03-17 05:42:19', 0),
(17, 0, '2015-03-17 05:44:09', 0),
(18, 0, '2015-03-17 05:45:32', 0),
(19, 0, '2015-03-17 05:47:45', 0),
(20, 0, '2015-03-17 05:49:41', 0),
(21, 0, '2015-03-17 05:51:35', 0),
(22, 0, '2015-03-17 05:54:25', 0),
(23, 0, '2015-03-17 05:55:41', 0),
(24, 0, '2015-03-17 05:57:24', 0),
(25, 0, '2015-03-17 05:59:35', 0),
(26, 0, '2015-03-17 06:01:34', 0),
(27, 0, '2015-03-17 06:03:33', 0),
(28, 0, '2015-03-17 06:05:33', 0),
(29, 0, '2015-03-17 06:07:17', 0),
(30, 0, '2015-03-17 06:08:38', 0),
(31, 0, '2015-03-17 06:09:38', 0),
(32, 0, '2015-03-17 06:11:23', 0),
(53, 0, '2015-03-17 21:38:18', 1),
(52, 0, '2015-03-17 21:28:59', 1),
(51, 0, '2015-03-17 20:49:33', 0),
(50, 0, '2015-03-17 20:44:54', 0),
(49, 0, '2015-03-17 20:33:43', 1),
(46, 0, '2015-03-17 10:22:14', 0),
(48, 0, '2015-03-17 20:31:25', 0),
(54, 0, '2015-03-17 21:44:36', 1),
(55, 0, '2015-03-17 21:59:37', 1),
(56, 0, '2015-03-17 22:06:22', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

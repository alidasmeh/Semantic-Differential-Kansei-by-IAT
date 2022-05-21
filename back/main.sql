-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 21, 2022 at 07:41 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `semantic_kansei`
--

-- --------------------------------------------------------

--
-- Table structure for table `main`
--

CREATE TABLE `main` (
  `id` int(11) NOT NULL,
  `fullname` varchar(200) CHARACTER SET utf8 NOT NULL,
  `date` varchar(200) NOT NULL,
  `result` text NOT NULL,
  `part` int(11) NOT NULL COMMENT '1,2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `main`
--

INSERT INTO `main` (`id`, `fullname`, `date`, `result`, `part`) VALUES
(5, 'ali', 'Sat May 21 2022 10:09:42 GMT+0430 (Iran Daylight Time)', '[{\"image\":\"a1b1c1.jpeg\",\"pair_word\":{\"word_one\":\"زشت\",\"word_two\":\"زیبا\"},\"avg_word_one\":0.6699956578376032,\"avg_word_two\":0,\"score\":-0.67},{\"image\":\"a1b1c1.jpeg\",\"pair_word\":{\"word_one\":\"رسمی\",\"word_two\":\"خودمانی\"},\"avg_word_one\":0.8102475032566218,\"avg_word_two\":0.33521493703864524,\"score\":-0.48},{\"image\":\"a1b1c2.jpeg\",\"pair_word\":{\"word_one\":\"زشت\",\"word_two\":\"زیبا\"},\"avg_word_one\":0,\"avg_word_two\":0.8953538862353452,\"score\":0.9},{\"image\":\"a1b1c2.jpeg\",\"pair_word\":{\"word_one\":\"رسمی\",\"word_two\":\"خودمانی\"},\"avg_word_one\":0,\"avg_word_two\":1,\"score\":1}]', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `main`
--
ALTER TABLE `main`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `main`
--
ALTER TABLE `main`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

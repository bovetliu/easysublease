-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 18, 2015 at 01:19 AM
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
-- Table structure for table `detail_tb`
--

CREATE TABLE IF NOT EXISTS `detail_tb` (
  `community` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `memo` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `beds` smallint(5) unsigned DEFAULT NULL,
  `baths` smallint(5) unsigned DEFAULT NULL,
  `addr` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `id` int(10) unsigned NOT NULL,
  `price_t` int(10) unsigned DEFAULT NULL,
  `price_sr` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `source_2` (`source`),
  KEY `community` (`community`),
  KEY `source` (`source`),
  KEY `beds` (`beds`),
  KEY `baths` (`baths`),
  KEY `price_t` (`price_t`),
  KEY `PRICE_SR` (`price_sr`),
  FULLTEXT KEY `memo` (`memo`),
  FULLTEXT KEY `addr` (`addr`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `detail_tb`
--

INSERT INTO `detail_tb` (`community`, `source`, `memo`, `beds`, `baths`, `addr`, `id`, `price_t`, `price_sr`) VALUES
('the ridge', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31651&extra=page%3D1', '寻女室友租the ridge 2B2B 七月底或八月初new lease', 20, 20, '', 3, 234, 567),
('Cripple Creek', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31649&extra=page%3D1', 'Cripple Creek 1b1b 出租 图片,附上屋子的照片来方便广大同学。月租金650美金。有意者请与9794221516联系', 10, 10, '', 4, 234, 567),
('Arbors', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31416&extra=page%3D1', '招女生合租！约7月中旬开始,,大约7月要开始换房子，现寻女生室友 （本人女生），本人有意向租2b2b或别的更多bedrooms户', 20, 20, '', 5, 234, 567),
('Polo Club', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31647&extra=page%3D1', '(已转租) Polo Club 1B1B 4/1-7/31 $485/month,\r\n(已转租)\r\n\r\n因为父母要来，需要稍大一些的居屋，\r\n\r\n转租 Polo Club 1B1B (560 sqft) 4/1-7/31 $485/month \r\n(现在租', 10, 10, '', 6, 234, 567),
('redstone', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31135&extra=page%3D1', '539元/月，带家俱redstone 2B1B,合约到6月底，目前一人入住。大概三月底回国。如果您三月底以前来的话，单身女生可以和我暂时同住。如果同意sublease，目前的床和家俱可以赠予。特别适合三月底来的访问学', 20, 20, '', 7, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31437&extra=page%3D1', '求租卧室一间，7月或8月开始至明年一月,本人TAMU访学，诚求卧室一间，从今年7月或8月开始至明年一月，要求不要吵闹，生活方便，通校车，最好能有独立卫生间，有意者请联', 20, 20, '', 8, 234, 567),
('cedar ridge', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31403&extra=page%3D1', 'cedar ridge 1b1b 转租', 10, 10, '', 9, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31584&extra=page%3D1', '出租主卧一间，250刀，送家具（5月或6月起）', 20, 20, '', 10, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31430&extra=page%3D1', '一楼缺一位女室友，Pre-lease for fall: 3 bedrooms 3 bathroom duplex house f', 30, 30, '2323 Cornell Dr', 11, 234, 567),
('Polo Club', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31643&extra=page%3D1', 'tower park 或者polo club 07/2015整月出租', 20, 20, '', 12, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31504&extra=page%3D1', '一家俩85后PhD求7月底-11月底短租房,我跟爱人俩85后PhD求7月底-11月底（最好是到11月30号）短租房。', 10, 10, '', 13, 234, 567),
('plantation oaks', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31476&extra=page%3D1', '寻找女生室友2015fall一起住plantation oaks 2B/2B ', 20, 20, '', 14, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31639&extra=page%3D1', '2015 fall新生，诚挚求舍友，求合租', 20, 20, '', 15, 234, 567),
('Lexington', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31572&extra=page%3D1', '暑期短期出租Lexington2b2b的一间，$270/月', 20, 20, '', 16, 234, 567),
('Redstone', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31630&extra=page%3D1', 'Redstone 2B/1B 诚招室友 8月入住', 20, 20, '', 17, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31434&extra=page%3D1', '26路校车站点附近好房出租,地址在2306 Autumn Chase Loop.  ', 30, 30, '2306 Autumn Chase Loop', 18, 234, 567),
('cedar ridge', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31636&extra=page%3D1', '。。。8月换房要换CR的妹纸联系我啊。。。', 0, 0, '', 19, 234, 567),
('Gateway ', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31635&extra=page%3D1', 'The Gateway 3b/3b 求一名女生室友', 30, 30, '', 20, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31531&extra=page%3D1', '环境优雅，适合家庭居住或找室友合租 3卧2卫，离校近,3卧房2卫生间，厨房和客厅都很大。洗衣机，烘干机齐全', 30, 20, '105 Winter Park', 21, 234, 567),
('Ion at east end', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31634&extra=page%3D1', '我是UT的访问学生，房子7月31到期，但是本人4月16、17号打算离开回国。所以4月中下旬就可以入住。', 30, 20, '', 22, 234, 567),
('redstone', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31633&extra=page%3D1', '2B1B公寓转租(Redstone)，8月或9月入住', 20, 20, '', 23, 234, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31631&extra=page%3D1', '8月开始诚征室友！2b2b！大家好，我是工程院PhD，男生。计划下学期找一个较新一点的小区居住，最好为中档以上小区。户型为2b2b', 20, 20, '', 24, 234, 567),
('Enclave', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31627&extra=page%3D1', '2B2B 公寓转租 （Enclave Apartment）', 20, 20, '', 25, 234, 567),
('Lexington', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31625&extra=page%3D1', 'lexington 2B2B 寻合租,lexington小区的2b2b，动医访学。由于室友将于7月31日搬走，如有合租意向请小窗与我联系！房子我已经续租到2016年7月31日，房租690刀每月（包水', 20, 20, '', 26, 234, 567),
(' 100 Deacon Dr', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31620&extra=page%3D1', 'Sublease 100 Deacon Dr Apartment 3B/3b其中一间卧室', 30, 30, '', 27, 234, 567),
('Briarwood', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31602&extra=page%3D1', 'Briarwood 2B2B找一女生室友 ', 20, 20, '1201 Harvey Rd', 28, 234, 567),
('willowick', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31599&extra=page%3D1', '找室友合租willowick或其它小区的2b2b, 今年6月/7月开始', 20, 20, '', 29, 234, 567),
('madison Pointe', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31390&extra=page%3D1', '2/1.5房间征女室友（拎包入住，月租300，独立卫生间）', 20, 20, '', 30, 234, 567),
('Lexington', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31586&extra=page%3D1', '转租 Lexington 1B1B 2015年11月-2016年7月31日 ', 10, 10, '', 31, 234, 567),
('Treehouse', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31522&extra=page%3D1', '离学校最近的优质小区Treehouse 2B2B整套公寓转租！4月底5月初入住', 20, 20, '', 32, 234, 567),
('test1', 'test1', 'english character set  and 中文字符测试', 20, 10, 'test1', 46, 880, 440),
('', 'http://www.cssatamu.com/bbs/forum.php?mod=viewthread&tid=31603&extra=page%3D1', '\r\n[size=12.8000001907349px]我來自台灣，女兒在texas a&m consolidated high school 读高中，想找一位女室友合租在balcones.dr 這區的房子，社區網址：http://www.pantheonp', 30, 20, 'balcones dr', 48, 0, 0),
('', 'http://www.cssatamu.com/bbs/forum.php?mod=viewthread&tid=31580&extra=page%3D2', '求整个暑假的短租房', 0, 0, '', 49, 0, 567),
('Fourplex at pine ridge', 'http://www.cssatamu.com/bbs/forum.php?mod=viewthread&tid=31577&extra=page%3D2', '转租 2B/1B apt 房租优惠3月底可入住,代一韩国朋友转租：Fourplex at pine ridge \r\n地址：1537 Pine Ridge Dr College Station TX 77840', 20, 10, '1537 Pine Ridge Dr College Station TX 77840', 50, 750, 375),
('Meridian', 'http://www.cssatamu.com/bbs/forum.php?mod=viewthread&tid=31482&extra=page%3D1', '全town最低 2／1.5 $600整套，单间再商议,小区叫 Meridian， 在heb 的平行左边。 小区在town 上不算高档， 也不怎么出名。但是楼主看中它也不是没有道理。', 20, 15, '', 51, 600, 300),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31659&extra=page%3D1', '寻求7月中旬房源及室友！！！', 20, 20, '', 52, 0, 0),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31601&extra=page%3D1', '更新：寻找一间房，租期8月底到12月底', 0, 0, '', 53, 0, 567),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31656&extra=page%3D1', '寻短租房，1b/1b，或者2b1b，2b1.5b整套6月1日-8月30日', 10, 10, '', 54, 0, 0),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31556&extra=page%3D2', '求短租（4月初）,本人访学，4月初回国。现在房子租期到3月31，现寻4月份的短租房，大概10天左右。有意者麻烦QQ联系：672662861。十分感谢！', 20, 20, '', 55, 500, 250),
('', 'http://cssatamu.com/bbs/forum.php?mod=viewthread&tid=31640', '2015 fall新生，诚挚求舍友，求合租,本人，女，刚刚录取到TAMU，大概八月份到达塔木。如今舍友和房子都没有着落，略焦虑……\r\n特此发帖求助。\r\n本人无不良嗜好，性格开朗，容易相处。诚征合租舍友。希望能和小伙伴们一起愉快地找房子，住在塔木~\r\n本人Q', 20, 20, '', 56, 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

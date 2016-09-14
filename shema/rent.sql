-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 14 Avril 2016 à 11:58
-- Version du serveur :  5.7.11
-- Version de PHP :  5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `rent`
--

-- --------------------------------------------------------

--
-- Structure de la table `divers`
--

CREATE TABLE `divers` (
  `id_divers` int(11) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `libelDivers` text NOT NULL,
  `id_compte` int(11) NOT NULL,
  `datepub` bigint(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `divers`
--

INSERT INTO `divers` (`id_divers`, `photo`, `libelDivers`, `id_compte`, `datepub`) VALUES
(1, 'logoj.jpg', 'A vendre de tout urgence une 4*4 pathfinder imatriculer AN 9006 RB à un prix très bas me contacter au numero 96205549', 6, 1456680848),
(2, '20160225_085711.jpg', 'a vendre un serveur de messagerie  de grande capacité flambeau neuve à un prix intéressant pour infos supplémentaire veillez me contacter au 96205549 ou au 94662237 ', 6, 1456683053),
(3, '20160228_185836.jpg', 'a vendre voiture audi 1.8 en forme à un prix cadeau veillez me contacter au 97899946', 6, 1456683687);

-- --------------------------------------------------------

--
-- Structure de la table `house`
--

CREATE TABLE `house` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `image` text NOT NULL,
  `type_house` varchar(250) NOT NULL,
  `lieu` varchar(25) NOT NULL,
  `description` text NOT NULL,
  `time` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `house`
--

INSERT INTO `house` (`id`, `id_user`, `image`, `type_house`, `lieu`, `description`, `time`) VALUES
(1, 1, 'logojamal.jpg', '1 chambre 1 salont', 'calavie', 'maison à louer 1 Chambres 1 salon carreler avec douche interne, cuisine zone pk10 non loin du carrefour sekandji et situeé à 800m de l\'universiteé north american Houdegbe pk10 Contact: 96205549/97899946.\nPrice:50 000F cfa.', '1448385597'),
(2, 6, 'ali-Bon1.jpg', '3 Chambres 1 salon ', 'akpakpa', 'maison à louer 3 Chambres 1 salon carreler avec douche interne, cuisine zone pk10 non loin du carrefour sekandji et situeé à 800m de l\'universiteé north american Houdegbe pk10 Contact: 96205549/97899946.\nPrice:120 000F cfa.', '1456177893'),
(3, 10, 'joesite.PNG', '1 entrer couché', 'fifadji', 'équiper de douche interne maison bien carreler, eau ,électricité  tout intégré déja', '1456219923'),
(4, 9, 'Desert.jpg', '2 chambre 1 salon', 'avotrou', 'maison bien fait aérée et carreler avec deux douche une cuisine et électricité ,eau tout y est deja', '1456222856'),
(5, 10, 'Hydrangeas.jpg', '1 chambre 1 salon ', 'zogbo', 'situé à 200 m du CEG zogbo  tout juste dans la vont du restaurant max hander il est situé sur le 2 ième etage de la maison carreler en blanc. pour info la maison est très clean', '1456223236'),
(6, 6, 'maxresdefault.jpg', '1 entrer couché', 'akpakpa', 'fxnx b bf bs b sb sb s bs s fb db b  bs b sb sbh nbf  fn n f', '1456602890'),
(7, 6, 'ali-Bongo-2015.jpg', '3chambre 1salon', 'fifadji', 'bongo', '1456602956'),
(8, 6, 'gal4.fw.png', '3chambre 1salon', 'akpakpa', 'jfvgjk', '1456764961'),
(9, 17, 'montre.jpg', 'montre en or', 'pk10', 'montre brillant en or', '1460634257');

-- --------------------------------------------------------

--
-- Structure de la table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `sexe` varchar(1) DEFAULT NULL,
  `pays` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `img_profile` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `login`
--

INSERT INTO `login` (`id`, `nom`, `prenom`, `sexe`, `pays`, `email`, `password`, `img_profile`) VALUES
(1, 'kaffo', 'joezer', 'M', 'programmeur', 'joezerbouraima@yahoo.fr', 'da39a3ee5e6b4b0d3255bfef95601890afd80709', '1440886846950.jpg'),
(2, 'clotoe', 'rodrigue', 'M', 'allo_service', 'clotoeromaric@gmail.com', 'da39a3ee5e6b4b0d3255bfef95601890afd80709', 'gal3.fw.png'),
(3, 'yayi', 'boni', 'M', 'president', 'yayi@benin.bj', 'da39a3ee5e6b4b0d3255bfef95601890afd80709', '1440886846950.jpg'),
(4, 'benin', 'benin', 'M', 'benin', 'benin@ben.com', 'da39a3ee5e6b4b0d3255bfef95601890afd80709', 'prego1.fw.png'),
(5, 'qsqsq', 'ggqgg', 'M', 'program', 'jbouraima@yahoo.fr', '7072ae1002e1e619d9305af2d5ad6800a056af98', 'gal5.fw.png'),
(6, 'bouraima', 'joezer', 'M', 'analyste programmeur', 'rent@benin.com', '511bd3eb8a85954f966f49773dbfef76b833160a', 'ic_profile.png'),
(7, 'mama', 'fawaz', 'M', 'ingenieur de plan', 'fawaz@yahoo.fr', '54f226b9ead2bda5a85ab11698398bb903a565a9', NULL),
(8, 'kaffo', 'jamal dine', 'M', 'etudiant', 'kaffojamaldineishola@yahoo.fr', '75292972bafd648a01dee6fc2fe405f9ca8c9c64', NULL),
(9, 'houton', 'gerard', 'M', 'etudiant', 'gg@.yahoo.fr', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', 'Ali-BONGO.jpg'),
(10, 'topkanou', 'laurice', 'F', 'developpeur web', 'ltopanou@yahoo.fr', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', 'femilog.png'),
(11, 'kaffo', 'robert', 'M', 'Bénin', 'kaffo@gmail.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', ''),
(12, 'babaliroko', 'kafayath', 'F', 'Bénin', 'babaliroko@gmail.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', NULL),
(13, 'bobo', 'shamsi', 'M', 'Bénin', 'shamsi@gmail.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', NULL),
(14, 'pato', 'dani', 'M', 'Bénin', 'patodani@gmail.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', NULL),
(15, 'kaffo', 'roki', 'M', 'Bénin', 'rent@benini.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', NULL),
(16, 'shola', 'soeur', 'F', 'Bénin', 'shola@gmail.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', NULL),
(17, 'kaffo', 'jamal dine', 'M', 'BÃ©nin', 'rent@benin.com', '89e495e7941cf9e40e6980d14a16bf023ccd4c91', 'ic_profile.png');

-- --------------------------------------------------------

--
-- Structure de la table `pays`
--

CREATE TABLE `pays` (
  `id_pays` int(11) NOT NULL,
  `nom_pays` varchar(100) NOT NULL,
  `Drap_pays` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `divers`
--
ALTER TABLE `divers`
  ADD PRIMARY KEY (`id_divers`);

--
-- Index pour la table `house`
--
ALTER TABLE `house`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pays`
--
ALTER TABLE `pays`
  ADD PRIMARY KEY (`id_pays`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `divers`
--
ALTER TABLE `divers`
  MODIFY `id_divers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `house`
--
ALTER TABLE `house`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pour la table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT pour la table `pays`
--
ALTER TABLE `pays`
  MODIFY `id_pays` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

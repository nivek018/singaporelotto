CREATE DATABASE IF NOT EXISTS sg_lotto;
USE sg_lotto;

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('4D', 'Toto', 'Sweep') NOT NULL,
  draw_date DATE NOT NULL,
  draw_number VARCHAR(50) NOT NULL,
  data JSON NOT NULL,
  source ENUM('scrape', 'manual') DEFAULT 'scrape',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_draw (type, draw_number)
);

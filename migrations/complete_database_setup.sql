-- =====================================================
-- SG Lotto Results - Complete Database Setup
-- Matches existing local database schema
-- =====================================================

-- 1. Create results table
CREATE TABLE IF NOT EXISTS results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('4D', 'Toto', 'Sweep') NOT NULL,
    draw_date DATE NOT NULL,
    draw_number VARCHAR(50) NOT NULL,
    data LONGTEXT NOT NULL,
    source ENUM('scrape', 'manual') DEFAULT 'scrape',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_type_draw (type, draw_number)
);

-- 2. Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_type ENUM('4D', 'Toto', 'Sweep') NOT NULL UNIQUE,
    draw_days VARCHAR(255) NOT NULL,
    draw_time VARCHAR(50) NOT NULL,
    description TEXT DEFAULT NULL,
    sales_close_time VARCHAR(50) DEFAULT NULL,
    special_rule VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cascade_draw_time VARCHAR(10) DEFAULT NULL
);

-- 3. Insert default schedules
INSERT INTO schedules (game_type, draw_days, draw_time, cascade_draw_time, special_rule) VALUES
('4D', 'Wednesday, Saturday, Sunday', '6:30 PM SGT', NULL, NULL),
('Toto', 'Monday, Thursday', '6:30 PM SGT', '21:30', NULL),
('Sweep', 'Wednesday', '6:30 PM SGT', NULL, 'first_wednesday_of_month')
ON DUPLICATE KEY UPDATE 
    draw_days = VALUES(draw_days),
    draw_time = VALUES(draw_time),
    cascade_draw_time = VALUES(cascade_draw_time),
    special_rule = VALUES(special_rule);

-- 4. Create TOTO cascade status table
CREATE TABLE IF NOT EXISTS toto_cascade_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    consecutive_no_winner INT DEFAULT 0,
    is_cascade_draw TINYINT(1) DEFAULT 0,
    last_checked_draw_no INT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Insert initial cascade status (starts fresh, only if table is empty)
INSERT INTO toto_cascade_status (consecutive_no_winner, is_cascade_draw) 
SELECT 0, 0
WHERE NOT EXISTS (SELECT 1 FROM toto_cascade_status LIMIT 1);

-- =====================================================
-- Setup complete! After running this:
-- 1. Your scraper should start working
-- 2. Call /api/admin/recalculate-cascade to calculate 
--    cascade status from existing TOTO results
-- =====================================================

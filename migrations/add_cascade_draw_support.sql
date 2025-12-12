-- Migration: Add TOTO Cascade Draw Support
-- Date: 2025-12-10

-- 1. Add cascade_draw_time column to schedules table
ALTER TABLE schedules ADD COLUMN cascade_draw_time VARCHAR(10) DEFAULT NULL;

-- 2. Update TOTO schedule with cascade draw time
UPDATE schedules SET cascade_draw_time = '21:30' WHERE game_type = 'Toto';

-- 3. Create cascade status table
CREATE TABLE toto_cascade_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    consecutive_no_winner INT DEFAULT 0,
    is_cascade_draw BOOLEAN DEFAULT FALSE,
    last_checked_draw_no INT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Insert initial record
INSERT INTO toto_cascade_status (consecutive_no_winner, is_cascade_draw) VALUES (0, FALSE);

-- 5. Create dummy TOTO results for testing cascade logic
-- These simulate 3 consecutive draws with no Group 1 winner to trigger cascade

-- Draw 1: No Group 1 winner (count = 0)
INSERT INTO results (type, draw_date, draw_number, data, source) VALUES 
('Toto', '2025-12-02', 4081, '{"drawNo":4081,"drawDate":"2025-12-02","winning":[1,5,12,23,34,45],"additional":7,"winningShares":[{"group":"Group 1","prizeAmount":5000000,"count":0},{"group":"Group 2","prizeAmount":50000,"count":5},{"group":"Group 3","prizeAmount":1500,"count":100}]}', 'test')
ON DUPLICATE KEY UPDATE data = VALUES(data);

-- Draw 2: No Group 1 winner (count = 0)
INSERT INTO results (type, draw_date, draw_number, data, source) VALUES 
('Toto', '2025-12-05', 4082, '{"drawNo":4082,"drawDate":"2025-12-05","winning":[2,8,15,27,38,49],"additional":11,"winningShares":[{"group":"Group 1","prizeAmount":7000000,"count":0},{"group":"Group 2","prizeAmount":60000,"count":8},{"group":"Group 3","prizeAmount":1800,"count":120}]}', 'test')
ON DUPLICATE KEY UPDATE data = VALUES(data);

-- Draw 3: No Group 1 winner (count = 0) - This triggers cascade for next draw!
INSERT INTO results (type, draw_date, draw_number, data, source) VALUES 
('Toto', '2025-12-09', 4083, '{"drawNo":4083,"drawDate":"2025-12-09","winning":[3,11,19,28,37,48],"additional":22,"winningShares":[{"group":"Group 1","prizeAmount":9500000,"count":0},{"group":"Group 2","prizeAmount":75000,"count":10},{"group":"Group 3","prizeAmount":2000,"count":150}]}', 'test')
ON DUPLICATE KEY UPDATE data = VALUES(data);

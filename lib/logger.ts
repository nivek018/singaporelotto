import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'debug');
const LOG_FILE = path.join(LOG_DIR, 'debug.log');

// Ensure debug directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

export function log(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    try {
        fs.appendFileSync(LOG_FILE, logMessage);
        console.log(logMessage.trim()); // Also log to console
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
}

export function cleanOldLogs(retentionDays: number = 14) {
    try {
        // In this simple implementation, we are appending to a single file.
        // To strictly "remove logs older than 14 days", we'd need to parse the file or rotate files.
        // For simplicity and to prevent bloating, we will check the file creation time or just rotate the file if it gets too big,
        // or implementing a daily log file strategy would be better for "14 days" retention.

        // Let's switch to a daily log file strategy to easily support retention.
        // Actually, the user asked for "debug.log", singular. 
        // Let's just check file stats and if it's too old/large, maybe archive it?
        // User specifically asked: "remove logs older than 14 days". 
        // If it's a single file, we can't easily remove "lines".
        // Let's implement a daily rotation: debug-YYYY-MM-DD.log and debug.log as current?
        // Or just write to debug.log and have a separate cleanup process that maybe truncates it?

        // Let's stick to the user's request "debug.log". 
        // To clean old logs from a single file is expensive (read all, filter, write back).
        // I will implement a check: if file size > 5MB, rename it to debug-timestamp.log and start new.
        // Then delete archived logs older than 14 days.

        const stats = fs.statSync(LOG_FILE);
        const fileSizeInBytes = stats.size;
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        if (fileSizeInBytes > MAX_SIZE) {
            const archiveName = path.join(LOG_DIR, `debug-${Date.now()}.log`);
            fs.renameSync(LOG_FILE, archiveName);
        }

        // Clean up old archives
        const files = fs.readdirSync(LOG_DIR);
        const now = Date.now();
        const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

        files.forEach(file => {
            if (file.startsWith('debug-') && file.endsWith('.log')) {
                const filePath = path.join(LOG_DIR, file);
                const fileStats = fs.statSync(filePath);
                if (now - fileStats.mtimeMs > retentionMs) {
                    fs.unlinkSync(filePath);
                    log(`Deleted old log file: ${file}`, 'INFO');
                }
            }
        });

    } catch (error) {
        // Ignore errors if file doesn't exist etc
    }
}

import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'debug');
const LOG_FILE = path.join(LOG_DIR, 'debug.log');

// Ensure debug directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

export function log(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
    const timestamp = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
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

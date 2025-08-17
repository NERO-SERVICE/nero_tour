// Secure Logging Utility
// Only logs in development mode, silently handles production

class SecureLogger {
    constructor() {
        this.isProduction = window.CONFIG?.IS_PRODUCTION || false;
        this.enabledLevels = this.isProduction ? ['error'] : ['log', 'warn', 'error', 'info', 'debug'];
    }

    log(...args) {
        if (!this.isProduction && this.enabledLevels.includes('log')) {
            console.log(...args);
        }
    }

    warn(...args) {
        if (!this.isProduction && this.enabledLevels.includes('warn')) {
            console.warn(...args);
        }
    }

    error(...args) {
        if (this.enabledLevels.includes('error')) {
            // Only log errors in production for critical issues
            console.error(...args);
        }
    }

    info(...args) {
        if (!this.isProduction && this.enabledLevels.includes('info')) {
            console.info(...args);
        }
    }

    debug(...args) {
        if (!this.isProduction && this.enabledLevels.includes('debug')) {
            console.debug(...args);
        }
    }

    // Security-focused methods
    logSanitized(message, data = {}) {
        if (this.isProduction) return;
        
        // Remove sensitive data
        const sanitizedData = this.sanitizeData(data);
        console.log(message, sanitizedData);
    }

    sanitizeData(data) {
        if (typeof data !== 'object' || data === null) return data;
        
        const sensitiveKeys = ['apiKey', 'password', 'token', 'secret', 'key'];
        const sanitized = { ...data };
        
        for (const key in sanitized) {
            if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                sanitized[key] = '[REDACTED]';
            }
        }
        
        return sanitized;
    }
}

// Global logger instance
window.secureLogger = new SecureLogger();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureLogger;
}
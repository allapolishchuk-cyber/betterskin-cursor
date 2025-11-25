/**
 * Error Handler Module
 * Provides user-friendly error messages and error handling utilities
 */

/**
 * Shows a user-friendly error message
 * @param {string} message - Error message to display
 * @param {string} type - Type of error (error, warning, info)
 */
export function showError(message, type = 'error') {
    const messageEl = document.createElement('div');
    const colors = {
        error: { bg: '#ef4444', text: 'white' },
        warning: { bg: '#f59e0b', text: 'white' },
        info: { bg: 'var(--accent)', text: 'white' }
    };
    const color = colors[type] || colors.error;
    
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: ${color.text};
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
    `;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    setTimeout(() => messageEl.remove(), 5000);
}

/**
 * Shows a success message
 * @param {string} message - Success message to display
 */
export function showSuccess(message) {
    showError(message, 'info');
}

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
export function safeJsonParse(jsonString, defaultValue = null) {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        showError('Failed to load data. Using default values.', 'warning');
        return defaultValue;
    }
}

/**
 * Handles async errors and shows user-friendly messages
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export function handleError(error, context = 'operation') {
    let message = 'An unexpected error occurred.';
    
    if (error.message) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
            message = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
            message = 'Permission denied. Please refresh the page and try again.';
        } else {
            message = `Error: ${error.message}`;
        }
    }
    
    showError(`${context}: ${message}`, 'error');
}


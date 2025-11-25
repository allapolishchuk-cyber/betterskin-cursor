/**
 * Utility Functions
 */

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitizes a string for use as an ID
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeId(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Safely sets innerHTML with sanitization
 * @param {HTMLElement} element - Element to set content for
 * @param {string} content - Content to set (will be escaped)
 */
export function safeSetInnerHTML(element, content) {
    if (!element) return;
    element.textContent = content;
}

/**
 * Safely sets innerHTML for trusted content (use with caution)
 * @param {HTMLElement} element - Element to set content for
 * @param {string} html - HTML content to set
 */
export function setInnerHTML(element, html) {
    if (!element) return;
    element.innerHTML = html;
}

/**
 * Gets or creates a user ID
 * @returns {string} User ID
 */
export function getUserId() {
    let userId = localStorage.getItem('betterskin-user-id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('betterskin-user-id', userId);
    }
    return userId;
}


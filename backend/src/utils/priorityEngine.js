/**
 * Analyzes grievance text and assigns a priority level dynamically.
 * High/Critical: Keywords indicating safety hazards or immediate community impact.
 * Medium: Default if no keywords are matched for most issues.
 * Low: General inquiries or known non-urgent issues.
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @returns {string} Priority string ('Critical', 'High', 'Medium', 'Low')
 */
export const calculatePriority = (title, description, category) => {
    const combinedText = `${title} ${description}`.toLowerCase();

    const criticalKeywords = ['fire', 'flood', 'accident', 'explosion', 'collapsed', 'electrocution', 'outbreak'];
    const highKeywords = ['no water', 'power cut', 'contaminated', 'blocked', 'leak', 'broken pipe'];
    const lowKeywords = ['inquiry', 'suggestion', 'request', 'status', 'feedback'];

    // Check critical first
    if (criticalKeywords.some(kw => combinedText.includes(kw))) {
        return 'Critical';
    }

    // Check high
    if (highKeywords.some(kw => combinedText.includes(kw))) {
        return 'High';
    }

    // Check low
    if (lowKeywords.some(kw => combinedText.includes(kw))) {
        return 'Low';
    }

    // Fallbacks by category
    if (category === 'health' || category === 'electricity') return 'High';

    return 'Medium'; // Default
};

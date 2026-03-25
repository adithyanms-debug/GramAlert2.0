/**
 * Determines the severity of a grievance based on keywords in title, description, and category.
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @returns {string} Severity string ('Critical', 'Medium', 'Low')
 */
export const determineSeverity = (title, description, category) => {
    const combinedText = `${title} ${description} ${category}`.toLowerCase();

    const criticalKeywords = [
        'water outage', 'pipe burst', 'electric', 'fire', 
        'hospital', 'emergency', 'flood'
    ];
    
    const mediumKeywords = [
        'garbage', 'drain', 'road', 'pothole', 
        'streetlight', 'sanitation'
    ];

    if (criticalKeywords.some(kw => combinedText.includes(kw))) {
        return 'Critical';
    }

    if (mediumKeywords.some(kw => combinedText.includes(kw))) {
        return 'Medium';
    }

    return 'Low';
};

/**
 * Calculates the priority score based on severity and upvote count.
 * 
 * @param {string} severity 
 * @param {number} upvoteCount 
 * @returns {number} Priority score
 */
export const calculatePriority = (severity, upvoteCount) => {
    const weights = {
        'Critical': 20,
        'Medium': 5,
        'Low': 1
    };

    const weight = weights[severity] || 1;
    return weight * (parseInt(upvoteCount, 10) + 1);
};

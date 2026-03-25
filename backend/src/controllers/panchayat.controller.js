import { query } from '../config/db.js';

export const getPanchayats = async (req, res) => {
    try {
        const result = await query(
            "SELECT id, name, district FROM panchayats ORDER BY name"
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch panchayats' });
    }
};

export const getPanchayatRankings = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                p.id, 
                p.name, 
                p.district,
                COUNT(g.id) as total_grievances,
                COUNT(CASE WHEN g.status = 'Resolved' THEN 1 END) as resolved_grievances,
                AVG(COALESCE(g.sentiment_score, 0)) as avg_sentiment
            FROM panchayats p
            LEFT JOIN grievances g ON p.id = g.panchayat_id
            GROUP BY p.id, p.name, p.district
        `);

        const rankings = result.rows.map(p => {
            const total = parseInt(p.total_grievances);
            const resolved = parseInt(p.resolved_grievances);
            const avgSentiment = parseFloat(p.avg_sentiment) || 0;

            // Algorithm: 
            // 1. Sentiment Score (0 to 50): Maps -1..1 to 0..50
            const sentimentScore = ((avgSentiment + 1) / 2) * 50;

            // 2. Efficiency Score (0 to 50): Resolved/Total * 50
            const efficiencyScore = total > 0 ? (resolved / total) * 50 : 25; // Default 25 if no grievances

            const wellBeingScore = Math.round(sentimentScore + efficiencyScore);

            return {
                ...p,
                total_grievances: total,
                resolved_grievances: resolved,
                avg_sentiment: avgSentiment,
                well_being_score: wellBeingScore
            };
        }).sort((a, b) => b.well_being_score - a.well_being_score);

        res.json(rankings);
    } catch (error) {
        console.error("Failed to fetch rankings:", error);
        res.status(500).json({ message: 'Failed to fetch panchayat rankings' });
    }
};


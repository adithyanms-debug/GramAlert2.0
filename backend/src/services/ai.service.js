import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here'
    ? new GoogleGenerativeAI(GEMINI_API_KEY)
    : null;

/**
 * Analyzes the sentiment of a given text.
 * Returns a score between -1 (negative) and 1 (positive).
 */
export const analyzeSentiment = async (text) => {
    if (!genAI) {
        console.log("AI Service: Using mock sentiment analysis (No API Key)");
        // Basic mock: check for negative words
        const lowerText = text.toLowerCase();
        const negWords = ['broken', 'fail', 'bad', 'worst', 'angry', 'problem', 'stink', 'danger', 'help'];
        const posWords = ['good', 'happy', 'resolved', 'thanks', 'great', 'excellent'];

        let score = 0;
        negWords.forEach(w => { if (lowerText.includes(w)) score -= 0.2; });
        posWords.forEach(w => { if (lowerText.includes(w)) score += 0.2; });

        return Math.max(-1, Math.min(1, score));
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze the sentiment of the following community grievance text. 
        Return ONLY a single number between -1.0 (very frustrated/negative) and 1.0 (very satisfied/positive). 
        Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const score = parseFloat(response.text().trim());

        return isNaN(score) ? 0 : score;
    } catch (error) {
        console.error("AI Service Error (Sentiment):", error);
        return 0;
    }
};

/**
 * Generates an embedding (vector) for the given text.
 */
export const generateEmbedding = async (text) => {
    if (!genAI) {
        // Mock embedding: just a simple character frequency or hash (not real embedding)
        return null;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("AI Service Error (Embedding):", error);
        return null;
    }
};

/**
 * Calculates cosine similarity between two vectors.
 */
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return isNaN(similarity) ? 0 : similarity;
}

/**
 * Checks for potential duplicates based on text similarity.
 * Compares the new embedding against existing grievances' embeddings.
 */
export const findPotentialDuplicates = async (newEmbedding, existingGrievances) => {
    if (!newEmbedding || !existingGrievances || existingGrievances.length === 0) {
        return null;
    }

    const SIMILARITY_THRESHOLD = 0.85; // 85% similarity is considered a potential duplicate

    for (const g of existingGrievances) {
        if (!g.embedding) continue;

        try {
            const existingEmbedding = typeof g.embedding === 'string'
                ? JSON.parse(g.embedding)
                : g.embedding;

            const similarity = cosineSimilarity(newEmbedding, existingEmbedding);

            if (similarity > SIMILARITY_THRESHOLD) {
                return {
                    duplicate_of_id: g.id,
                    similarity: (similarity * 100).toFixed(1) + '%'
                };
            }
        } catch (e) {
            console.error("Error parsing embedding for duplicate check:", e);
        }
    }

    return null;
};


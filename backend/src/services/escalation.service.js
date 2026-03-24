import cron from 'node-cron';
import { query } from '../config/db.js';
import { sendNotification } from './notification.service.js';

/**
 * Runs the stored procedure to escalate overdue grievances (multi-level)
 */
export const runEscalation = async () => {
    try {
        console.log(`[Escalation Service] Running multi-level escalation check at ${new Date().toISOString()}`);
        await query('CALL escalate_overdue_grievances()');
        console.log('[Escalation Service] Escalation check completed successfully.');

        // Query recently created escalations and send notifications
        const { rows: recentEscalations } = await query(`
            SELECT e.id, e.grievance_id, e.escalated_to, e.escalation_level, e.reason, g.title 
            FROM escalations e
            JOIN grievances g ON e.grievance_id = g.id
            WHERE e.escalated_at >= NOW() - INTERVAL '5 minutes'
            ORDER BY e.escalation_level ASC
        `);

        const levelLabels = {
            1: '⚠️ Level 1 - Panchayat',
            2: '🔶 Level 2 - Block',
            3: '🔴 Level 3 - District (URGENT)',
        };

        for (const esc of recentEscalations) {
            const levelLabel = levelLabels[esc.escalation_level] || `Level ${esc.escalation_level}`;
            await sendNotification({
                to: esc.escalated_to,
                subject: `[${levelLabel}] Grievance Escalation: ${esc.title}`,
                text: `${esc.reason}\n\nGrievance #${esc.grievance_id} has been escalated to: ${esc.escalated_to}.`
            });
        }

        if (recentEscalations.length > 0) {
            console.log(`[Escalation Service] Sent ${recentEscalations.length} escalation notification(s).`);
        }

    } catch (error) {
        console.error('[Escalation Service] Error running escalation:', error);
    }
};

// Schedule it to run every midnight
export const initEscalationCron = () => {
    cron.schedule('0 0 * * *', () => {
        runEscalation();
    });
    console.log('[Escalation Service] Cron job initialized (runs daily at midnight).');
};

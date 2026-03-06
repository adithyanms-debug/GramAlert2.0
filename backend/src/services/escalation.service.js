import cron from 'node-cron';
import { query } from '../config/db.js';
import { sendNotification } from './notification.service.js';

/**
 * Runs the stored procedure to escalate overdue grievances
 */
export const runEscalation = async () => {
    try {
        console.log(`[Escalation Service] Running escalation check at ${new Date().toISOString()}`);
        await query('CALL escalate_overdue_grievances()');
        console.log('[Escalation Service] Escalation check completed successfully.');

        // In a real scenario, you might also query the newly inserted escalations
        // from the `escalations` table and send an email via notification.service
        const { rows: recentEscalations } = await query(`
      SELECT e.id, e.grievance_id, e.escalated_to, g.title 
      FROM escalations e
      JOIN grievances g ON e.grievance_id = g.id
      WHERE e.escalated_at >= NOW() - INTERVAL '5 minutes'
    `);

        for (const esc of recentEscalations) {
            await sendNotification({
                to: esc.escalated_to,
                subject: `Grievance Escalation: ${esc.title}`,
                text: `Grievance #${esc.grievance_id} has exceeded its resolution deadline and has been escalated to you.`
            });
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

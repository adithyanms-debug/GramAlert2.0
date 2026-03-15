import axios from 'axios';

async function testStatusUpdate() {
    try {
        console.log('--- Status Update Verification Started ---');
        
        // 1. Login as Admin
        console.log('Logging in as admin...');
        const login = await axios.post('http://localhost:8080/api/auth/login', {
            username: 'admin',
            password: 'password',
            type: 'admin'
        });
        const token = login.data.token;
        console.log('Login successful.');

        // 2. Fetch recent grievances to get an ID
        console.log('Fetching grievances...');
        const listRes = await axios.get('http://localhost:8080/api/grievances', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (listRes.data.length === 0) {
            console.log('No grievances found to update.');
            return;
        }

        const grievanceId = listRes.data[0].id;
        const oldStatus = listRes.data[0].status;
        const newStatus = oldStatus === 'Resolved' ? 'In Progress' : 'Resolved';

        console.log(`Updating grievance ${grievanceId} from "${oldStatus}" to "${newStatus}"...`);

        // 3. Update Status
        const updateRes = await axios.patch(`http://localhost:8080/api/grievances/${grievanceId}/status`, 
            { status: newStatus },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log('Update Result:', updateRes.data.message);

        // 4. Verify in DB
        const verifyRes = await axios.get(`http://localhost:8080/api/grievances/${grievanceId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (verifyRes.data.status === newStatus) {
            console.log('SUCCESS: Status verified in DB.');
        } else {
            console.error(`FAILURE: Status in DB is "${verifyRes.data.status}", expected "${newStatus}".`);
        }

        console.log('--- Status Update Verification Finished ---');

    } catch (error) {
        console.error('Verification Error:', error.response ? error.response.data : error.message);
    }
}

testStatusUpdate();

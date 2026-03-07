export const MOCK_USER = {
    id: 0,
    username: "Demo Villager",
    role: "VILLAGER",
    email: "demo@gramalert.gov",
    phone: "1234567890",
    joinedDate: new Date().toISOString()
};

export const MOCK_GRIEVANCES = [
    {
        id: 101,
        title: "Street light not working in Lane 4",
        description: "The street light has been flickering and finally stopped working last night. It's very dark and unsafe for children.",
        category: "Street Lights",
        status: "Received",
        priority: "Medium",
        created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 102,
        title: "Blocked drainage near community center",
        description: "Heavy rains have caused the drain to overflow with plastic waste. Needs immediate cleaning.",
        category: "Drainage",
        status: "In Progress",
        priority: "High",
        created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 103,
        title: "Frequent power cuts in Ward 2",
        description: "We are facing power cuts every evening for 2-3 hours. Please check the transformer status.",
        category: "Electricity",
        status: "Resolved",
        priority: "Low",
        created_at: new Date(Date.now() - 259200000).toISOString(),
    }
];

export const MOCK_ALERTS = [
    {
        id: 1,
        title: "Vaccination Drive Tomorrow",
        description: "Polio drops for children under 5 will be administered at the Primary Health Center from 9 AM to 3 PM.",
        category: "health",
        severity: "info",
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        title: "Water Supply Interruption",
        description: "Repair work on the main pipeline. Water supply will be unavailable from 2 PM to 6 PM today.",
        category: "water",
        severity: "warning",
        created_at: new Date().toISOString()
    }
];

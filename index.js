const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Replace 'YOUR_PRIVATE_APP_ACCESS_TOKEN' with your actual private app access token.
const PRIVATE_APP_ACCESS = 'pat-na1-08fcfe01-5810-4de5-a867-0fc1fac8e803';

// Function to fetch custom object data
async function fetchCustomObjectData() {
    const customObjectEndpoint = 'https://api.hubspot.com/crm/v3/objects/p_pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const propertiesToFetch = 'all'; // Fetch all properties

    let allProperties = [];

    let hasMore = true;
    let offset = 0;
    const limit = 100; // Adjust the limit as needed

    while (hasMore) {
        const params = {
            properties: propertiesToFetch,
            limit,
            offset,
        };

        try {
            const resp = await axios.get(customObjectEndpoint, { headers, params });
            const data = resp.data.results;
            allProperties = allProperties.concat(data);

            if (data.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return allProperties;
}



// Route for the homepage
app.get('/', async (req, res) => {
    try {
        // Fetch custom object data
        const customObjectData = await fetchCustomObjectData();
        console.log(customObjectData)
        
        // Render the homepage Pug template
        res.render('homepage', { title: 'Custom Object Data', customObjectData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for the form to create or update custom object data
app.get('/update-cobj', (req, res) => {
    // Render the form Pug template
    res.render('updates', { title: 'Update Custom Object Form' });
});

// Route to handle form submission and create/update custom object data
app.post('/update-cobj', async (req, res) => {
    try {
        // Extract data from the form submission (req.body).
        const formData = req.body;
        
        // Add code here to create or update custom object records in HubSpot using formData.
        // You should make an API request to create or update records.
        
        // After creating or updating, redirect back to the homepage.
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

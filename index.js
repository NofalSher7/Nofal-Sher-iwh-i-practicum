// const dotenv = require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'pug');

// Set the view engine if you plan to use it for rendering views with Pug
app.set('view engine', 'pug');

// Please include the private app access token in your  repo BUT only an access token built in a TEST ACCOUNT.
// Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-08fcfe01-5810-4de5-a867-0fc1fac8e803';

// Route 1 - Create a new app.get route for the homepage to call your custom object data.
app.get('/', async (req, res) => {
  const objectsUrl = 'https://api.hubspot.com/crm/v3/objects/p_Pets?properties=email,name,species,gender,favorite_food'

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(objectsUrl, { headers });
    const data = response.data.results;
    res.render('homepage', { title: 'Pets | HubSpot APIs', data });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
  //render form from pug template
  res.render('updates', {title: 'Create a New Pet'})
})
  // TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here


// Assuming PRIVATE_APP_ACCESS is defined and contains a valid HubSpot API key
app.post('/update-cobj', async (req, res) => {
  try{
    const petData = {
      properties: {
        email: req.body.email,
        name: req.body.name,
        species: req.body.species,
        gender: req.body.gender,
        favorite_food: req.body.favorite_food
      }
    };
    const createPetUrl = 'https://api.hubspot.com/crm/v3/objects/2-18899024'
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    }
    await axios.post(createPetUrl, petData, {headers})
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'Error Occured While Create Pet'})
  }
})
// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
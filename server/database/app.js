const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync('dealerships.json', 'utf8'));

mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

app.post('/init', async (req, res) => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);

    res.status(200).json({ message: 'Initialization complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Initialization failed' });
  }
});

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers by state' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id, 10);
    const document = await Dealerships.findOne({ id: dealerId });
    if (!document) {
      return res.status(404).json({ error: 'Dealer not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Error in /fetchDealer/:id', error);
    res.status(500).json({ error: 'Error fetching dealer by ID' });
  }
});

app.get('/debug/dealers', async (req, res) => {
  try {
    const all = await Dealerships.find();
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealers' });
  }
});

app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const documents = await Reviews.find().sort({ id: -1 });
    const new_id = documents.length > 0 ? documents[0].id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express from 'express';
import path from 'path';
import serverConfig from './server-config';
import db from './db/db';
import passport from 'passport';
import {facebookAuthConfig} from './auth';

const app = express();
const port = process.env.PORT || 8000;

serverConfig(app, express, passportJwtConfig);
facebookAuthConfig(db.findUser, db.createUser);
// Render the main splash page upon arrival
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/splash.html'));
});

// Route to signup page
app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, './views/signup.html'));
});

// create new users


// Navigate to login
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, './views/login.html'));
});

app.post('/login', (req, res) => {
  res.redirect('/spots');
});

// route for facebook authentication and login
// different scopes while logging in
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: 'email' }
));

// handle the callback after facebook has authenticated the user
app.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/spots',
    failureRedirect: '/login'
  })
);

// Get all of a user's spots.
app.get('/spots', function(req, res) {
  res.render('spots');
});

// RESTFUl API for retrieving spots from the db
app.get('/api/spots', db.getAllSpots);
app.get('/api/spots/:id', db.getSingleSpot);
app.post('/api/spots', db.createSpot);
app.put('/api/spots/:id', db.updateSpot);
app.delete('/api/spots/:id', db.removeSpot);


app.listen(port, () => {
  console.log('server started on port');
});

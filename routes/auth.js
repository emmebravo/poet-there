const express = require('express');
const passport = require('passport');
const router = express.Router();

//@desc auth with Google
//route: GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//@desc Google auth callback
//route GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (request, response) => {
    response.redirect('/dashboard');
  }
);

//@desc logout user
// route GET /auth/logout
router.get('/logout', (request, response) => {
  //passport has a logout method on the request object
  request.logout(), response.redirect('/');
});

module.exports = router;

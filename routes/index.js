const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');

// login/landing page
//route: GET request /
//when you wanna use middleware within a row, add as second element
router.get('/', ensureGuest, (request, response) => {
  response.render('login', {
    layout: 'login',
  });
});

//dashboard
//route GET/dashboard
router.get('/dashboard', ensureAuth, async (request, response) => {
  try {
    const stories = await Story.find({ user: request.user.id }).lean();

    response.render('dashboard', {
      name: request.user.firstName,
      stories,
    });
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

module.exports = router;

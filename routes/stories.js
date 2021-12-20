const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc show add page
//@route GET /stories/add
router.get('/add', ensureAuth, (request, response) => {
  response.render('stories/add');
});

// @desc process add form
//@route POST /stories
router.post('/', ensureAuth, async (request, response) => {
  try {
    request.body.user = request.user.id;
    await Story.create(request.body);
    response.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

// @desc show all public stories
//@route GET /stories/add
router.get('/', ensureAuth, async (request, response) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user') //populate with user model
      .sort({ createdAt: 'desc' })
      .lean();

    response.render('stories/index', {
      stories,
    });
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

// @desc show single story
//@route GET /stories/:id
router.get('/:id', ensureAuth, async (request, response) => {
  try {
    let story = await Story.findById(request.params.id).populate('user').lean();

    if (!story) {
      return response.render('error/404');
    }

    response.render('stories/show', {
      story,
    });
  } catch (error) {
    console.error(error);
    response.render('error/404');
  }
});

// @desc show edit page
//@route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (request, response) => {
  try {
    const story = await Story.findOne({
      _id: request.params.id,
    }).lean();

    if (!story) {
      return response.render('error/404');
    }

    if (story.user != request.user.id) {
      response.redirect('/stories');
    } else {
      response.render('stories/edit', {
        story,
      });
    }
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

// @desc update story
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (request, response) => {
  try {
    let story = await Story.findById(request.params.id).lean();

    if (!story) {
      return response.render('error/404');
    }

    if (story.user != request.user.id) {
      response.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate(
        { _id: request.params.id },
        request.body,
        {
          new: true,
          runValidators: true,
        }
      );
      response.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

// @desc delete story
//@route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (request, response) => {
  try {
    await Story.remove({ _id: request.params.id });
    response.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

// @desc show add page
//@route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (request, response) => {
  try {
    const stories = await Story.find({
      user: request.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    response.render('stories/index', {
      stories,
    });
  } catch (error) {
    console.error(error);
    response.render('error/500');
  }
});

module.exports = router;

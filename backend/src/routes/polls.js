const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Poll = require('../models/Poll');
const User = require('../models/User');
const { protect } = require('../middleware/auth');


router.get('/', protect, async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching polls', error: error.message });
  }
});


router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    console.error('Error in GET /polls/:id:', error);
    res.status(500).json({ message: 'Error fetching poll', error: error.message });
  }
});


router.post('/', [
  protect,
  [
    check('question', 'Question is required').not().isEmpty(),
    check('question', 'Question must be at least 5 characters').isLength({ min: 5 }),
    check('option1', 'Option 1 is required').not().isEmpty(),
    check('option2', 'Option 2 is required').not().isEmpty(),
    check('option1').custom((value, { req }) => {
      if (value.trim() === req.body.option2.trim()) {
        throw new Error('Options must be different');
      }
      return true;
    })
  ]
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { question, option1, option2 } = req.body;

  try {
    const poll = new Poll({
      question,
      option1,
      option2,
      author: req.user.id
    });
    
    const savedPoll = await poll.save();
    res.status(201).json(savedPoll);
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll', error: error.message });
  }
});


router.post('/:id/vote', protect, async (req, res) => {
  const { option } = req.body;
  const userId = req.user.id;
  const pollId = req.params.id;


  if (option !== 1 && option !== 2) {
    return res.status(400).json({ message: 'Invalid option' });
  }

  try {

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }


    const alreadyVoted = poll.voters.some(voter => voter.userId.toString() === userId);
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }


    const field = option === 1 ? 'votes1' : 'votes2';
    const updatedPoll = await Poll.findByIdAndUpdate(
      pollId,
      { 
        $inc: { [field]: 1 },
        $push: { voters: { userId, option, votedAt: new Date() } }
      },
      { new: true }
    );
    

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { votes: pollId } }
    );
    
    res.json(updatedPoll);
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ message: 'Error submitting vote', error: error.message });
  }
});


router.get('/:id/vote', protect, async (req, res) => {
  try {
    const pollId = req.params.id;
    const userId = req.user.id;


    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ message: 'Invalid poll ID format' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }


    const vote = poll.voters.find(voter => voter.userId.toString() === userId);
    
    if (!vote) {
      return res.json({ hasVoted: false });
    }

    res.json({
      hasVoted: true,
      option: vote.option,
      votedAt: vote.votedAt
    });
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({ message: 'Error checking vote status', error: error.message });
  }
});

module.exports = router;

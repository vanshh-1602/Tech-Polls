const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// Get comments for a poll - protected route requiring authentication
router.get('/:pollId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ poll: req.params.pollId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Add a comment - protected route requiring authentication
router.post('/', [
  protect,
  [
    check('pollId', 'Poll ID is required').not().isEmpty(),
    check('content', 'Comment content is required').not().isEmpty().trim()
  ]
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { pollId, content, username } = req.body;

  try {
    const comment = new Comment({
      poll: pollId,
      content,
      author: req.user.id,
      username: username || req.user.username
    });
    
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

module.exports = router;

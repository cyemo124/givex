const User = require('../models/user')
const Request = require('../models/request')
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware');

router.get('/admin/dashboard', isAdmin, async (req, res) => {
  const users = await User.find({});
  const requests = await Request.find({});    
  res.render('admin/dashboard', { users, requests  });
});

// DELETE request
router.post('/admin/requests/:id/delete', isAdmin, async (req, res) => {
  const { id } = req.params;
  await Request.findByIdAndDelete(id);
  req.flash('success', 'Request deleted successfully.');
  res.redirect('/admin/dashboard');
});

module.exports = router;

const express = require('express');
const Lead = require('../models/Lead');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const VALID_BUDGETS = ['under-1k', '1k-5k', '5k-15k', '15k-50k', '50k-plus'];
const VALID_STATUSES = ['New', 'Contacted', 'Closed'];

// Basic server-side validation - this is the real gatekeeper. Client-side
// validation (in the React form) only exists to give the visitor fast
// feedback; it can always be bypassed, so nothing here trusts it.
function validateLeadInput(body) {
  const errors = [];
  const { name, email, budgetRange, message } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }
  if (!budgetRange || !VALID_BUDGETS.includes(budgetRange)) {
    errors.push('Please select a valid budget range.');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  }
  return errors;
}

// POST /api/leads - PUBLIC. Anyone visiting the landing page can submit.
router.post('/', async (req, res) => {
  try {
    const errors = validateLeadInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }

    const lead = await Lead.create({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      budgetRange: req.body.budgetRange,
      message: req.body.message.trim(),
    });

    res.status(201).json({ id: lead._id, message: 'Thanks! We received your message.' });
  } catch (err) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: 'Could not save your submission. Please try again.' });
  }
});

// GET /api/leads - PROTECTED (admin only). Supports ?search= and ?status=
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      const re = new RegExp(search.trim(), 'i');
      query.$or = [{ name: re }, { email: re }, { message: re }];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error('Fetch leads error:', err);
    res.status(500).json({ error: 'Could not load leads.' });
  }
});

// PATCH /api/leads/:id/status - PROTECTED (admin only). Status toggle.
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status must be New, Contacted, or Closed.' });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found.' });
    }

    res.json(lead);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Could not update status.' });
  }
});

module.exports = router;

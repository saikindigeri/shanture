const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start and end dates are required' });
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  if (start > end) {
    return res.status(400).json({ error: 'Start date must be before end date' });
  }
  next();
};

module.exports = { validateDateRange };
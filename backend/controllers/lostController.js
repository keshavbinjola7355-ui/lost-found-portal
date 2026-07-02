import LostReport from '../models/LostReport.js';

/**
 * @route   GET /api/lost
 * @access  Public
 * @desc    Fetch all lost reports, newest first.
 *
 * Supports optional query string filters:
 *  - category : filter by category slug (e.g. "electronics")
 *  - status   : filter by status (e.g. "searching", "resolved")
 *  - q        : full-text keyword search on itemName, location, description
 */
export const getLostReports = async (req, res, next) => {
  try {
    const { category, status, q } = req.query;

    // Build a MongoDB filter object dynamically
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (q) {
      // Case-insensitive regex search across three text fields
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { itemName: regex },
        { location: regex },
        { description: regex },
      ];
    }

    // Populate userId to return the reporter's name alongside each report
    const reports = await LostReport.find(filter)
      .populate('userId', 'name rollNo')   // Only include name and rollNo
      .sort({ createdAt: -1 });             // Newest first

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/lost/:id
 * @access  Public
 * @desc    Fetch a single lost report by its MongoDB _id
 */
export const getLostReportById = async (req, res, next) => {
  try {
    const report = await LostReport.findById(req.params.id).populate(
      'userId',
      'name rollNo email'
    );

    if (!report) {
      res.status(404);
      throw new Error('Lost report not found');
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/lost
 * @access  Private (JWT required)
 * @desc    Create a new lost item report
 *
 * Reads all form fields from req.body.
 * Attaches req.user._id as the userId (set by protect middleware).
 */
export const createLostReport = async (req, res, next) => {
  try {
    const {
      itemName,
      category,
      location,
      date,
      description,
      hasReward,
      rewardAmount,
      contactPhone,
    } = req.body;

    // Basic field validation
    if (!itemName || !category || !location || !date || !description || !contactPhone) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const report = await LostReport.create({
      itemName,
      category,
      location,
      date: new Date(date),  // Convert ISO string from frontend to Date object
      description,
      hasReward: hasReward || false,
      rewardAmount: hasReward ? rewardAmount : '',
      contactPhone,
      userId: req.user._id,  // Injected by protect middleware
      status: 'searching',   // Always starts as searching
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/lost/:id
 * @access  Private (JWT required + must be the owner)
 * @desc    Update an existing lost report
 *
 * Ownership check: only the user who created the report can update it.
 * Allowed fields: itemName, category, location, date, description,
 *                 hasReward, rewardAmount, contactPhone, status
 */
export const updateLostReport = async (req, res, next) => {
  try {
    const report = await LostReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Lost report not found');
    }

    // Authorization: compare userId on report to the logged-in user's _id
    if (report.userId.toString() !== req.user._id.toString()) {
      res.status(403); // 403 = Forbidden
      throw new Error('You are not authorized to update this report');
    }

    // Apply only the fields that were sent in the request body
    const allowedFields = [
      'itemName', 'category', 'location', 'date', 'description',
      'hasReward', 'rewardAmount', 'contactPhone', 'status',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        report[field] = req.body[field];
      }
    });

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/lost/:id
 * @access  Private (JWT required + must be the owner)
 * @desc    Delete a lost report permanently
 */
export const deleteLostReport = async (req, res, next) => {
  try {
    const report = await LostReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Lost report not found');
    }

    // Ownership check
    if (report.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to delete this report');
    }

    await report.deleteOne();
    res.json({ message: 'Lost report deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

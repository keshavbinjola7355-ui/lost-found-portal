import FoundReport from '../models/FoundReport.js';

/**
 * @route   GET /api/found
 * @access  Public
 * @desc    Fetch all found reports, newest first.
 *
 * Supports optional query string filters:
 *  - category : filter by category slug
 *  - status   : filter by status
 *  - q        : keyword search on itemName, location, description
 */
export const getFoundReports = async (req, res, next) => {
  try {
    const { category, status, q } = req.query;

    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { itemName: regex },
        { location: regex },
        { description: regex },
      ];
    }

    const reports = await FoundReport.find(filter)
      .populate('userId', 'name rollNo')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/found/:id
 * @access  Public
 * @desc    Fetch a single found report by its MongoDB _id
 */
export const getFoundReportById = async (req, res, next) => {
  try {
    const report = await FoundReport.findById(req.params.id).populate(
      'userId',
      'name rollNo email'
    );

    if (!report) {
      res.status(404);
      throw new Error('Found report not found');
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/found
 * @access  Private (JWT required)
 * @desc    Create a new found item report
 *
 * Reads all form fields from req.body.
 * Attaches req.user._id as the userId (set by protect middleware).
 */
export const createFoundReport = async (req, res, next) => {
  try {
    const {
      itemName,
      category,
      location,
      date,
      description,
      collectedLocation,
      contactPhone,
    } = req.body;

    if (!itemName || !category || !location || !date || !description || !contactPhone) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const report = await FoundReport.create({
      itemName,
      category,
      location,
      date: new Date(date),
      description,
      collectedLocation: collectedLocation || 'with-finder',
      contactPhone,
      userId: req.user._id,
      status: 'matched', // Found items start as "matched" (visible to searchers)
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/found/:id
 * @access  Private (JWT required + must be the owner)
 * @desc    Update an existing found report
 */
export const updateFoundReport = async (req, res, next) => {
  try {
    const report = await FoundReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Found report not found');
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to update this report');
    }

    const allowedFields = [
      'itemName', 'category', 'location', 'date', 'description',
      'collectedLocation', 'contactPhone', 'status',
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
 * @route   DELETE /api/found/:id
 * @access  Private (JWT required + must be the owner)
 * @desc    Delete a found report permanently
 */
export const deleteFoundReport = async (req, res, next) => {
  try {
    const report = await FoundReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Found report not found');
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to delete this report');
    }

    await report.deleteOne();
    res.json({ message: 'Found report deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

import LostReport from '../models/LostReport.js';
import FoundReport from '../models/FoundReport.js';

/**
 * @route   GET /api/reports
 * @access  Public
 * @desc    Combined feed of lost + found reports, sorted newest first.
 *
 * This is the primary endpoint consumed by the frontend Home.jsx page.
 * Each item in the response is normalised to a common shape:
 *  {
 *    id, title, category, location, date (formatted string),
 *    description, contactPhone, type ('lost' | 'found'),
 *    status, timestamp, ...type-specific fields
 *  }
 *
 * Supports query string filters:
 *  - q        : keyword search
 *  - category : category slug
 *  - type     : 'lost' | 'found' | 'all'
 *  - status   : 'searching' | 'matched' | 'resolved' | 'all'
 */
export const getCombinedFeed = async (req, res, next) => {
  try {
    const { q, category, type, status } = req.query;

    // Build shared filter (applies to both collections)
    const sharedFilter = {};

    if (category && category !== 'all') {
      sharedFilter.category = category;
    }

    if (status && status !== 'all') {
      sharedFilter.status = status;
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      sharedFilter.$or = [
        { itemName: regex },
        { location: regex },
        { description: regex },
      ];
    }

    // ── Fetch both collections in parallel ──────────────────────────────
    let lostReports = [];
    let foundReports = [];

    if (!type || type === 'all' || type === 'lost') {
      lostReports = await LostReport.find(sharedFilter)
        .populate('userId', 'name rollNo')
        .sort({ createdAt: -1 });
    }

    if (!type || type === 'all' || type === 'found') {
      foundReports = await FoundReport.find(sharedFilter)
        .populate('userId', 'name rollNo')
        .sort({ createdAt: -1 });
    }

    // ── Normalise lost reports ──────────────────────────────────────────
    const normalizedLost = lostReports.map((r) => ({
      id: r._id.toString(),
      title: r.itemName,
      category: r.category,
      location: r.location,
      date: r.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      description: r.description,
      contactPhone: r.contactPhone,
      hasReward: r.hasReward,
      rewardAmount: r.rewardAmount,
      type: 'lost',
      status: r.status,
      timestamp: r.createdAt.getTime(),
      reportedBy: r.userId,
    }));

    // ── Normalise found reports ─────────────────────────────────────────
    const normalizedFound = foundReports.map((r) => ({
      id: r._id.toString(),
      title: r.itemName,
      category: r.category,
      location: r.location,
      date: r.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      description: r.description,
      contactPhone: r.contactPhone,
      collectedLocation: r.collectedLocation,
      type: 'found',
      status: r.status,
      timestamp: r.createdAt.getTime(),
      reportedBy: r.userId,
    }));

    // ── Merge and sort by timestamp descending ──────────────────────────
    const combined = [...normalizedLost, ...normalizedFound].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    res.json(combined);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports/stats
 * @access  Public
 * @desc    Return aggregate counts used by the Home.jsx stats row.
 *
 * Returns:
 *  - totalLost      : active lost reports (status !== resolved)
 *  - totalFound     : active found reports (status !== resolved)
 *  - totalResolved  : reports (lost or found) with status === 'resolved'
 */
export const getStats = async (req, res, next) => {
  try {
    // Run all three DB count queries in parallel for performance
    const [activeLost, activeFound, resolvedLost, resolvedFound] = await Promise.all([
      LostReport.countDocuments({ status: { $ne: 'resolved' } }),
      FoundReport.countDocuments({ status: { $ne: 'resolved' } }),
      LostReport.countDocuments({ status: 'resolved' }),
      FoundReport.countDocuments({ status: 'resolved' }),
    ]);

    res.json({
      totalLost: activeLost,
      totalFound: activeFound,
      totalResolved: resolvedLost + resolvedFound,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports/my
 * @access  Private (JWT required)
 * @desc    Return all reports (lost + found) filed by the authenticated user.
 *
 * Used by MyReport.jsx to show a user's personal report history.
 */
export const getMyReports = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch both report types for this specific user in parallel
    const [myLost, myFound] = await Promise.all([
      LostReport.find({ userId }).sort({ createdAt: -1 }),
      FoundReport.find({ userId }).sort({ createdAt: -1 }),
    ]);

    // Normalise and merge (same shape as getCombinedFeed)
    const normalizedLost = myLost.map((r) => ({
      id: r._id.toString(),
      title: r.itemName,
      category: r.category,
      location: r.location,
      date: r.date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      }),
      type: 'lost',
      status: r.status,
      timestamp: r.createdAt.getTime(),
    }));

    const normalizedFound = myFound.map((r) => ({
      id: r._id.toString(),
      title: r.itemName,
      category: r.category,
      location: r.location,
      date: r.date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      }),
      type: 'found',
      status: r.status,
      timestamp: r.createdAt.getTime(),
    }));

    const combined = [...normalizedLost, ...normalizedFound].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    res.json(combined);
  } catch (error) {
    next(error);
  }
};

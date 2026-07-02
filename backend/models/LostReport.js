import mongoose from 'mongoose';

/**
 * LostReportSchema
 *
 * Stores reports filed by users who have lost an item on campus.
 * Maps directly to the form fields in frontend/src/pages/ReportLost.jsx.
 *
 * Fields:
 *  - itemName       : Display name of the lost item
 *  - category       : Predefined category (electronics, keys, etc.)
 *  - location       : Last seen location on campus
 *  - date           : Date the item was lost
 *  - description    : Detailed description (colour, marks, stickers, etc.)
 *  - hasReward      : Whether the reporter is offering a reward
 *  - rewardAmount   : Description / amount of the reward (if hasReward)
 *  - contactPhone   : Phone number for the finder to reach the owner
 *  - status         : Lifecycle state of the report
 *  - userId         : Reference to the User who filed the report
 */
const LostReportSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['electronics', 'keys', 'documents', 'books', 'clothing', 'other'],
    },

    location: {
      type: String,
      required: [true, 'Last seen location is required'],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, 'Date lost is required'],
    },

    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
    },

    hasReward: {
      type: Boolean,
      default: false,
    },

    rewardAmount: {
      type: String,
      default: '',
      trim: true,
    },

    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },

    status: {
      type: String,
      enum: ['searching', 'matched', 'resolved'],
      default: 'searching',
    },

    // Reference to the user who filed this report
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // createdAt used for sorting in the combined feed
  }
);

const LostReport = mongoose.model('LostReport', LostReportSchema);

export default LostReport;

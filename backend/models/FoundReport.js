import mongoose from 'mongoose';

/**
 * FoundReportSchema
 *
 * Stores reports filed by users who have found an item on campus.
 * Maps directly to the form fields in frontend/src/pages/ReportFound.jsx.
 *
 * Fields:
 *  - itemName           : Name/description of the found item
 *  - category           : Predefined category
 *  - location           : Where the item was found on campus
 *  - date               : Date the item was found
 *  - description        : Detailed description of the item
 *  - collectedLocation  : Where the item currently is (with finder / security / dept)
 *  - contactPhone       : Phone number of the finder
 *  - status             : Lifecycle state (matched by default, resolved when claimed)
 *  - userId             : Reference to the User who filed the report
 */
const FoundReportSchema = new mongoose.Schema(
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
      required: [true, 'Location where item was found is required'],
      trim: true,
    },

    date: {
      type: Date,
      required: [true, 'Date found is required'],
    },

    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
    },

    collectedLocation: {
      type: String,
      enum: ['with-finder', 'turned-in-security', 'turned-in-dept'],
      default: 'with-finder',
    },

    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },

    status: {
      type: String,
      enum: ['matched', 'resolved'],
      default: 'matched',
    },

    // Reference to the user who found and reported the item
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FoundReport = mongoose.model('FoundReport', FoundReportSchema);

export default FoundReport;

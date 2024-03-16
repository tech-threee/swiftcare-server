import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    details: String,
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.models['ACTIVITY_LOG'] ||
  mongoose.model('ACTIVITY_LOG', activityLogSchema);

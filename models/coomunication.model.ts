import mongoose from 'mongoose';

import { Communication } from '../interfaces/communication.interface';
import AppConstants from '../constants/app.constant';

const communicationSchema = new mongoose.Schema<Communication>(
  {
    sender: {
      participantId: mongoose.Schema.Types.ObjectId,
      role: {
        type: String,
        enum: Object.keys(AppConstants.MODULES),
      },
      email: String,
    },
    recipients: [
      {
        participantId: mongoose.Schema.Types.ObjectId,
        role: {
          type: String,
          enum: Object.keys(AppConstants.MODULES),
        },
        email: String,
      },
    ],
    text: String,
    replies: [
      {
        sender: {
          participantId: mongoose.Schema.Types.ObjectId,
          role: {
            type: String,
            enum: Object.keys(AppConstants.MODULES),
          },
          email: String,
        },
        text: String,
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.models['COMMUNICATION'] ||
  mongoose.model('COMMUNICATION', communicationSchema);

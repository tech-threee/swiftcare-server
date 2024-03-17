import mongoose from 'mongoose';

import { Pagination } from '../../interfaces';
import {
  CreateCommunicationType,
  Reply,
} from '../../interfaces/communication.interface';
import { COMMUNICATION } from '../../models';
import { DecodeBase64, EncodeBase64 } from '../../utils/functions';

export default class CommunicationSchema {
  static async create(payload: CreateCommunicationType) {
    try {
      console.log({ payload })
      return await COMMUNICATION.create({
        ...payload,
        text: EncodeBase64(payload.text),
      });
    } catch (error) {
      throw error;
    }
  }

  static async fetchOneById(id: mongoose.Types.ObjectId) {
    const communication = await COMMUNICATION.findById(id);

    if (!communication) {
      return null;
    }

    communication.text = DecodeBase64(communication.text);

    communication.replies = communication.replies.map((reply: any) => ({
      ...reply,
      text: DecodeBase64(reply.text),
    }));

    return communication;
  }

  static async countUserCommunications(id: mongoose.Types.ObjectId): Promise<number> {
    try {
      // Count communications where the provided id is the sender's participantId
      const senderCount = await COMMUNICATION.countDocuments({
        'sender.participantId': id
      });

      // Count communications where the provided id is found in the recipients' participantId
      const recipientCount = await COMMUNICATION.countDocuments({
        'recipients.participantId': id
      });

      // Total count is the sum of senderCount and recipientCount
      const totalCount: number = senderCount + recipientCount;

      return totalCount;
    } catch (error) {
      throw error;
    }
  }

  static async fetchPaginatedBulk(
    senderId: mongoose.Types.ObjectId,
    payload: Pagination,
  ) {
    try {
      const totalCommunication = await COMMUNICATION.countDocuments();
      const communications = await COMMUNICATION.find({
        'sender.participantId': senderId,
      })
        .select('-sender -recipients -replies')
        .skip((payload.skip - 1) * payload.limit)
        .limit(payload.limit)
        .sort({ createdAt: 'desc' })
        .exec();

      return {
        communications: communications.map((communication: any) => ({
          _id: communication._id,
          text: DecodeBase64(communication.text),
        })),
        totalCommunication,
      };
    } catch (error) {
      throw error;
    }
  }

  static async reply(communicationId: mongoose.Types.ObjectId, reply: Reply) {
    const communication = await COMMUNICATION.findById(communicationId);

    communication.replies = [
      ...communication!.replies,
      {
        ...reply,
        text: EncodeBase64(reply.text),
      },
    ];

    await communication.save();
  }
}

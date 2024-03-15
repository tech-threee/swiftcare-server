import mongoose from 'mongoose';

interface Participant {
  participantId: mongoose.Types.ObjectId;
  userType: string;
  email: string;
}

export interface Reply {
  sender: Participant;
  text: string;
}

export interface Communication {
  sender: Participant;
  recipients: Participant[];
  text: string;
  replies: Reply[];
}

export interface CreateCommunicationType {
  sender: Participant;
  recipients: Participant[];
  text: string;
}

export interface CreateCommunicationRequestPayload {
  // sender: Participant;
  recipients: Participant[];
  text: string;
}

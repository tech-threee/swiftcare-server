import Joi from 'joi';

import AppConstants from '../constants/app.constant';

const Participant = Joi.object()
  .keys({
    participantId: Joi.string().required(),
    userType: Joi.string()
      .valid(AppConstants.ROLES.STAFF, AppConstants.ROLES.PATIENT)
      .required(),
    email: Joi.string().email().required(),
  })
  .required();

const CommunicationRules = {
  create: Joi.object().keys({
    // sender: Participant,
    // there is no need to get the sender since the sender is the one
    // making the request so, we will extract (or create) the sender
    // details from the jwt used to make the request
    // recipients: Joi.array().items(Participant).required(),
    text: Joi.string().required(),
  }),
  readOne: Joi.object().keys({
    communicationId: Joi.string().required(),
  }),
  reply: Joi.object().keys({
    text: Joi.string().required(),
  }),
};

export default CommunicationRules;

import Joi from 'joi';
const PatientValidations = {
  create: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    dob: Joi.string().required(),
    pid: Joi.string().optional(),
    emergency_contacts: Joi.array().optional(),
  }),
  readOne: Joi.object().keys({
    communicationId: Joi.string().required(),
  }),
  reply: Joi.object().keys({
    text: Joi.string().required(),
  }),
};

export default PatientValidations;

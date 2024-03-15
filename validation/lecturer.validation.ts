import Joi from 'joi';

const LecturerValidation = {
  add: Joi.object().keys({
    title: Joi.string().required(),
    surname: Joi.string().required(),
    otherNames: Joi.string().required(),
    staffID: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    officeLocation: Joi.string().allow('', null).optional(),
    officeHours: Joi.string().allow('', null).optional(),
  }),
  update: Joi.object().keys({
    title: Joi.string().required(),
    surname: Joi.string().required(),
    otherNames: Joi.string().required(),
    staffID: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    officeLocation: Joi.string().allow('', null).optional(),
    officeHours: Joi.string().allow('', null).optional(),
  }),
};

export default LecturerValidation;

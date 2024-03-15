import Joi from 'joi';
import AppConstants from '../constants/app.constant';

const ModuleValidation = {
  add: Joi.object({
    title: Joi.string().required(),
    status: Joi.string(),
    slug: Joi.string()
      .valid(...Object.values(AppConstants.MODULES))
      .required(),
  }),
  update: Joi.object({
    title: Joi.string().required(),
    status: Joi.string(),
  }),
};

export default ModuleValidation;

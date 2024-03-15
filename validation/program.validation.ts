import Joi from 'joi';

const ProgramValidation = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export default ProgramValidation;

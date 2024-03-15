import Joi from 'joi';

const IdListValidation = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).required(),
});

export default IdListValidation;

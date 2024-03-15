import Joi from 'joi';

const LevelValidation = {
  add: Joi.object().keys({
    title: Joi.string().required(),
  }),
  update: Joi.object().keys({
    title: Joi.string(),

  }),
}

export default LevelValidation;

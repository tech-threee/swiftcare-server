import Joi from 'joi';

const IdValidation = Joi.object().keys({ id: Joi.string().required() });

export default IdValidation;

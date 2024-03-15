import Joi from 'joi';

const CourseValidation = {
  create: Joi.object().keys({
    programId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid('active', 'archive').required(),
    relation: Joi.string().valid('core', 'elective').required(),
  }),
  update: Joi.object().keys({
    programId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid('active', 'archive').required(),
    relation: Joi.string().valid('core', 'elective').required(),
    level: Joi.string().required(),
  }),
  programId: Joi.object().keys({
    programId: Joi.string().required(),
  }),
};

export default CourseValidation;

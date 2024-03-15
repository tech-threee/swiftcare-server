import Joi from 'joi';

const AcademicYearValidation = Joi.object().keys({
  title: Joi.string().required(),
});

export default AcademicYearValidation;

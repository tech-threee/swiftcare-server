import Joi from 'joi';

const SearchValidation = Joi.object().keys({ query: Joi.string().required() });

export default SearchValidation;

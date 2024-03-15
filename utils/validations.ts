import { Request } from 'express';
import { ValidationChain, check, validationResult } from 'express-validator';
import * as joi from 'joi';

import ApiError from './apiError';
import { capitalizeFirst } from './functions';
import AppConstants from '../constants/app.constant';

// a validator to check whether a property exists in the [req] object
export const checkIfEmpty = (name: string, message?: string): ValidationChain =>
  check(name)
    .exists()
    .withMessage(message ?? `${capitalizeFirst(name)} is required`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(message ?? `${capitalizeFirst(name)} cannot be empty`);

export const isInEnum = (
  checkFor: string,
  isIn: string[],
  message?: string,
): ValidationChain =>
  check(checkFor)
    .isIn(isIn)
    .withMessage(
      message ??
        `${capitalizeFirst(checkFor)} can only be ${isIn.join(' or ')}`,
    );

// check whether there is an file in the [req] object
export const checkFileExists = (
  name: string,
  message?: string,
): ValidationChain =>
  check(name)
    .custom((_, { req }) => {
      if (req.file) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage(message ?? `${capitalizeFirst(name)} is required`);

// handle validation errors if any
export const handleValidation = (req: Request) => {
  // check if there are validation errors
  const validationErrors = validationResult(req);
  // if any, then we handle it and throw it to the next function
  if (!validationErrors.isEmpty()) {
    // grab the first error in the list of errors
    const error = new ApiError(validationErrors.array()[0].msg, 400);
    throw error;
  }
};

export const levelValidation = joi.object({
  title: joi.string().required(),
  color: joi
    .string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .required(),
});

export const programValidation = joi.object({
  title: joi.string().required(),
  description: joi.string(),
});

export const moduleValidation = joi.object({
  title: joi.string().required(),
  status: joi.string(),
  slug: joi
    .string()
    .valid(...Object.values(AppConstants.MODULES))
    .required(),
});

import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import mongoose from 'mongoose';
import EnvConstants from '../constants/env.constant';
import { MODULES_KEY, UserTokenPayload } from '../interfaces/login.interface';
// import ModuleSchema from '../modules/general/module/schema';

export const GeneratePIN = (length: number = 5): string => {
  // generate random {length} digits PIN code
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10);
  }

  return pin;
};

export const BcryptPassword = async (length = 5) => {
  // encrypt password using bcrypt
  const PIN = GeneratePIN(length);
  const HashedPIN = await GenerateBcryptPassword(PIN);
  return {
    PIN,
    HashedPIN,
  };
};

export const GenerateBcryptPassword = async (PIN: string) => {
  const salt = await bcrypt.genSalt(10);
  const HashedPIN = await bcrypt.hash(PIN, salt);
  return HashedPIN;
};

export const ComparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  // compare password with hashed password
  return await bcrypt.compare(password, hashedPassword);
};

export const GenerateToken = (
  user: UserTokenPayload,
): { accessToken: string; refreshToken: string } => {
  //   Create access token
  const accessToken = jwt.sign(
    { id: user.id, _id: user._id, role: user.role || 'PATIENT' },
    EnvConstants.JWT_ACCESS_SECRET,
    {
      expiresIn: EnvConstants.JWT_ACCESS_EXPIRATION,
    },
  );

  //   Create refresh token
  const refreshToken = jwt.sign(
    { id: user.id, _id: user._id, role: user?.role || 'PATIENT' },
    EnvConstants.JWT_REFRESH_SECRET,
    {
      expiresIn: EnvConstants.JWT_REFRESH_EXPIRATION,
    },
  );

  return { accessToken, refreshToken };
};

export const VerifyToken = async (
  token: string,
  type: string,
): Promise<JwtPayload | string> => {
  // verify token
  let secret: string;
  if (type === 'access') {
    secret = EnvConstants.JWT_ACCESS_SECRET;
  } else if (type === 'email') {
    secret = EnvConstants.JWT_EMAIL_VERIFICATION_SECRET;
  } else {
    secret = EnvConstants.JWT_REFRESH_SECRET;
  }

  return jwt.verify(token, secret);
};

/**
 *
 * @param roles  mongoose.Types.ObjectId[]
 * @param type MODULES_KEY
 * @returns Promise<boolean>
 * @description for the array of roles which is an array of mogoose object ids which references the module collection,
               check if any of the module slug is student
 */
// export const HAS_ROLE = async (
//   role: MODULES_KEY,
// ): Promise<boolean> => {
//   // user.type is a mongoose.Types.ObjectId which reference to the module
//   // get the module from the database and check if it is a student module
//   const isStudent = App

//   if (!isStudent) {
//     return false;
//   }

//   return true;
// };

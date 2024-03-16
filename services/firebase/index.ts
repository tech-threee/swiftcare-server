import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import path from 'path';

import EnvConstants from '../../constants/env.constant';
import { generateRandomFilename } from '../../utils/functions';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: EnvConstants.FIREBASE_API_KEY,
  authDomain: EnvConstants.FIREBASE_AUTH_DOMAIN,
  projectId: EnvConstants.FIREBASE_PROJECT_ID,
  storageBucket: EnvConstants.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EnvConstants.FIREBASE_MESSAGING_SENDER_ID,
  appId: EnvConstants.FIREBASE_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const UploadFileToFirebaseStorage = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // pass the data from the previous middleware to the next
    req.payload = req.payload;

    if (!req.file) {
      // add the image's url to the req object and reference it in the next middleware
      // here when user didn't upload an image, we pass the image's url as an empty string
      // @ts-expect-error
      req.image = '';
      return next();
    }

    const newFileExtension = path.extname(req.file?.originalname);
    const storageRef = ref(
      storage,
      // we can add a based folder, /BASE_FOLDER
      `${generateRandomFilename(newFileExtension)}`,
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file?.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file?.buffer,
      metadata,
    );

    // get images url
    const downloadURL = await getDownloadURL(snapshot.ref);
    // add the image's url to the req object and reference it in the next middleware
    // @ts-expect-error
    req.image = downloadURL;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default UploadFileToFirebaseStorage;

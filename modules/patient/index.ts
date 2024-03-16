import { Router } from "express";
import { Signup } from "./controllers/signup.controller";
import ValidationMiddleware from "../../validation/validation.middleware";
import AppConstants from "../../constants/app.constant";
import PatientValidations from "../../validation/patient.validations";
import FetchBulk from "../staff/controllers/query.controller";
import Update, { ProcessUpdateData } from "./controllers/update.controller";
import DeleteBulk from "./controllers/delete_bulk.controller";
import DeleteSingle from "./controllers/delete_single.controller";
import Search from "./controllers/search.controller";
import FetchSingle from "./controllers/fetch_single.controller";

const router = Router()

router.post("/",
    ValidationMiddleware(
        PatientValidations.create,
        AppConstants.REQUEST_TYPE.BODY,
    ),
    Signup
)

// Fetch all Staff
router.get("/", FetchBulk)


// Update Staff
// TODO: Look into uploading image with multer onto firestore
// and deleting the old one when a new image is passed
router.put(
    '/:id',
    ProcessUpdateData,
    // UploadFileToFirebaseStorage,
    Update,
);

// Delete bulk Staff
router.delete(
    '/',
    DeleteBulk,
);

// Delete  a single Staff
router.delete(
    '/:id',
    DeleteSingle,
);


// Search
// TODO: What are the search params
// /search?q=firstName
router.get(
    '/search',
    Search,
);
// Fetch a single Staff single

router.get(
    '/:id',
    FetchSingle,
);

export default router
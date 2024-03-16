import { Router } from "express";
import { CreateStaff } from "./controllers/create.controller";
import FetchBulkStaff from "./controllers/query.controller";
import UpdateStaff, { ProcessUpdateStaffData } from "./controllers/update.controller";
import DeleteBulkStaff from "./controllers/delete_bulk.controller";
import DeleteSingleStaff from "./controllers/delete_single.controller";
import SearchStaff from "./controllers/search.controller";
import FetchSingleStaff from "./controllers/fetch_single.controller";



const router = Router()
// Add Staff
router.post("/", CreateStaff)

// Fetch all Staff
router.get("/", FetchBulkStaff)


// Update Staff
// TODO: Look into uploading image with multer onto firestore
// and deleting the old one when a new image is passed
router.put(
    '/:id',
    ProcessUpdateStaffData,
    // UploadFileToFirebaseStorage,
    UpdateStaff,
);

// Delete bulk Staff
router.delete(
    '/',
    DeleteBulkStaff,
);

// Delete  a single Staff
router.delete(
    '/:id',
    DeleteSingleStaff,
);


// Search
// TODO: What are the search params
// /search?q=firstName
router.get(
    '/search',
    SearchStaff,
);
// Fetch a single Staff single

router.get(
    '/:id',
    FetchSingleStaff,
);


export default router
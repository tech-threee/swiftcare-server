import { Router } from 'express';

import AppConstants from '../../constants/app.constant';
import { IS_LOGGEDIN } from '../../middlewares/auth';
import CommunicationRules from '../../validation/communication.rules';
import ValidationMiddleware from '../../validation/validation.middleware';
import CreateCommunication, { CreateAllPatientsCommunique, CreateSomeStaffCommunique } from './controllers/create.controller';
import ReadBulkCommunications from './controllers/read_bulk.controller';
import ReadOneCommunication from './controllers/read_one.controller';
import ReplyCommunication from './controllers/reply.controller';

const router = Router();

// TODO: Authentication is required here
// the user would have to pass their jwt

// Initiate a communication
router.post(
    '/',
    IS_LOGGEDIN,
    ValidationMiddleware(
        CommunicationRules.create,
        AppConstants.REQUEST_TYPE.BODY,
    ),
    CreateCommunication,
);

router.post("/staff", IS_LOGGEDIN, CreateSomeStaffCommunique)
router.post("/patients", IS_LOGGEDIN, CreateAllPatientsCommunique)

// list the communications that this user has initiated
router.get('/', IS_LOGGEDIN, ReadBulkCommunications);

// Read a communication
router.get(
    '/:communicationId',
    IS_LOGGEDIN,
    ValidationMiddleware(
        CommunicationRules.readOne,
        AppConstants.REQUEST_TYPE.PARAMS,
    ),
    ReadOneCommunication,
);

// Add a reply to a communication
router.post(
    '/:communicationId',
    IS_LOGGEDIN,
    ValidationMiddleware(
        CommunicationRules.readOne,
        AppConstants.REQUEST_TYPE.PARAMS,
    ),
    ValidationMiddleware(
        CommunicationRules.reply,
        AppConstants.REQUEST_TYPE.BODY,
    ),
    ReplyCommunication,
);

export default router;

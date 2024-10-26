import { Router } from 'express';
import {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus
} from '../controllers/soknadController';

const router = Router();

// POST-rute for å sende inn søknad
router.post('/soknad', submitApplication);

// GET-rute for å hente alle søknader
router.get('/soknader', getApplications);

// GET-rute for å hente en spesifikk søknad basert på ID
router.get('/soknader/:id', getApplicationById);

// PATCH-rute for å oppdatere status og tilbakemelding på en spesifikk søknad
router.patch('/soknader/:id/status', updateApplicationStatus);

export default router;

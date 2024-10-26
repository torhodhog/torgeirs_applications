import { Router } from 'express';
import { submitApplication, getApplications } from '../controllers/soknadController';
import { ObjectId } from 'mongodb';
import { get } from 'http';
const router = Router();

// POST-rute for å sende inn søknad
router.post('/soknad', submitApplication);

// GET-rute for å hente alle søknader
router.get('/soknader', getApplications);

router.get('/applications/:id', getApplications);

// GET-rute for å hente kun økonomisøknader
router.get('/soknader/okonomi', async (req, res) => {
  const db = req.app.locals.db;
  const okonomiSoknader = await db.collection('soknader').find({ soknadstype: 'okonomi' }).toArray();
  res.status(200).json(okonomiSoknader);
});



// GET-rute for å hente kun tillatelsessøknader
router.get('/soknader/tillatelse', async (req, res) => {
  const db = req.app.locals.db;
  const tillatelseSoknader = await db.collection('soknader').find({ soknadstype: 'tillatelse' }).toArray();
  res.status(200).json(tillatelseSoknader);
});

// PATCH-rute for å oppdatere status på en søknad
router.patch('/soknad/:id/status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const db = req.app.locals.db;
  
  try {
    const result = await db.collection('soknader').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Feil ved oppdatering av søknadsstatus' });
  }
});

export default router;

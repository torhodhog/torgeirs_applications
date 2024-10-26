import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

// Funksjon for å sende inn søknad
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Mottatt POST-data:', req.body);

    const { navn, epost, beskrivelse, soknadstype, firma, belop, kontonummer, tillatelsestype, begrunnelse, userId } = req.body;
    const db = req.app.locals.db;

    const soknad = {
      navn,
      epost,
      beskrivelse,
      soknadstype,
      status: 'innsendt',
      opprettetDato: new Date(),
      userId: new ObjectId(userId), // Konverter bruker-ID til ObjectId
      firma,
      belop: soknadstype === 'okonomi' ? parseInt(belop) : undefined,
      kontonummer: soknadstype === 'okonomi' ? kontonummer : undefined,
      tillatelsestype: soknadstype === 'tillatelse' ? tillatelsestype : undefined,
      begrunnelse
    };

    const result = await db.collection('soknader').insertOne(soknad);
    console.log('Søknad lagret med ID:', result.insertedId);
    res.status(201).json(result);
  } catch (error) {
    console.error('Feil ved innsending av søknad:', error);
    res.status(500).json({ message: 'Feil ved innsending av søknad' });
  }
};

// Funksjon for å hente alle søknader
export const getApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = req.app.locals.db;
    const soknader = await db.collection('soknader').find().toArray();
    res.status(200).json(soknader);
  } catch (error) {
    console.error('Feil ved henting av søknader:', error);
    res.status(500).json({ message: 'Feil ved henting av søknader' });
  }
};

// Funksjon for å hente en enkelt søknad basert på ID
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const db = req.app.locals.db;

  try {
    const application = await db.collection('soknader').findOne({ _id: new ObjectId(id) });
    if (!application) {
      res.status(404).json({ message: 'Søknad ikke funnet' });
      return;
    }
    res.status(200).json(application);
  } catch (error) {
    console.error("Feil ved henting av søknad:", error);
    res.status(500).json({ message: 'Feil ved henting av søknad' });
  }
};

// Funksjon for å oppdatere status og tilbakemelding på en søknad
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  const { status, feedback } = req.body;
  const { id } = req.params;
  const db = req.app.locals.db;

  try {
    const result = await db.collection('soknader').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, feedback } }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Søknad ikke funnet' });
    }

    res.status(200).json({ message: `Søknad ${status.toLowerCase()}!`, result });
  } catch (error) {
    console.error("Feil ved oppdatering av søknadsstatus:", error);
    res.status(500).json({ message: 'Feil ved oppdatering av søknadsstatus' });
  }
};


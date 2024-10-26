import { Request, Response, NextFunction } from 'express';

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Mottatt POST-data:', req.body);

    // Hent ut userId fra req.body
    const { navn, epost, beskrivelse, soknadstype, firma, belop, kontonummer, tillatelsestype, begrunnelse, userId } = req.body;
    const db = req.app.locals.db;

    interface Soknad {
      navn: string;
      epost: string;
      beskrivelse: string;
      soknadstype: string;
      firma?: string;
      status: string;
      opprettetDato: Date;
      userId?: string;
      belop?: number;
      kontonummer?: string;
      tillatelsestype?: string;
      begrunnelse?: string;
    }

    const soknad: Soknad = {
      navn, 
      epost,
      beskrivelse,
      soknadstype,
      status: 'innsendt',
      opprettetDato: new Date(),
      userId,  
    };

    // Hvis firma er sendt inn, legg det til i søknaden
    if (firma) {
      soknad.firma = firma;
    }

    // Logg hvilken type søknad det er
    if (soknadstype === 'okonomi') {
      soknad.belop = parseInt(belop);
      soknad.kontonummer = kontonummer;
      soknad.begrunnelse = begrunnelse;
      console.log('Økonomisk søknad:', soknad);
    } else if (soknadstype === 'tillatelse') {
      soknad.tillatelsestype = tillatelsestype;
      soknad.begrunnelse = begrunnelse;
      console.log('Tillatelsessøknad:', soknad);
    } else {
      res.status(400).json({ message: 'Ugyldig søknadstype' });
      return;
    }

    // Forsøk å lagre i databasen
    const result = await db.collection('soknader').insertOne(soknad);
    console.log('Søknad lagret med ID:', result.insertedId);
    res.status(201).json(result);
  } catch (error) {
    console.error('Feil ved innsending av søknad:', error);
    res.status(500).json({ message: 'Feil ved innsending av søknad' });
  }
};


export const getApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = req.app.locals.db;
    const soknader = await db.collection('soknader').find().toArray();
    res.status(200).json(soknader);
  } catch (error) {
    next(error); // Feilhåndtering
  }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/soknad', async (req, res) => {
    const { navn, epost, beskrivelse } = req.body;
    const db = req.app.locals.db; // Få tilgang til db fra app.locals
    const result = await db.collection('soknader').insertOne({
        navn,
        epost,
        beskrivelse,
        status: 'innsendt',
        opprettetDato: new Date(),
    });
    res.status(201).json(result);
});
router.get('/soknader', async (req, res) => {
    const db = req.app.locals.db;
    const soknader = await db.collection('soknader').find().toArray();
    res.status(200).json(soknader);
});
exports.default = router;

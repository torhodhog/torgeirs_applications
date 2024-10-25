"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const soknad_1 = __importDefault(require("./src/routes/soknad")); // Importer rutene
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hogheim:2uK9xqZqHXpdTM2C@cluster0.t5cw8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app.use(express_1.default.json()); // For å kunne lese JSON-data
const start = async () => {
    try {
        console.log('Starting server...');
        const client = new mongodb_1.MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db('Cluster0'); // Sett din database her
        console.log('Connected to MongoDB');
        // Lagre db-tilkoblingen i app.locals
        app.locals.db = db;
        // Bruk rutene
        app.use('/api', soknad_1.default);
        // Legg til denne linjen under app.use('/api', soknadRoutes);
        app.get('/', (req, res) => {
            res.send('Server is running. Access /api/soknader for applications.');
        });
        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};
start();

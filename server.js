require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const courseRoutes = require('./routes/courseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reviews', reviewRoutes);

// Route de base
app.get('/', (req, res) => {
    res.status(200).send('<h1>Page d\'accueil de notre API de Blog</h1>');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

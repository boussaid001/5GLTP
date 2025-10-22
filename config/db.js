const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use local MongoDB by default, or MONGODB_URI if provided
        const mongoURI = process.env.MONGODB_URI;
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error.message);
        console.log('Tentative de connexion à MongoDB local...');
        
        // Fallback to local MongoDB if Atlas fails
        try {
            const conn = await mongoose.connect('mongodb://localhost:27017/blog-api', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDB local connecté: ${conn.connection.host}`);
        } catch (localError) {
            console.error('Impossible de se connecter à MongoDB local:', localError.message);
            console.log('Veuillez démarrer MongoDB localement ou configurer MONGODB_URI');
            process.exit(1);
        }
    }
};

module.exports = connectDB;

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Vérification des variables
if (!supabaseUrl || !supabaseKey) {
  console.error("Erreur: SUPABASE_URL ou SUPABASE_KEY manquante dans Vercel.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Route de test (page d'accueil de l'API)
app.get('/', (req, res) => {
  res.json({ status: "OK", message: "API BrazzaLink fonctionnelle sur Vercel !" });
});

// Exemple de route pour tester Supabase (remplace 'users' par une de tes tables si besoin)
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Configuration du serveur local / Vercel
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
}

// OBLIGATOIRE POUR VERCEL
module.exports = app;

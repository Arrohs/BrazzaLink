const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 1. ENDPOINT : Récupérer la liste des produits
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 2. ENDPOINT : Inscription / Connexion avec Numéro de Téléphone
app.post('/api/auth/login', async (req, res) => {
  const { phone_number, full_name, city } = req.body;

  if (!phone_number) {
    return res.status(400).json({ error: "Le numéro de téléphone est obligatoire" });
  }

  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone_number', phone_number)
    .single();

  if (!user) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ phone_number, full_name, city }])
      .select()
      .single();

    if (createError) return res.status(400).json({ error: createError.message });
    user = newUser;
  }

  res.json({ message: "Authentification réussie", user });
});

// 3. ENDPOINT : Suivi de Colis (Tracking Chine -> Congo)
app.get('/api/shipments/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('shipments')
    .select('*, products(title, images)')
    .eq('user_id', userId);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur BrazzaLink prêt sur le port ${PORT}`);
});
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { playerName, score } = req.body;

  // Basic validation
  if (!playerName || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Anti-cheat validation
  if (score <= 0 || score > 10000) {
    return res.status(400).json({ error: 'Score is out of realistic bounds' });
  }

  // Initialize Supabase from hidden Environment Variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase
      .from('leaderboard')
      .insert([{ player_name: playerName, score: score }]);

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in submitScore API:', err.message);
    return res.status(500).json({ error: 'Failed to submit score' });
  }
}

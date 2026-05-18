import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export class Leaderboard {
    static async submitScore(playerName, score) {
        if (!playerName || score <= 0) return; // Don't submit empty names or 0 scores

        try {
            const { error } = await supabase
                .from('leaderboard')
                .insert([
                    { player_name: playerName, score: score }
                ]);

            if (error) throw error;
            console.log('Score submitted successfully!');
            
            // Refresh the leaderboard to show the new score
            await this.fetchAndRenderScores();
        } catch (error) {
            console.error('Error submitting score:', error.message);
        }
    }

    static async fetchAndRenderScores() {
        const container = document.getElementById('leaderboard-list');
        if (!container) return;

        // Show loading state
        container.innerHTML = '<div class="lb-loading">Loading top squads...</div>';

        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('player_name, score')
                .order('score', { ascending: false })
                .limit(10);

            if (error) throw error;

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
                return;
            }

            // Render scores
            container.innerHTML = '';
            data.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'lb-item';
                
                let rankClass = '';
                if (index === 0) rankClass = 'rank-1';
                else if (index === 1) rankClass = 'rank-2';
                else if (index === 2) rankClass = 'rank-3';

                item.innerHTML = `
                    <div class="lb-rank ${rankClass}">#${index + 1}</div>
                    <div class="lb-name">${this.escapeHTML(entry.player_name)}</div>
                    <div class="lb-score">${entry.score}</div>
                `;
                container.appendChild(item);
            });

        } catch (error) {
            console.error('Error fetching scores:', error.message);
            container.innerHTML = '<div class="lb-error">Could not load leaderboard.</div>';
        }
    }

    // Basic HTML escaping to prevent XSS from weird player names
    static escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

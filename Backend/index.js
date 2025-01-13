const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs'); 
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

function extractVideoId(url) {
    const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

app.post('/get-transcript', async (req, res) => {
    const { youtubeUrl, language } = req.body;

    if (!youtubeUrl || !language) {
        return res.status(400).json({ error: 'youtubeUrl and language are required.' });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL provided.' });
    }

    const queryParams = qs.stringify({
        video_id: videoId,
        lang: language,
        format: 'json'
    });

    const options = {
        method: 'GET',
        url: `https://high-availability-youtube-transcript-api.p.rapidapi.com/yt_transcript?${queryParams}`,
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-ua' : 'RapidAPI-Playground',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'high-availability-youtube-transcript-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        console.log("API Response:", response.data);

        if (response.data || response.data.transcript) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'Transcript not found.' });
        }
    } catch (error) {
        console.error('Error fetching transcript:', error.message);
        res.status(500).json({ error: 'Failed to fetch transcript. Check your API subscription or inputs.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

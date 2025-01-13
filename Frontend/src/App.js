import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [message, setMessage] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        setSummary('');
        axios.post('http://localhost:5001/get-transcript', { youtubeUrl: videoUrl, language: 'en' })
            .then((response) => {
                setMessage(response.data.text || 'Transcript not available');
            })
            .catch((error) => {
                console.error('Error fetching transcript:', error);
                setMessage('Something went wrong!');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSummarize = () => {
        if (!message) return;
        setLoading(true);
        axios.post('http://localhost:5001/summarize-transcript', { transcript: message })
            .then((response) => {
                setSummary(response.data.summary || 'Summary not available');
            })
            .catch((error) => {
                console.error('Error generating summary:', error);
                setSummary('Failed to generate summary');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
            <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    🎬 YouTube Transcript Summarizer
                </h1>
                <textarea
                    placeholder="📹 Enter YouTube video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-300 mb-4 transition ease-in-out duration-300"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {loading ? '⏳ Processing...' : '🔍 Get Transcript'}
                </button>

                {message && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-inner">
                        <h2 className="text-lg font-bold text-gray-700">📝 Transcript:</h2>
                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {message}
                        </p>
                    </div>
                )}

                {message && (
                    <button
                        onClick={handleSummarize}
                        disabled={loading}
                        className={`w-full py-2 px-4 mt-4 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300 ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                        {loading ? '⏳ Summarizing...' : '📝 Summarize Transcript'}
                    </button>
                )}

                {summary && (
                    <div className="mt-6 bg-green-50 p-4 rounded-md shadow-inner">
                        <h2 className="text-lg font-bold text-gray-700">📚 Summary:</h2>
                        <p className="mt-2 text-sm text-green-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {summary}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

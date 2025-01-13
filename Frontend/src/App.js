import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    YouTube URL Processor
                </h1>
                <textarea
                    placeholder="Enter YouTube video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Processing...
                        </div>
                    ) : (
                        'Go'
                    )}
                </button>
                {message && (
                    <p className="mt-4 text-center text-lg text-green-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default App;

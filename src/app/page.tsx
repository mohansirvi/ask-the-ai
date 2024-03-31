"use client"

import React, { useState } from 'react';

const Home: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const askTheAI = async () => {
    if (inputMessage.trim() === '') return;

    try {
      setIsButtonDisabled(true);

      //console.log(JSON.stringify({ query: inputMessage }));
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      console.log(response);
      const data = await response.json();

      setMessageHistory((prevHistory) => [
        ...prevHistory,
        `User: ${inputMessage}`,
        `Assistant: ${data.response}`,
      ]);

      setInputMessage('');
    } catch (error) {
      console.error('Error making the API call:', error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full mx-auto p-6">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md w-full">
          {messageHistory.map((message, index) => (
            <div
              key={index}
              className={`p-2 border rounded-md ${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
              }`}
            >
              <p className="text-black">{message}</p> {/* Adjusted font color */}
            </div>
          ))}
        </div>

        <textarea
          className="w-full p-4 mb-4 rounded-lg shadow-md resize-none bg-white text-black"
          rows={6}
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        ></textarea>

        <button
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={askTheAI}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? 'Processing...' : 'Ask the AI'}
        </button>
      </div>
    </div>
  );
};

export default Home;

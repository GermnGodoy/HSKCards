import { useState, useEffect } from 'react';
import FlipCardReact from './FlipCardReact';
import { mockWords } from '../data/mockWords';

export default function CardsList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    // First test if the API is working at all
    async function testApi() {
      try {
        console.log('Testing API connection...');
        const testResponse = await fetch('/api/test.json');
        const testData = await testResponse.json();
        console.log('API test response:', testData);
        setApiStatus(`API status: ${testData.status}`);
        
        // If test is successful, proceed to fetch words
        fetchWords();
      } catch (testErr) {
        console.error('API test failed:', testErr);
        setApiStatus('API test failed - using mock data');
        // Use mock data instead
        setWords(mockWords);
        setUsingMockData(true);
        setLoading(false);
      }
    }
    
    async function fetchWords() {
      console.log('Fetching words from API...');
      try {
        const response = await fetch('/api/random-words?count=10');
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch words: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched words data:', data);
        
        if (!Array.isArray(data)) {
          console.error('API did not return an array:', data);
          setApiStatus('Invalid API response - using mock data');
          setWords(mockWords);
          setUsingMockData(true);
          setLoading(false);
          return;
        }
        
        if (data.length === 0) {
          console.warn('API returned empty array - using mock data');
          setApiStatus('Empty API response - using mock data');
          setWords(mockWords);
          setUsingMockData(true);
        } else {
          setWords(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching words:', err);
        setApiStatus(`API error: ${err.message} - using mock data`);
        // Use mock data as fallback
        setWords(mockWords);
        setUsingMockData(true);
        setLoading(false);
      }
    }

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-square-container">
          <div className="loading-square"></div>
          <div className="loading-square-inner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {usingMockData && (
        <div className="mock-data-notice">
          Using demo data. API connection failed.
        </div>
      )}
      <div className="cards-grid">
        {words.length === 0 ? (
          <div className="error">No words found. Please try again.</div>
        ) : (
          words.map((word, index) => (
            <FlipCardReact key={index} word={word} />
          ))
        )}
      </div>
    </>
  );
} 
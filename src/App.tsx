import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css'; 

interface Quote {
  quote: string;
  author: string;
}

interface QuotesData {
  quotes: Quote[];
}

const colors = [
  '#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6',
  '#FB6964', '#342224', '#472E32', '#BDBB99', '#77B1A9', '#73A857'
];

const API_URL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';

const App: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote>({ quote: '', author: '' });
  const [currentColor, setCurrentColor] = useState<string>('#16a085');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getNewQuote = useCallback(() => {
    if (quotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const newQuote = quotes[randomIndex];
    setCurrentQuote(newQuote);

    let randomColorIndex;
    do {
        randomColorIndex = Math.floor(Math.random() * colors.length);
    } while (colors[randomColorIndex] === currentColor);
    
    setCurrentColor(colors[randomColorIndex]);
  }, [quotes, currentColor]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get<QuotesData>(API_URL);
        const fetchedQuotes = response.data.quotes;
        setQuotes(fetchedQuotes);
      } catch (error) {
        console.error('Erro ao buscar as citações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []); 

  useEffect(() => {
    if (!isLoading && quotes.length > 0) {
      getNewQuote();
    }
  }, [isLoading, quotes]);

  const tweetText = `"${currentQuote.quote}" - ${currentQuote.author}`;
  const tweetURL = `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent(tweetText)}`;
  const tumblrURL = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=${encodeURIComponent(currentQuote.author)}&content=${encodeURIComponent(currentQuote.quote)}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;

  const dynamicBodyStyles = {
    backgroundColor: currentColor,
    transition: 'background-color 1s ease', 
  };
  const dynamicElementStyles = {
    color: currentColor,
    transition: 'color 1s ease',
  };

  if (isLoading || quotes.length === 0) {
    return (
      <div 
        id="wrapper" 
        style={dynamicBodyStyles} 
        className="flex flex-col justify-center items-center min-h-screen font-raleway"
      >
        <div 
          id="quote-box" 
          className="bg-white rounded-md p-10 w-quote-width shadow-lg text-gray-800"
        >
          <p className="text-center">
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="wrapper" 
      style={dynamicBodyStyles} 
      className="flex flex-col justify-center items-center min-h-screen" 
    >
      <div 
        id="quote-box" 
        className="bg-white rounded-md p-10 min-w-xs max-w-4/5 shadow-lg"
      >
        
        <div className="text-center text-[1.75em] font-medium" style={dynamicElementStyles}>
          <i className="fa fa-quote-left mr-2"></i>
          <span id="text">{currentQuote.quote}</span> 
        </div>
        
        <div className="text-right mt-5 text-base" style={dynamicElementStyles}>
          <span id="author">- {currentQuote.author}</span>
        </div>
        
        <div className="flex justify-between items-center mt-8">
          
          <div className='flex gap-3'>
            <a
              id="tweet-quote"
              title="Tweet this quote!"
              target="_top"
              href={tweetURL}
              style={{ backgroundColor: currentColor, transition: 'background-color 1s ease' }}
              className="social-button text-white rounded-md opacity-100 hover:opacity-90 transition-opacity duration-300"
            >
              <i className="fa fa-twitter"></i>
            </a>
            <a
              id="tweet-quote"
              title="Post this quote on tumblr!"
              target="_top"
              href={tumblrURL}
              style={{ backgroundColor: currentColor, transition: 'background-color 1s ease' }}
              className="social-button text-white rounded-md opacity-100 hover:opacity-90 transition-opacity duration-300"
            >
              <i className="fa fa-tumblr"></i>
            </a>
          </div>
          
          <button
            id="new-quote"
            onClick={getNewQuote}
            style={{ backgroundColor: currentColor, transition: 'background-color 1s ease' }}
            className="text-white px-4 py-2 rounded-md font-normal text-sm opacity-100 hover:opacity-90 transition-opacity duration-300 shadow-md"
          >
            New quote
          </button>
        </div>
      </div>

      <div className="footer w-quote-width text-center mt-4 text-sm text-white">
        by <a href="https://github.com/Irwing-Dev" target='_blank' className="font-medium text-white no-underline"><em>Irwing-Dev</em></a>
      </div>
    </div>
  );
};

export default App;
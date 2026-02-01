import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState('USD');

  useEffect(() => {
    // Auto-detect currency based on locale
    const userLocale = navigator.language || navigator.userLanguage;
    if (userLocale && userLocale.toLowerCase().includes('in')) {
      setCurrencyState('INR');
    }
    
    // Load from localStorage if exists
    const saved = localStorage.getItem('avocado_currency');
    if (saved) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('avocado_currency', newCurrency);
  };

  const formatPrice = (priceUSD) => {
    if (currency === 'INR') {
      const priceINR = Math.round(priceUSD * 83);
      return `₹${priceINR.toLocaleString('en-IN')}`;
    }
    return `$${priceUSD}`;
  };

  const convertPrice = (priceUSD) => {
    if (currency === 'INR') {
      return Math.round(priceUSD * 83);
    }
    return priceUSD;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

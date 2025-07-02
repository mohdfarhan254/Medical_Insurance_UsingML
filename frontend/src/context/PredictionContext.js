import { createContext, useState } from 'react';

export const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [predictionData, setPredictionData] = useState(null);
  return (
    <PredictionContext.Provider value={{ predictionData, setPredictionData }}>
      {children}
    </PredictionContext.Provider>
  );
};

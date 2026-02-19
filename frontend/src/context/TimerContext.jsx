import { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();
export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  return (
    <TimerContext.Provider value={{ elapsedTime, setElapsedTime, timerRunning, setTimerRunning }}>
      {children}
    </TimerContext.Provider>
  );
};

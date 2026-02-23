// File: frontend/src/utils/date.js
import { useEffect, useState } from 'react';

// Returns YYYY-MM-DD for the local day (NOT UTC).
// Use this instead of new Date().useLiveLocalDay().
export const yyyyMmDdLocal = (d = new Date()) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};

// React hook: updates automatically when local day flips (midnight)
export const useLiveLocalDay = () => {
  const [day, setDay] = useState(() => yyyyMmDdLocal());

  useEffect(() => {
    const id = setInterval(() => {
      const next = yyyyMmDdLocal();
      setDay((prev) => (prev === next ? prev : next));
    }, 30 * 1000);

    return () => clearInterval(id);
  }, []);

  return day; // "YYYY-MM-DD"
};

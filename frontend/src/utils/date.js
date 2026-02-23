// Returns YYYY-MM-DD for the *local* day, not UTC.
// Use this instead of new Date().toISOString().split('T')[0].
export const yyyyMmDdLocal = (d = new Date()) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};

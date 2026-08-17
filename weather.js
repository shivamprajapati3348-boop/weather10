// Vercel Serverless Function (Node.js)
// Put this file at <repo-root>/api/weather.js
// It reads OPENWEATHER_API_KEY from environment variables.

export default async function handler(req, res) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ message: 'Server misconfigured: API key missing' });
    return;
  }

  const city = req.query.city || req.query.q;
  if (!city) {
    res.status(400).json({ message: 'Missing city parameter' });
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      // forward OpenWeatherMap error message if possible
      const err = await r.json().catch(()=>null);
      const msg = (err && err.message) ? err.message : 'Failed to fetch weather';
      res.status(r.status || 500).json({ message: msg });
      return;
    }
    const data = await r.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('weather fetch error', error);
    res.status(500).json({ message: 'Error fetching weather' });
  }
}

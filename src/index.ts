import { config } from 'dotenv';
import app from './app';

config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Al-Furqon Backend running on port ${PORT}`);
});

export default app;
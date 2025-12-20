import { config } from 'dotenv';
import app from './app';
import { AppConfig } from './utils/config';

config();

const PORT = AppConfig.port;

app.listen(PORT, () => {
});

export default app;
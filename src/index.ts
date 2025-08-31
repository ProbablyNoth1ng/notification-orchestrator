import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { preferencesControllerFactory } from './controllers/preferences.controller';
import { eventsControllerFactory } from './controllers/events.controller';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

preferencesControllerFactory(app);
eventsControllerFactory(app);

app.use((err: any, res: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
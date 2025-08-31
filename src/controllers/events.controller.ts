import { Express, Request, Response } from 'express';
import { incomingEventSchema, formatZodError } from '../types/types';
import { EventProcessorService } from '../services/eventProcessorService';
import { DNDService } from '../services/dndService';
import { preferencesService } from './preferences.controller';


const dndService = new DNDService();
const eventProcessorService = new EventProcessorService(preferencesService, dndService);

export const eventsControllerFactory = (app: Express) => {

  
  app.post('/events', (req: Request, res: Response) => {
    try {
      console.log('Received event:', req.body);
      

      const validationResult = incomingEventSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({ 
          error: 'Validation failed',
          details: formatZodError(validationResult.error)
        });
        return;
      }

      const event = validationResult.data;
      const decision = eventProcessorService.processEvent(event);

      console.log('Processing decision:', decision);

      if (decision.decision === 'PROCESS_NOTIFICATION') {
        res.status(202).json(decision);
      } else {
        res.status(200).json(decision);
      }
    } catch (error) {
      console.error('Error processing event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

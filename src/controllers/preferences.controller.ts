import { Express, Request, Response } from 'express';
import { userPreferencesSchema, formatZodError } from '../types/types';
import { PreferencesService } from '../services/preferencesService';

export const preferencesService = new PreferencesService();

export const preferencesControllerFactory = (app: Express) => {

  app.get('/preferences/:userId', (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      
      if (!userId || userId.trim() === '') {
        res.status(400).json({ error: 'userId is required and cannot be empty' });
        return;
      }

      console.log(`Preferences for user ${userId} requested`);
      
      const preferences = preferencesService.getPreferences(userId);
      
      if (!preferences) {
        res.status(404).json({ error: 'User preferences not found' });
        return;
      }

      res.status(200).json(preferences);
    } catch (error) {
      console.error('Error getting preferences:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  app.post('/preferences/:userId', (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!userId || userId.trim() === '') {
        res.status(400).json({ error: 'userId is required and cannot be empty' });
        return;
      }

      console.log(`Preferences for user ${userId} updated:`, req.body);

      const bodyValidation = userPreferencesSchema.safeParse(req.body);
      
      if (!bodyValidation.success) {
        res.status(400).json({ 
          error: 'Validation failed',
          details: formatZodError(bodyValidation.error)
        });
        return;
      }

      const preferences = bodyValidation.data;
      preferencesService.setPreferences(userId, preferences);
      
      res.status(201).json({ message: 'Preferences updated successfully' });
    } catch (error) {
      console.error('Error setting preferences:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};



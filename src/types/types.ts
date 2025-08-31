import { z } from 'zod';

const timeSchema = z.string().regex(
  /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
);

const dndWindowSchema = z.object({
  start: timeSchema,
  end: timeSchema
}).refine((data) => {

  return data.start !== data.end;
}, {
  message: 'DND start and end times must be different',
  path: ['dnd']
});

const eventSettingSchema = z.object({
  enabled: z.boolean()
});

const eventSettingsSchema = z.record(z.string(), eventSettingSchema).refine((data) => {
  return Object.keys(data).length > 0;
}, {
  message: 'At least one event setting must be provided'
});

export const userPreferencesSchema = z.object({
  dnd: dndWindowSchema,
  eventSettings: eventSettingsSchema
});

export const incomingEventSchema = z.object({
  eventId: z.string().min(1, 'eventId cannot be empty'),
  userId: z.string().min(1, 'userId cannot be empty'),
  eventType: z.string().min(1, 'eventType cannot be empty'),
  timestamp: z.string().datetime('timestamp must be a valid ISO 8601 datetime')
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1, 'userId cannot be empty')
});

export interface NotificationDecision {
  decision: 'PROCESS_NOTIFICATION' | 'DO_NOT_NOTIFY' ;
  reason?: 'DND_ACTIVE' | 'USER_UNSUBSCRIBED_FROM_EVENT' | 'USER_NOT_FOUND';
}

export const formatZodError = (error: z.ZodError) => {
  return error.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};


export type DNDWindow = z.infer<typeof dndWindowSchema>;
export type EventSetting = z.infer<typeof eventSettingSchema>;
export type EventSettings = z.infer<typeof eventSettingsSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type IncomingEvent = z.infer<typeof incomingEventSchema>;

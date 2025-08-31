import { IncomingEvent, NotificationDecision } from '../types/types';
import { DNDService } from './dndService';
import { PreferencesService } from './preferencesService';


export class EventProcessorService {
  constructor(
    private preferencesService: PreferencesService,
    private dndService: DNDService
  ) {}

  processEvent(event: IncomingEvent): NotificationDecision {
    const preferences = this.preferencesService.getPreferences(event.userId);
    

    if (!preferences) {
        return {
            decision: 'DO_NOT_NOTIFY',
            reason: 'USER_NOT_FOUND'
        };
    }

    const eventSetting = preferences.eventSettings[event.eventType];
    if (eventSetting && !eventSetting.enabled) {
      return {
            decision: 'DO_NOT_NOTIFY',
            reason: 'USER_UNSUBSCRIBED_FROM_EVENT'
      };
    }

    if (this.dndService.isWithinDNDWindow(event.timestamp, preferences.dnd)) {
      return {
            decision: 'DO_NOT_NOTIFY',
            reason: 'DND_ACTIVE'
      };
    }

    return { decision: 'PROCESS_NOTIFICATION' };
  }
}

import { DNDWindow } from '../types/types';

export class DNDService {
  isWithinDNDWindow(timestamp: string, dndWindow: DNDWindow): boolean {
    const eventTime = new Date(timestamp);

    const eventMsOfDay =
      eventTime.getUTCHours() * 60 * 60 * 1000 +
      eventTime.getUTCMinutes() * 60 * 1000 +
      eventTime.getUTCSeconds() * 1000 +
      eventTime.getUTCMilliseconds();

    const [startHour, startMinute] = dndWindow.start.split(':').map(Number);
    const [endHour, endMinute] = dndWindow.end.split(':').map(Number);

    const startMsOfDay = (startHour * 60 + startMinute) * 60 * 1000;
    const endMsOfDay   = (endHour   * 60 + endMinute)   * 60 * 1000;


    if (startMsOfDay < endMsOfDay) {
      return eventMsOfDay >= startMsOfDay && eventMsOfDay < endMsOfDay;
    }


    return eventMsOfDay >= startMsOfDay || eventMsOfDay < endMsOfDay;
  }
}

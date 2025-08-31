import { UserPreferences } from '../types/types';

export class PreferencesService {
  private preferences: Map<string, UserPreferences> = new Map();

  getPreferences(userId: string): UserPreferences | undefined {
    return this.preferences.get(userId);
  }

  setPreferences(userId: string, preferences: UserPreferences): void {
    this.preferences.set(userId, preferences);
  }
}

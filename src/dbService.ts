// dbService.ts
import { Employee, Ambulance, AppUser, ScheduleEntry, Report, CustomRole } from './types';

interface AppData {
  employees: Employee[];
  ambulances: Ambulance[];
  users: AppUser[];
  schedule: ScheduleEntry[];
  reports: Report[];
  hospitals: string[];
  customRoles: CustomRole[];
}

export const dbService = {
  getAllData: async (): Promise<AppData> => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        employees: [],
        ambulances: [],
        users: [],
        schedule: [],
        reports: [],
        hospitals: [],
        customRoles: []
      };
    }
  },

  saveAllData: async (data: AppData): Promise<void> => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save data');
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }
};

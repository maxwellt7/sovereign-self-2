import { UUID, Timestamps } from './common';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User extends Timestamps {
  id: UUID;
  clerkUserId: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  onboardingCompleted: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  journaling?: {
    defaultMood?: string;
    autoSave?: boolean;
  };
}

export interface CreateUserDto {
  clerkUserId: string;
  email: string;
  fullName?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  preferences?: Partial<UserPreferences>;
  onboardingCompleted?: boolean;
}


export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  semester: number;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  semester?: number;
  department?: string;
  avatar_url?: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  code: string;
  color: string;
  room: string | null;
  professor: string | null;
}

export interface TimetableSlot {
  id: string;
  user_id: string;
  subject_id: string;
  day_of_week: string; // "Mon", "Tue", etc.
  start_time: string; // "HH:MM:SS" or "HH:MM"
  end_time: string; // "HH:MM:SS" or "HH:MM"
  class_type: string; // "Lecture", "Lab", etc.
  room: string | null;
  subject?: Subject;
}

export interface Note {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  content: string;
  folder_name: string;
  is_pinned: boolean;
  tags: string[];
  words_count: number;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  is_done: boolean;
  progress_percentage: number;
}

export interface Attendance {
  id: string;
  user_id: string;
  subject_id: string;
  attended_count: number;
  total_count: number;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  event_type: 'assignment' | 'exam' | 'event' | 'study_session';
  label: string;
  event_date: string; // "YYYY-MM-DD"
  description: string | null;
}

export interface StudyGroup {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface StudyGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string; // "creator", "member"
  joined_at: string;
}

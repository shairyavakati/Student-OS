import api from '@/lib/api';
import {
  Token,
  Profile,
  ProfileUpdate,
  Subject,
  TimetableSlot,
  Note,
  Assignment,
  Attendance,
  StudyGroup,
  StudyGroupMember,
} from '@/types/api';

// --- AUTHENTICATION ---
export const authService = {
  async signup(data: any): Promise<Profile> {
    const res = await api.post('/api/v1/auth/signup', data);
    return res.data;
  },

  async login(data: any): Promise<Token> {
    const res = await api.post('/api/v1/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<Profile> {
    const res = await api.get('/api/v1/auth/me');
    return res.data;
  },
};

// --- PROFILE ---
export const profileService = {
  async updateProfile(data: ProfileUpdate): Promise<Profile> {
    const res = await api.put('/api/v1/profile', data);
    return res.data;
  },
};

// --- SUBJECTS ---
export const subjectService = {
  async list(): Promise<Subject[]> {
    const res = await api.get('/api/v1/subjects');
    return res.data;
  },

  async create(data: { name: string; code: string; color: string; room?: string; professor?: string }): Promise<Subject> {
    const res = await api.post('/api/v1/subjects', data);
    return res.data;
  },
};

// --- TIMETABLE ---
export const timetableService = {
  async list(): Promise<TimetableSlot[]> {
    const res = await api.get('/api/v1/timetable');
    return res.data;
  },

  async create(data: {
    subject_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    class_type: string;
    room?: string;
  }): Promise<TimetableSlot> {
    const res = await api.post('/api/v1/timetable', data);
    return res.data;
  },
};

// --- NOTES ---
export const noteService = {
  async list(): Promise<Note[]> {
    const res = await api.get('/api/v1/notes');
    return res.data;
  },

  async create(data: {
    subject_id?: string | null;
    title: string;
    content: string;
    folder_name?: string;
    is_pinned?: boolean;
    tags?: string[];
  }): Promise<Note> {
    const res = await api.post('/api/v1/notes', data);
    return res.data;
  },

  async update(
    id: string,
    data: {
      subject_id?: string | null;
      title?: string;
      content?: string;
      folder_name?: string;
      is_pinned?: boolean;
      tags?: string[];
    }
  ): Promise<Note> {
    const res = await api.put(`/api/v1/notes/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await api.delete(`/api/v1/notes/${id}`);
    return res.data;
  },
};

// --- ASSIGNMENTS ---
export const assignmentService = {
  async list(): Promise<Assignment[]> {
    const res = await api.get('/api/v1/assignments');
    return res.data;
  },

  async create(data: {
    subject_id?: string | null;
    title: string;
    due_date: string;
    priority?: 'low' | 'medium' | 'high';
    is_done?: boolean;
    progress_percentage?: number;
  }): Promise<Assignment> {
    const res = await api.post('/api/v1/assignments', data);
    return res.data;
  },

  async update(
    id: string,
    data: {
      subject_id?: string | null;
      title?: string;
      due_date?: string;
      priority?: 'low' | 'medium' | 'high';
      is_done?: boolean;
      progress_percentage?: number;
    }
  ): Promise<Assignment> {
    const res = await api.put(`/api/v1/assignments/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await api.delete(`/api/v1/assignments/${id}`);
    return res.data;
  },
};

// --- ATTENDANCE ---
export const attendanceService = {
  async list(): Promise<Attendance[]> {
    const res = await api.get('/api/v1/attendance');
    return res.data;
  },

  async create(data: { subject_id: string; attended_count?: number; total_count?: number }): Promise<Attendance> {
    const res = await api.post('/api/v1/attendance', data);
    return res.data;
  },

  async update(id: string, data: { attended_count?: number; total_count?: number }): Promise<Attendance> {
    const res = await api.put(`/api/v1/attendance/${id}`, data);
    return res.data;
  },
};

// --- STUDY GROUPS ---
export const groupService = {
  async list(): Promise<StudyGroup[]> {
    const res = await api.get('/api/v1/groups');
    return res.data;
  },

  async create(data: { name: string; description?: string }): Promise<StudyGroup> {
    const res = await api.post('/api/v1/groups', data);
    return res.data;
  },

  async getMembers(groupId: string): Promise<StudyGroupMember[]> {
    const res = await api.get(`/api/v1/groups/${groupId}/members`);
    return res.data;
  },

  async join(groupId: string): Promise<StudyGroupMember> {
    const res = await api.post(`/api/v1/groups/${groupId}/join`);
    return res.data;
  },
};

// --- AI FEATURES ---
export const aiService = {
  async generateStudyPlan(learningSpeed: 'slow' | 'medium' | 'fast' = 'medium'): Promise<any> {
    const formData = new FormData();
    formData.append('learning_speed', learningSpeed);
    const res = await api.post('/api/v1/ai/study-planner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async summarizeNote(params: { note_id?: string; raw_text?: string }): Promise<any> {
    const formData = new FormData();
    if (params.note_id) formData.append('note_id', params.note_id);
    if (params.raw_text) formData.append('raw_text', params.raw_text);

    const res = await api.post('/api/v1/ai/summarize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async generateFlashcards(params: { note_id?: string; raw_text?: string }): Promise<any> {
    const formData = new FormData();
    if (params.note_id) formData.append('note_id', params.note_id);
    if (params.raw_text) formData.append('raw_text', params.raw_text);

    const res = await api.post('/api/v1/ai/flashcards', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async generateQuiz(params: { note_id?: string; difficulty?: 'easy' | 'medium' | 'hard' }): Promise<any> {
    const formData = new FormData();
    if (params.note_id) formData.append('note_id', params.note_id);
    formData.append('difficulty', params.difficulty || 'medium');

    const res = await api.post('/api/v1/ai/quiz', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getSmartNotifications(): Promise<any> {
    const res = await api.get('/api/v1/ai/smart-notifications');
    return res.data;
  },

  async runOCR(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/api/v1/ai/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async semanticSearch(query: string): Promise<any> {
    const res = await api.get('/api/v1/ai/search', { params: { query } });
    return res.data;
  },
};

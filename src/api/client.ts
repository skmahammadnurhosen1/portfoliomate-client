import { Project, PersonalInfoType, CVData, SocialLinkItem } from '../types';

export interface ApiMessage {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  lastLoginAt?: string;
}

// Live production backend URL on Render
const DEFAULT_BACKEND_URL = 'https://portfoliomate-server-2.onrender.com';

// If VITE_API_URL is configured (e.g. on Netlify: https://portfoliomate-server-2.onrender.com/api), use it. Otherwise use default
const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : `${DEFAULT_BACKEND_URL}/api`)).replace(/\/$/, '');

// Helper to resolve static media (e.g. uploaded images or PDFs) across different domains
export function getAssetUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const backendBase = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || DEFAULT_BACKEND_URL).replace(/\/$/, '');
  return `${backendBase}${path.startsWith('/') ? path : '/' + path}`;
}

// Reusable fetch wrapper with credentials included (cookies) and JSON parsing
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('noor_admin_token');
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization Bearer header if token exists in localStorage (dual support: cookie + header)
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is not FormData, add Content-Type: application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Send httpOnly cookies
    headers,
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as any;
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

// Authentication API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiFetch<{ success: boolean; token: string; admin: AdminUser }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    if (res.token) {
      localStorage.setItem('noor_admin_token', res.token);
    }
    return res;
  },

  logout: async () => {
    localStorage.removeItem('noor_admin_token');
    return apiFetch<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async () => {
    return apiFetch<{ success: boolean; admin: AdminUser }>('/auth/me', {
      method: 'GET',
    });
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    return apiFetch<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// Projects API
export const projectsApi = {
  getPublic: async () => {
    const res = await apiFetch<{ success: boolean; count: number; data: Project[] }>('/projects');
    return res.data;
  },

  getById: async (id: string) => {
    const res = await apiFetch<{ success: boolean; data: Project }>(`/projects/${id}`);
    return res.data;
  },

  getAdminAll: async () => {
    const res = await apiFetch<{ success: boolean; count: number; data: Project[] }>('/projects/admin/all');
    return res.data;
  },

  create: async (project: Omit<Project, 'id'> & { id?: string }) => {
    const res = await apiFetch<{ success: boolean; data: Project }>('/projects/admin', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    return res.data;
  },

  update: async (id: string, updates: Partial<Project>) => {
    const res = await apiFetch<{ success: boolean; data: Project }>(`/projects/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  delete: async (id: string) => {
    return apiFetch<{ success: boolean; message: string; data: { id: string } }>(
      `/projects/admin/${id}`,
      { method: 'DELETE' }
    );
  },

  toggleHide: async (id: string) => {
    const res = await apiFetch<{ success: boolean; data: Project }>(
      `/projects/admin/${id}/toggle-hide`,
      { method: 'PATCH' }
    );
    return res.data;
  },
};

// Profile & Socials API
export const profileApi = {
  get: async () => {
    const res = await apiFetch<{ success: boolean; data: PersonalInfoType }>('/profile');
    return res.data;
  },

  update: async (updates: Partial<PersonalInfoType>) => {
    const res = await apiFetch<{ success: boolean; data: PersonalInfoType }>('/profile/admin', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },
};

// CV API
export const cvApi = {
  get: async () => {
    const res = await apiFetch<{ success: boolean; data: CVData }>('/cv');
    return res.data;
  },

  update: async (updates: Partial<CVData>) => {
    const res = await apiFetch<{ success: boolean; data: CVData }>('/cv/admin', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  uploadPdf: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await apiFetch<{ success: boolean; data: CVData }>('/cv/admin/upload-pdf', {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },

  removePdf: async () => {
    const res = await apiFetch<{ success: boolean; data: CVData }>('/cv/admin/pdf', {
      method: 'DELETE',
    });
    return res.data;
  },
};

// Contact & Inquiries API
export const contactApi = {
  submit: async (data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    message: string;
  }) => {
    return apiFetch<{ success: boolean; message: string; data: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAdminAll: async () => {
    return apiFetch<{
      success: boolean;
      count: number;
      unreadCount: number;
      data: ApiMessage[];
    }>('/contact/admin/all');
  },

  markRead: async (id: string, isRead: boolean) => {
    return apiFetch<{ success: boolean; data: ApiMessage }>(`/contact/admin/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    });
  },

  delete: async (id: string) => {
    return apiFetch<{ success: boolean; message: string }>(`/contact/admin/${id}`, {
      method: 'DELETE',
    });
  },
};

// File / Image Upload API
export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch<{
      success: boolean;
      url: string;
      filename: string;
      size: number;
    }>('/upload/admin/image', {
      method: 'POST',
      body: formData,
    });
  },
};

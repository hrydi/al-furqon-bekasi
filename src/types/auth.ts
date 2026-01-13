export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    username?: string;
    role: 'super_admin' | 'admin' | 'editor' | 'user';
  };
}

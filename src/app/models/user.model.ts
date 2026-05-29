export type Role = 'PATIENT' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt?: Date;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
}
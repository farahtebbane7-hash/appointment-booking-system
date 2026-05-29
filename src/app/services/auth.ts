import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest, Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(res => this.saveSession(res))
    );
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('name', res.name);
    localStorage.setItem('email', res.email);
    localStorage.setItem('role', res.role);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): Role | null { return localStorage.getItem('role') as Role | null; }
  getName(): string | null { return localStorage.getItem('name'); }
  getEmail(): string | null { return localStorage.getItem('email'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isPatient(): boolean { return this.getRole() === 'PATIENT'; }
  isProvider(): boolean { return this.getRole() === 'PROVIDER'; }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
}
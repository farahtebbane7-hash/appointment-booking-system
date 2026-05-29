import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentRequest, Provider } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/users/providers`);
  }

  createAppointment(request: CreateAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, request);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/my`);
  }

  cancelAppointment(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/appointments/${id}/cancel`, {});
  }

  confirmAppointment(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/appointments/${id}/confirm`, {});
  }

  completeAppointment(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/appointments/${id}/complete`, {});
  }
}
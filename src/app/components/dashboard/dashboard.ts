import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';
import { AppointmentService } from '../../services/appointment';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatCardModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  appointments: Appointment[] = [];
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userName = this.authService.getName() || 'User';
    this.userRole = this.authService.getRole() || 'PATIENT';
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.error = '';
    
    this.appointmentService.getMyAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading appointments:', err);
        this.error = 'Failed to load appointments';
        this.appointments = [];
        this.loading = false;
      }
    });
  }

  // Provider: Confirm appointment
  confirmAppointment(id: number) {
    if (confirm('Are you sure you want to confirm this appointment?')) {
      this.appointmentService.confirmAppointment(id).subscribe({
        next: () => {
          this.snackBar.open('Appointment confirmed!', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        error: (err: any) => {
          console.error('Error confirming appointment:', err);
          this.snackBar.open('Failed to confirm appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Provider: Complete appointment
  completeAppointment(id: number) {
    if (confirm('Mark this appointment as completed?')) {
      this.appointmentService.completeAppointment(id).subscribe({
        next: () => {
          this.snackBar.open('Appointment completed!', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        error: (err: any) => {
          console.error('Error completing appointment:', err);
          this.snackBar.open('Failed to complete appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Patient: Cancel appointment
  cancelAppointment(id: number) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          this.snackBar.open('Appointment cancelled!', 'Close', { duration: 3000 });
          this.loadAppointments();
        },
        error: (err: any) => {
          console.error('Error cancelling appointment:', err);
          this.snackBar.open('Failed to cancel appointment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getTotalCount(): number {
    return this.appointments.length;
  }

  getPendingCount(): number {
    return this.appointments.filter(a => a.status === 'PENDING').length;
  }

  getConfirmedCount(): number {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length;
  }

  getCompletedCount(): number {
    return this.appointments.filter(a => a.status === 'COMPLETED').length;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
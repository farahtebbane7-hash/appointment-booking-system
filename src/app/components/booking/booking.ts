import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentService } from '../../services/appointment';
import { Provider } from '../../models/appointment.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatIconModule, MatToolbarModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  form: FormGroup;
  providers: Provider[] = [];
  loading = false;
  loadingProviders = true;
  error = '';
 
  preselectedProviderId: number | null = null;
  preselectedProviderName: string | null = null;
 
  timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
 
  minDate = new Date();
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      providerId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['providerId']) {
        this.preselectedProviderId = +params['providerId'];
        this.preselectedProviderName = params['providerName'] ?? null;
      }
    });
 
    this.appointmentService.getProviders().subscribe({
      next: data => {
        this.providers = data;
        this.loadingProviders = false;
        if (this.preselectedProviderId) {
          this.form.patchValue({ providerId: this.preselectedProviderId });
        }
      },
      error: () => {
        this.error = 'Failed to load providers.';
        this.loadingProviders = false;
      }
    });
  }
 
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { providerId, date, time, reason } = this.form.value;

    // Format date as YYYY-MM-DD
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Format time as HH:MM:SS
    let formattedTime = time;
    if (time && !time.includes(':')) {
      formattedTime = `${time}:00:00`;
    } else if (time && time.split(':').length === 2) {
      formattedTime = `${time}:00`;
    }

    this.appointmentService.createAppointment({
      providerId: +providerId,
      date: formattedDate,
      time: formattedTime,
      notes: reason
    }).subscribe({
      next: () => {
        this.snackBar.open('Appointment booked successfully!', 'Close', { 
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('Booking error:', err);
        this.error = err.error?.message || 'Booking failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
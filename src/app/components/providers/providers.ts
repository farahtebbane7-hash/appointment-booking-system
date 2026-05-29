import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  // ✅ Add this
import { AppointmentService } from '../../services/appointment';
import { AuthService } from '../../services/auth';
import { Provider } from '../../models/appointment.model';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,
    MatProgressSpinnerModule  // ✅ Add this here
  ],
  templateUrl: './providers.html',
  styleUrls: ['./providers.css']
})
export class ProvidersComponent implements OnInit {
  providers: Provider[] = [];
  filteredProviders: Provider[] = [];
  searchTerm: string = '';
  loading = true;
  error = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProviders();
  }

  loadProviders() {
    this.loading = true;
    this.error = '';
    
    this.appointmentService.getProviders().subscribe({
      next: (data) => {
        console.log('Providers loaded:', data);
        this.providers = data;
        this.filteredProviders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
        this.error = 'Failed to load providers. Please try again.';
        this.loading = false;
      }
    });
  }

  filterProviders() {
    if (!this.searchTerm.trim()) {
      this.filteredProviders = this.providers;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredProviders = this.providers.filter(provider => 
        provider.name.toLowerCase().includes(term) ||
        provider.email.toLowerCase().includes(term)
      );
    }
  }

  isPatient(): boolean {
    return this.authService.getRole() === 'PATIENT';
  }
}
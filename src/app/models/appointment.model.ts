export interface Appointment {
  id?: number;
  patientId: number;
  providerId: number;
  patientName?: string;
  providerName?: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;        // ← Add this field
  reason?: string;       // ← Add this as alternative
  createdAt?: Date;
}

export interface CreateAppointmentRequest {
  providerId: number;
  date: string;
  time: string;
  notes: string;         // ← Make sure this exists
}

export interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty?: string;
}
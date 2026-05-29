package com.farah.appointment.controller;

import com.farah.appointment.dto.AppointmentRequest;
import com.farah.appointment.model.Appointment;
import com.farah.appointment.model.User;
import com.farah.appointment.repository.UserRepository;
import com.farah.appointment.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(appointmentService.getAppointmentsForUser(user));
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication) {
        User patient = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(appointmentService.createAppointment(request, patient));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        appointmentService.cancelAppointment(id, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmAppointment(@PathVariable Long id, Authentication authentication) {
        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        appointmentService.confirmAppointment(id, provider);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> completeAppointment(@PathVariable Long id, Authentication authentication) {
        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        appointmentService.completeAppointment(id, provider);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/timeslots/{providerId}")
    public ResponseEntity<List<String>> getAvailableTimeSlots(
            @PathVariable Long providerId,
            @RequestParam String date) {
        return ResponseEntity.ok(appointmentService.getAvailableTimeSlots(providerId, date));
    }
}
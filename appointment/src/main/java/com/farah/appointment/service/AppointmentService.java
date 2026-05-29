package com.farah.appointment.service;

import com.farah.appointment.dto.AppointmentRequest;
import com.farah.appointment.model.Appointment;
import com.farah.appointment.model.User;
import com.farah.appointment.repository.AppointmentRepository;
import com.farah.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Appointment createAppointment(AppointmentRequest request, User patient) {
        User provider = userRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (provider.getRole() != User.Role.PROVIDER) {
            throw new RuntimeException("Selected user is not a provider");
        }

        // Check if time slot is available
        if (appointmentRepository.existsByProviderAndDateAndTimeAndStatusNot(
                provider, request.getDate(), request.getTime(), Appointment.Status.CANCELLED)) {
            throw new RuntimeException("Time slot is already booked");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .provider(provider)
                .date(request.getDate())
                .time(request.getTime())
                .notes(request.getNotes())
                .status(Appointment.Status.PENDING)
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsForUser(User user) {
        if (user.getRole() == User.Role.PATIENT) {
            return appointmentRepository.findByPatientOrderByDateDescTimeDesc(user);
        } else if (user.getRole() == User.Role.PROVIDER) {
            return appointmentRepository.findByProviderOrderByDateDescTimeDesc(user);
        } else {
            // ADMIN sees all appointments
            return appointmentRepository.findAllByOrderByDateDescTimeDesc();
        }
    }

    @Transactional
    public void cancelAppointment(Long id, User user) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        boolean isAuthorized = user.getRole() == User.Role.ADMIN ||
                appointment.getPatient().getId().equals(user.getId()) ||
                appointment.getProvider().getId().equals(user.getId());

        if (!isAuthorized) {
            throw new RuntimeException("You are not authorized to cancel this appointment");
        }

        if (appointment.getStatus() == Appointment.Status.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed appointment");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void confirmAppointment(Long id, User provider) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("Only the assigned provider can confirm this appointment");
        }

        if (appointment.getStatus() != Appointment.Status.PENDING) {
            throw new RuntimeException("Only pending appointments can be confirmed");
        }

        appointment.setStatus(Appointment.Status.CONFIRMED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void completeAppointment(Long id, User provider) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("Only the assigned provider can complete this appointment");
        }

        if (appointment.getStatus() != Appointment.Status.CONFIRMED) {
            throw new RuntimeException("Only confirmed appointments can be marked as completed");
        }

        appointment.setStatus(Appointment.Status.COMPLETED);
        appointmentRepository.save(appointment);
    }

    public List<String> getAvailableTimeSlots(Long providerId, String dateStr) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        LocalDate date = LocalDate.parse(dateStr);

        // Define working hours (9 AM to 5 PM)
        List<LocalTime> allSlots = List.of(
                LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
                LocalTime.of(12, 0), LocalTime.of(13, 0), LocalTime.of(14, 0),
                LocalTime.of(15, 0), LocalTime.of(16, 0), LocalTime.of(17, 0)
        );

        // Get booked slots for this provider on this date
        List<Appointment> bookedAppointments = appointmentRepository.findByProviderAndDate(provider, date);

        List<LocalTime> bookedTimes = bookedAppointments.stream()
                .filter(a -> a.getStatus() != Appointment.Status.CANCELLED)
                .map(Appointment::getTime)
                .collect(Collectors.toList());

        // Return available slots
        return allSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .map(LocalTime::toString)
                .collect(Collectors.toList());
    }
}
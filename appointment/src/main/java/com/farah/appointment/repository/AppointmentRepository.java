package com.farah.appointment.repository;

import com.farah.appointment.model.Appointment;
import com.farah.appointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientOrderByDateDescTimeDesc(User patient);

    List<Appointment> findByProviderOrderByDateDescTimeDesc(User provider);

    List<Appointment> findAllByOrderByDateDescTimeDesc();

    List<Appointment> findByProviderAndDate(User provider, LocalDate date);

    boolean existsByProviderAndDateAndTimeAndStatusNot(
            User provider,
            LocalDate date,
            LocalTime time,
            Appointment.Status status
    );
}
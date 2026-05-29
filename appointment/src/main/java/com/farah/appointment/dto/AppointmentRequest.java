package com.farah.appointment.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long providerId;
    private LocalDate date;
    private LocalTime time;
    private String notes;
}
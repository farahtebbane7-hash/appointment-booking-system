package com.farah.appointment.dto;

import com.farah.appointment.model.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private User.Role role;
}
package com.trustfix.dto.user;

import com.trustfix.entity.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phone;

    @JsonProperty("role")
    private UserRole role;
    private boolean active = true;

    public UserRequest() {
    }

    public UserRequest(String name, String email, String password, String phone, UserRole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(Object r) {
        if (r instanceof UserRole) {
            this.role = (UserRole) r;
        } else if (r != null) {
            try {
                this.role = UserRole.valueOf(r.toString().trim().toUpperCase());
            } catch (Exception e) {
                // Ignore
            }
        }
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

package com.trustfix.dto;

public class AuthResponse {

    private String message;
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String message, Long userId, String name, String email, String role) {
        this.message = message;
        this.token = message;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token != null ? token : message;
    }

    public void setToken(String token) {
        this.token = token;
        this.message = token;
    }

    public String getMessage() {
        return message != null ? message : token;
    }

    public void setMessage(String message) {
        this.message = message;
        this.token = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
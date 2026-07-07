package com.personalbrand.controller;

import com.personalbrand.dto.request.LoginRequest;
import com.personalbrand.dto.request.RegisterRequest;
import com.personalbrand.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponse(responseCode = "200", description = "User registered successfully")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    @ApiResponse(responseCode = "200", description = "User logged in successfully")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify user email")
    @ApiResponse(responseCode = "200", description = "Email verified successfully")
    public ResponseEntity<?> verifyEmail(@RequestParam String email) {
        authService.verifyEmail(email);
        return ResponseEntity.ok("Email verified");
    }
}

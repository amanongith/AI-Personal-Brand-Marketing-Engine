package com.personalbrand.controller;

import com.personalbrand.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management endpoints"
)
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    @ApiResponse(responseCode = "200", description = "User profile retrieved successfully")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserByEmail(authentication.getName()));
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update user profile")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    public ResponseEntity<?> updateUser(@PathVariable Long userId,
                                        @RequestBody com.personalbrand.dto.request.UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request.getFirstName(), request.getLastName(), request.getProfileImage()));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete user account")
    @ApiResponse(responseCode = "200", description = "User deleted successfully")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted");
    }
}

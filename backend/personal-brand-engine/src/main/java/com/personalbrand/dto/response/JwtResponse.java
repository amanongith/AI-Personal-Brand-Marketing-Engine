package com.personalbrand.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private String type;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}

package com.smartrent.controller;

import com.smartrent.dto.UserDTO;
import com.smartrent.entity.Property;
import com.smartrent.entity.User;
import com.smartrent.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        User user = userService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(new UserDTO(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO dto) {
        User user = userService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(userService.updateProfile(user.getId(), dto));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Property>> getFavorites() {
        User user = userService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(userService.getFavoriteProperties(user.getId()));
    }

    @PostMapping("/favorites/{propertyId}")
    public ResponseEntity<Map<String, String>> toggleFavorite(@PathVariable Long propertyId) {
        User user = userService.getCurrentAuthenticatedUser();
        userService.toggleFavorite(user.getId(), propertyId);
        return ResponseEntity.ok(Map.of("message", "Favorite updated successfully"));
    }
}

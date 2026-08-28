package com.trustfix.service;

import com.trustfix.entity.User;
import com.trustfix.entity.UserRole;
import com.trustfix.exception.ResourceAlreadyExistsException;
import com.trustfix.exception.ResourceNotFoundException;
import com.trustfix.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @InjectMocks
    private UserService userService;

    private User rawUser;

    @BeforeEach
    void setUp() {
        rawUser = new User("John Doe", "john@example.com", "secret123", "1234567890", UserRole.CUSTOMER);
        rawUser.setId(1L);
    }

    @Test
    void createUser_HashesPassword_NotEqualToPlainText() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.existsByPhone("1234567890")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User createdUser = userService.createUser(rawUser);

        assertNotNull(createdUser);
        assertNotEquals("secret123", createdUser.getPassword());
        assertTrue(passwordEncoder.matches("secret123", createdUser.getPassword()));
    }

    @Test
    void createUser_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> userService.createUser(rawUser));
    }

    @Test
    void createUser_PhoneAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.existsByPhone("1234567890")).thenReturn(true);

        assertThrows(ResourceAlreadyExistsException.class, () -> userService.createUser(rawUser));
    }

    @Test
    void getUserById_Success_ReturnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(rawUser));

        User user = userService.getUserById(1L);

        assertNotNull(user);
        assertEquals("John Doe", user.getName());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    void updateUser_PasswordUpdated_HashesNewPassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(rawUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updateDetails = new User();
        updateDetails.setPassword("newSecret456");

        User updatedUser = userService.updateUser(1L, updateDetails);

        assertNotEquals("newSecret456", updatedUser.getPassword());
        assertTrue(passwordEncoder.matches("newSecret456", updatedUser.getPassword()));
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(rawUser));

        userService.deleteUser(1L);

        verify(userRepository).delete(rawUser);
    }
}
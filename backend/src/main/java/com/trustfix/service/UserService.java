package com.trustfix.service;

import com.trustfix.entity.User;
import com.trustfix.entity.UserRole;
import com.trustfix.exception.ResourceAlreadyExistsException;
import com.trustfix.exception.ResourceNotFoundException;
import com.trustfix.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email '" + user.getEmail() + "' already exists");
        }
        if (user.getPhone() != null && !user.getPhone().isBlank() && userRepository.existsByPhone(user.getPhone())) {
            throw new ResourceAlreadyExistsException("User with phone number '" + user.getPhone() + "' already exists");
        }
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean isEmailUnique(String email) {
        return !userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean isPhoneUnique(String phone) {
        if (phone == null || phone.isBlank()) {
            return true;
        }
        return !userRepository.existsByPhone(phone);
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public User updateUser(Long id, User updatedDetails) {
        User existingUser = getUserById(id);

        if (updatedDetails.getName() != null && !updatedDetails.getName().isBlank()) {
            existingUser.setName(updatedDetails.getName());
        }
        if (updatedDetails.getPhone() != null && !updatedDetails.getPhone().equals(existingUser.getPhone())) {
            if (userRepository.existsByPhone(updatedDetails.getPhone())) {
                throw new ResourceAlreadyExistsException("Phone number '" + updatedDetails.getPhone() + "' is already registered to another user");
            }
            existingUser.setPhone(updatedDetails.getPhone());
        }
        existingUser.setActive(updatedDetails.isActive());

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}

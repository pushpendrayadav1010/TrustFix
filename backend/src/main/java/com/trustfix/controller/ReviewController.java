package com.trustfix.controller;

import com.trustfix.entity.Review;
import com.trustfix.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<Review> createReviewForBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comment,
            @RequestBody(required = false) Review reviewBody) {
        Integer finalRating = rating != null ? rating : (reviewBody != null ? reviewBody.getRating() : null);
        String finalComment = comment != null ? comment : (reviewBody != null ? reviewBody.getComment() : null);
        Review review = reviewService.createReview(bookingId, finalRating, finalComment);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestParam(required = false) Long bookingId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comment,
            @RequestBody(required = false) Review reviewBody) {
        Long finalBookingId = bookingId != null ? bookingId : (reviewBody != null && reviewBody.getBooking() != null ? reviewBody.getBooking().getId() : null);
        Integer finalRating = rating != null ? rating : (reviewBody != null ? reviewBody.getRating() : null);
        String finalComment = comment != null ? comment : (reviewBody != null ? reviewBody.getComment() : null);
        Review review = reviewService.createReview(finalBookingId, finalRating, finalComment);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Review> getReviewByBookingId(@PathVariable Long bookingId) {
        Review review = reviewService.getReviewByBookingId(bookingId);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getReviewsByProviderId(@PathVariable Long providerId) {
        List<Review> reviews = reviewService.getReviewsByProviderId(providerId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getReviewsByCustomerId(@PathVariable Long customerId) {
        List<Review> reviews = reviewService.getReviewsByCustomerId(customerId);
        return ResponseEntity.ok(reviews);
    }
}

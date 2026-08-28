package com.trustfix.controller;

import com.trustfix.dto.mapper.ReviewMapper;
import com.trustfix.dto.review.ReviewRequest;
import com.trustfix.dto.review.ReviewResponse;
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
    private final ReviewMapper reviewMapper;

    public ReviewController(ReviewService reviewService, ReviewMapper reviewMapper) {
        this.reviewService = reviewService;
        this.reviewMapper = reviewMapper;
    }

    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> createReviewForBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comment,
            @RequestBody(required = false) ReviewRequest reviewBody) {
        Integer finalRating = rating != null ? rating : (reviewBody != null ? reviewBody.getRating() : null);
        String finalComment = comment != null ? comment : (reviewBody != null ? reviewBody.getComment() : null);
        Review review = reviewService.createReview(bookingId, finalRating, finalComment);
        return new ResponseEntity<>(reviewMapper.toResponse(review), HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestParam(required = false) Long bookingId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String comment,
            @RequestBody(required = false) ReviewRequest reviewBody) {
        Long finalBookingId = bookingId != null ? bookingId : (reviewBody != null ? reviewBody.getBookingId() : null);
        Integer finalRating = rating != null ? rating : (reviewBody != null ? reviewBody.getRating() : null);
        String finalComment = comment != null ? comment : (reviewBody != null ? reviewBody.getComment() : null);
        Review review = reviewService.createReview(finalBookingId, finalRating, finalComment);
        return new ResponseEntity<>(reviewMapper.toResponse(review), HttpStatus.CREATED);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> getReviewByBookingId(@PathVariable Long bookingId) {
        Review review = reviewService.getReviewByBookingId(bookingId);
        return ResponseEntity.ok(reviewMapper.toResponse(review));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProviderId(@PathVariable Long providerId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProviderId(providerId)
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByCustomerId(@PathVariable Long customerId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByCustomerId(customerId)
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
        return ResponseEntity.ok(reviews);
    }
}

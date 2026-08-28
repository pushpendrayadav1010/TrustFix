package com.trustfix.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HaversineDistanceUtilTest {

    @Test
    void calculateDistanceKm_SameLocation_ReturnsZero() {
        double distance = HaversineDistanceUtil.calculateDistanceKm(19.0760, 72.8777, 19.0760, 72.8777);
        assertEquals(0.0, distance, 0.001);
    }

    @Test
    void calculateDistanceKm_MumbaiToThane_ReturnsAccurateDistance() {
        // Mumbai (19.0760, 72.8777) to Thane (19.2183, 72.9781) is approx 18-22 km
        double distance = HaversineDistanceUtil.calculateDistanceKm(19.0760, 72.8777, 19.2183, 72.9781);
        assertTrue(distance > 15.0 && distance < 25.0, "Expected distance between 15 and 25 km, got " + distance);
    }

    @Test
    void calculateDistanceKm_NullCoordinates_ReturnsMaxValue() {
        double distance = HaversineDistanceUtil.calculateDistanceKm(null, 72.8777, 19.0760, 72.8777);
        assertEquals(Double.MAX_VALUE, distance);
    }
}

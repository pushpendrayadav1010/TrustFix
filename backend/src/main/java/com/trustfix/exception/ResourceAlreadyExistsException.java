package com.trustfix.exception;

public class ResourceAlreadyExistsException extends RuntimeException {

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}

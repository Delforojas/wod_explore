package com.wodexplorer.exception;

import java.util.Locale;

import org.hibernate.exception.ConstraintViolationException;

public final class EmailConstraintViolationDetector {

    private EmailConstraintViolationDetector() {
    }

    public static boolean isEmailUniqueViolation(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof ConstraintViolationException constraintViolation
                    && "email".equalsIgnoreCase(constraintViolation.getConstraintName())) {
                return true;
            }

            String message = current.getMessage();
            if (message != null) {
                String normalizedMessage = message.toLowerCase(Locale.ROOT);
                if (normalizedMessage.contains("duplicate")
                        && normalizedMessage.contains("email")) {
                    return true;
                }
            }

            current = current.getCause();
        }
        return false;
    }
}

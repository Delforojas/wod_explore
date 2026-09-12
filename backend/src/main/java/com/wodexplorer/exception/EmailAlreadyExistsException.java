package com.wodexplorer.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException() {
        super("El email ya está registrado");
    }
}

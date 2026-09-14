package com.wodexplorer.exception;

public class AuthenticatedUserNotFoundException extends RuntimeException {

    public AuthenticatedUserNotFoundException() {
        super("El usuario autenticado no existe");
    }
}

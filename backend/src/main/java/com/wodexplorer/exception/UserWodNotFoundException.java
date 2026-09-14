package com.wodexplorer.exception;

public class UserWodNotFoundException extends RuntimeException {

    public UserWodNotFoundException() {
        super("WOD personalizado no disponible");
    }
}

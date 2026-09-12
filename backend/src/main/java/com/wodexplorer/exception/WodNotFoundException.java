package com.wodexplorer.exception;

public class WodNotFoundException extends RuntimeException {

    public WodNotFoundException(Integer id) {
        super("WOD no encontrado con id: " + id);
    }
}

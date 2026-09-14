package com.wodexplorer.exception;

public class UserWodDeletionBlockedException extends RuntimeException {

    public UserWodDeletionBlockedException() {
        super("El WOD personalizado tiene resultados históricos y no se puede eliminar");
    }
}

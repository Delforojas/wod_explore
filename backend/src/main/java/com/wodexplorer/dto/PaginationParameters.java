package com.wodexplorer.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class PaginationParameters {

    private int page = 0;
    private int size = 20;

    @Min(value = 0, message = "La página debe ser mayor o igual que 0")
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    @Min(value = 1, message = "El tamaño debe ser como mínimo 1")
    @Max(value = 100, message = "El tamaño no puede superar 100")
    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}

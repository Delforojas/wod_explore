package com.wodexplorer.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class WodFavoriteId implements Serializable {

    private Integer userId;
    private Integer wodId;

    public WodFavoriteId() {
    }

    public WodFavoriteId(Integer userId, Integer wodId) {
        this.userId = userId;
        this.wodId = wodId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getWodId() {
        return wodId;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (!(object instanceof WodFavoriteId other)) {
            return false;
        }
        return Objects.equals(userId, other.userId)
                && Objects.equals(wodId, other.wodId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, wodId);
    }
}

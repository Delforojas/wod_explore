package com.wodexplorer.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "wod_favorites", indexes = {
        @Index(name = "wod_favorites_wod_idx", columnList = "wod_id"),
        @Index(name = "wod_favorites_user_created_wod_idx", columnList = "user_id, created_at, wod_id")
})
public class WodFavorite {

    @EmbeddedId
    private WodFavoriteId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("wodId")
    @JoinColumn(name = "wod_id", nullable = false)
    private Wod wod;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    @Generated(event = EventType.INSERT)
    private LocalDateTime createdAt;

    public WodFavorite() {
    }

    public WodFavorite(WodFavoriteId id, User user, Wod wod) {
        this.id = id;
        this.user = user;
        this.wod = wod;
    }

    public WodFavoriteId getId() {
        return id;
    }

    public void setId(WodFavoriteId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Wod getWod() {
        return wod;
    }

    public void setWod(Wod wod) {
        this.wod = wod;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

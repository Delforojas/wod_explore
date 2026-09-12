package com.wodexplorer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wodexplorer.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}

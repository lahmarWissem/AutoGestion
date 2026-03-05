-- Auto-run by MySQL on first container start
-- This seeds the users_db with roles and a default admin user

CREATE DATABASE IF NOT EXISTS users_db;
CREATE DATABASE IF NOT EXISTS Voiture_Angular_spring_DB;

USE users_db;

-- Tables will be created by Spring JPA (ddl-auto=update)
-- This script will be ignored if tables don't exist yet.
-- We use a stored procedure approach to INSERT safely after tables exist.
-- Spring Boot runs first and creates tables, then we rely on restart to seed.

-- Actually, MySQL init scripts run BEFORE the app, so we create tables here too.
CREATE TABLE IF NOT EXISTS role (
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS user (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    enabled TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_role (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id)
);

-- Seed roles
INSERT IGNORE INTO role (role) VALUES ('ADMIN'), ('USER');

-- Seed admin user (password: password123 - BCrypt encoded)
INSERT IGNORE INTO user (username, password, enabled)
VALUES ('admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 1);

-- Assign ADMIN and USER roles to admin
INSERT IGNORE INTO user_role (user_id, role_id)
SELECT u.user_id, r.role_id FROM user u, role r
WHERE u.username = 'admin' AND r.role IN ('ADMIN', 'USER');

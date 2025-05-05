CREATE DATABASE IF NOT EXISTS transport_system;
USE transport_system;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(255)
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_number VARCHAR(20) NOT NULL UNIQUE,
    start_station_id INT NOT NULL,
    end_station_id INT NOT NULL,
    FOREIGN KEY (start_station_id) REFERENCES stations(id),
    FOREIGN KEY (end_station_id) REFERENCES stations(id)
);

-- Route_Stations (for stations in a route, with order)
CREATE TABLE IF NOT EXISTS route_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    station_id INT NOT NULL,
    stop_order INT NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (station_id) REFERENCES stations(id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    route_id INT NOT NULL,
    bus_id INT NOT NULL,
    travel_date DATE NOT NULL,
    seat_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Live tracking (optional, for storing bus location updates)
CREATE TABLE IF NOT EXISTS live_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);
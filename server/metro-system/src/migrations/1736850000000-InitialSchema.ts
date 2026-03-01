import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1736850000000 implements MigrationInterface {
    name = 'InitialSchema1736850000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. GEOGRAPHY & TRANSIT
        await queryRunner.query(`CREATE TABLE cities (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, country_code CHAR(2));`);
        
        await queryRunner.query(`CREATE TABLE stations (
            id SERIAL PRIMARY KEY, 
            city_id INT REFERENCES cities(id), 
            name VARCHAR(100) NOT NULL, 
            latitude DECIMAL(10, 8), 
            longitude DECIMAL(11, 8), 
            zone_id INT
        );`);

        await queryRunner.query(`CREATE TABLE lines (id SERIAL PRIMARY KEY, line_name VARCHAR(50) NOT NULL, color_code VARCHAR(7));`);

        await queryRunner.query(`CREATE TABLE line_stations (
            line_id INT REFERENCES lines(id), 
            station_id INT REFERENCES stations(id), 
            stop_order INT NOT NULL, 
            distance_to_next_stop DECIMAL(10, 2) DEFAULT 0.00, 
            PRIMARY KEY (line_id, station_id)
        );`);

        // 2. USER SYSTEM
        await queryRunner.query(`CREATE TABLE users (
            id SERIAL PRIMARY KEY, 
            email VARCHAR(255) UNIQUE NOT NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await queryRunner.query(`CREATE TABLE user_profiles (
            user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, 
            first_name VARCHAR(50), 
            last_name VARCHAR(50), 
            phone_number VARCHAR(20)
        );`);

        await queryRunner.query(`CREATE TABLE user_mfa (
            id SERIAL PRIMARY KEY, 
            user_id INT REFERENCES users(id), 
            otp_code VARCHAR(6), 
            expires_at TIMESTAMP, 
            retry_count INT DEFAULT 0, 
            is_verified BOOLEAN DEFAULT FALSE
        );`);

        // 3. BOOKING & PRICING
        await queryRunner.query(`CREATE TABLE fare_rules (
            id SERIAL PRIMARY KEY, 
            base_fare DECIMAL(10, 2) NOT NULL, 
            price_per_km DECIMAL(10, 2) NOT NULL, 
            peak_multiplier DECIMAL(3, 2) DEFAULT 1.0, 
            effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await queryRunner.query(`CREATE TABLE payments (
            id SERIAL PRIMARY KEY, 
            user_id INT REFERENCES users(id), 
            amount DECIMAL(10, 2) NOT NULL, 
            status VARCHAR(20), 
            transaction_ref VARCHAR(100) UNIQUE, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await queryRunner.query(`CREATE TABLE tickets (
            id SERIAL PRIMARY KEY, 
            user_id INT REFERENCES users(id), 
            payment_id INT REFERENCES payments(id), 
            source_station_id INT REFERENCES stations(id), 
            destination_station_id INT REFERENCES stations(id), 
            fare_paid DECIMAL(10, 2), 
            qr_code_token TEXT UNIQUE, 
            status VARCHAR(20) DEFAULT 'active', 
            expires_at TIMESTAMP, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        // 4. INDEXES
        await queryRunner.query(`CREATE INDEX idx_user_tickets ON tickets(user_id);`);
        await queryRunner.query(`CREATE INDEX idx_user_payments ON payments(user_id);`);
        await queryRunner.query(`CREATE INDEX idx_station_lookup ON stations(name);`);
        await queryRunner.query(`CREATE INDEX idx_line_sequence ON line_stations(line_id, stop_order);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop in reverse order to avoid foreign key constraint errors
        await queryRunner.query(`DROP INDEX idx_line_sequence;`);
        await queryRunner.query(`DROP INDEX idx_station_lookup;`);
        await queryRunner.query(`DROP INDEX idx_user_payments;`);
        await queryRunner.query(`DROP INDEX idx_user_tickets;`);
        await queryRunner.query(`DROP TABLE tickets;`);
        await queryRunner.query(`DROP TABLE payments;`);
        await queryRunner.query(`DROP TABLE fare_rules;`);
        await queryRunner.query(`DROP TABLE user_mfa;`);
        await queryRunner.query(`DROP TABLE user_profiles;`);
        await queryRunner.query(`DROP TABLE users;`);
        await queryRunner.query(`DROP TABLE line_stations;`);
        await queryRunner.query(`DROP TABLE lines;`);
        await queryRunner.query(`DROP TABLE stations;`);
        await queryRunner.query(`DROP TABLE cities;`);
    }
}
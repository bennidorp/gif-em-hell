DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS users;




CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(500) NOT NULL UNIQUE,
    password_hash VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL, 
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 


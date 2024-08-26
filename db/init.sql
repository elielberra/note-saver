\connect note_saver;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content VARCHAR(2500) NOT NULL,
    is_active BOOLEAN NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

 CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(20) NOT NULL,
    note_id INTEGER NOT NULL REFERENCES notes (id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    sid VARCHAR NOT NULL,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL,
    PRIMARY KEY (sid)
);

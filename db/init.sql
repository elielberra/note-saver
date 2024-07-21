\connect note_keeper;

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content VARCHAR(2500) NOT NULL,
    is_active BOOLEAN NOT NULL
);

 CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(20) NOT NULL,
    note_id INTEGER NOT NULL REFERENCES notes (id) ON DELETE CASCADE
);

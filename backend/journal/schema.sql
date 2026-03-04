DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS api_keys;

CREATE TABLE IF NOT EXISTS user
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    hash     TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS entries
(
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    author_username INTEGER   NOT NULL,
    created         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    body            TEXT      NOT NULl,
    last_edited     INTEGER,
    FOREIGN KEY (author_username) references user (username)
);

CREATE TABLE IF NOT EXISTS api_keys
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    keytext  TEXT NOT NULL,
    FOREIGN KEY (username) references user (username)
)
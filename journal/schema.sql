CREATE TABLE IF NOT EXISTS user
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT        NOT NULL
);

CREATE TABLE IF NOT EXISTS entries
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER   NOT NULL,
    created   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    body      TEXT      NOT NULl,
    FOREIGN KEY (author_id) references user (id)
);

CREATE TABLE IF NOT EXISTS api_keys
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username INTEGER NOT NULL,
    keytext  TEXT    NOT NULL,
    FOREIGN KEY (username) references user (username)
)
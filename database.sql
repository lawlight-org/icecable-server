CREATE TABLE
  `accounts` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `username` varchar(64) NOT NULL COMMENT 'sha256',
    `password` varchar(72) NOT NULL COMMENT 'bcrypt',
    PRIMARY KEY (`id`),
    UNIQUE KEY `accounts_unique` (`username`)
  );

CREATE TABLE
  `sessions` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `token` varchar(128) NOT NULL,
    `public_key` varchar(4096) NOT NULL,
    `account_id` int (11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `sessions_unique` (`token`),
    KEY `sessions_accounts_FK` (`account_id`),
    CONSTRAINT `sessions_accounts_FK` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
  );
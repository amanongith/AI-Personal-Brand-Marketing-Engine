-- Users table
CREATE TABLE IF NOT EXISTS `users`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `email`
    VARCHAR
(
    255
) UNIQUE NOT NULL,
    `password` VARCHAR
(
    255
) NOT NULL,
    `first_name` VARCHAR
(
    255
) NOT NULL,
    `last_name` VARCHAR
(
    255
) NOT NULL,
    `role` VARCHAR
(
    50
),
    `profile_image` LONGTEXT,
    `email_verified` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `last_login` TIMESTAMP NULL
    );

-- Profiles table
CREATE TABLE IF NOT EXISTS `profiles`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `user_id`
    BIGINT
    NOT
    NULL,
    `bio`
    LONGTEXT,
    `website`
    VARCHAR
(
    255
),
    `location` VARCHAR
(
    255
),
    `industry` VARCHAR
(
    255
),
    `niche` VARCHAR
(
    255
),
    `personal_brand_statement` LONGTEXT,
    `target_audience` LONGTEXT,
    `core_values` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    `user_id`
) REFERENCES `users`
(
    `id`
)
    ON DELETE CASCADE
    );

-- Calendar events table
CREATE TABLE IF NOT EXISTS `calendar_events`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `user_id`
    BIGINT
    NOT
    NULL,
    `title`
    VARCHAR
(
    255
) NOT NULL,
    `description` LONGTEXT,
    `start_time` TIMESTAMP NOT NULL,
    `end_time` TIMESTAMP NOT NULL,
    `type` VARCHAR
(
    50
),
    `platform` VARCHAR
(
    50
),
    `status` VARCHAR
(
    50
),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    `user_id`
) REFERENCES `users`
(
    `id`
)
    ON DELETE CASCADE
    );

-- Content table
CREATE TABLE IF NOT EXISTS `content`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `user_id`
    BIGINT
    NOT
    NULL,
    `title`
    VARCHAR
(
    255
) NOT NULL,
    `body` LONGTEXT,
    `platform` VARCHAR
(
    50
),
    `status` VARCHAR
(
    50
),
    `content_type` VARCHAR
(
    50
),
    `tags` VARCHAR
(
    255
),
    `scheduled_time` TIMESTAMP NULL,
    `published_time` TIMESTAMP NULL,
    `views` BIGINT DEFAULT 0,
    `likes` BIGINT DEFAULT 0,
    `shares` BIGINT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    `user_id`
) REFERENCES `users`
(
    `id`
)
    ON DELETE CASCADE
    );

-- Analytics table
CREATE TABLE IF NOT EXISTS `analytics`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `user_id`
    BIGINT
    NOT
    NULL,
    `platform`
    VARCHAR
(
    50
),
    `followers` BIGINT,
    `impressions` BIGINT,
    `clicks` BIGINT,
    `engagements` BIGINT,
    `engagement_rate` DOUBLE,
    `metrics_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    `user_id`
) REFERENCES `users`
(
    `id`
)
    ON DELETE CASCADE
    );

-- Engagement table
CREATE TABLE IF NOT EXISTS `engagement`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `user_id`
    BIGINT
    NOT
    NULL,
    `content_id`
    BIGINT
    NOT
    NULL,
    `engagement_type`
    VARCHAR
(
    50
),
    `engagement_count` BIGINT,
    `platform` VARCHAR
(
    50
),
    `engagement_date` TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    `user_id`
) REFERENCES `users`
(
    `id`
)
    ON DELETE CASCADE,
    FOREIGN KEY
(
    `content_id`
) REFERENCES `content`
(
    `id`
)
    ON DELETE CASCADE
    );

-- Suggestions table
CREATE TABLE IF NOT EXISTS `suggestions`
(
    `id`
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    `user_id`
    BIGINT
    NOT
    NULL,
    `title`
    VARCHAR
(
    255
) NOT NULL,
    `content` LONGTEXT,
    `type` VARCHAR
(
    50
),
    `priority` VARCHAR
(
    50
),
    `status` VARCHAR
(
    50
),
    `reason` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
(
    `user_id`
) REFERENCES `users`
(
    `id`
)
    ON DELETE CASCADE
    );

-- Create indexes
CREATE INDEX `idx_user_email` ON `users` (`email`);
CREATE INDEX `idx_profile_user_id` ON `profiles` (`user_id`);
CREATE INDEX `idx_calendar_user_id` ON `calendar_events` (`user_id`);
CREATE INDEX `idx_content_user_id` ON `content` (`user_id`);
CREATE INDEX `idx_content_status` ON `content` (`status`);
CREATE INDEX `idx_analytics_user_id` ON `analytics` (`user_id`);
CREATE INDEX `idx_engagement_user_id` ON `engagement` (`user_id`);
CREATE INDEX `idx_suggestions_user_id` ON `suggestions` (`user_id`);

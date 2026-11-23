-- Email capture for the public footer subscribe form.
-- No marketing automation: rows are storage only until the operator sends mail manually.

CREATE TABLE IF NOT EXISTS subscribers (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  email            TEXT NOT NULL UNIQUE,
  source           TEXT NOT NULL DEFAULT 'footer',
  ip_hash          TEXT,
  user_agent       TEXT,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at DESC);

-- Lightweight abuse signal: recent attempts per hashed IP (no raw IP stored).
CREATE TABLE IF NOT EXISTS subscribe_attempts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash          TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_subscribe_attempts_ip_time
  ON subscribe_attempts(ip_hash, created_at DESC);

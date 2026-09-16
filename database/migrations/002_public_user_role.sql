-- MANISH ELECTRICALS - Add public 'user' role for self-registered accounts.

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
    ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'employee', 'user'));

-- Sequence used to mint unique public User IDs (e.g. USR00001).
INSERT INTO id_sequences (seq_name, last_value)
VALUES ('user_id', 0)
ON CONFLICT (seq_name) DO NOTHING;
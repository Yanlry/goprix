-- ═══════════════════════════════════════════════════════════
--  GOPRIX — Migration Supabase
--  Coller dans Supabase > SQL Editor > New query > Run
-- ═══════════════════════════════════════════════════════════

-- ─── Brands ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  logo          TEXT DEFAULT '',
  product_count INTEGER DEFAULT 0,
  description   TEXT DEFAULT '',
  categories    TEXT[] DEFAULT '{}',
  is_partner    BOOLEAN DEFAULT FALSE,
  discount      INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  description   TEXT DEFAULT '',
  image         TEXT DEFAULT '',
  icon          TEXT DEFAULT '',
  product_count INTEGER DEFAULT 0,
  color         TEXT DEFAULT ''
);

-- ─── Products ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  brand            TEXT NOT NULL DEFAULT '',
  brand_slug       TEXT NOT NULL DEFAULT '',
  category         TEXT NOT NULL DEFAULT '',
  category_slug    TEXT NOT NULL DEFAULT '',
  description      TEXT DEFAULT '',
  features         TEXT[] DEFAULT '{}',
  specifications   JSONB DEFAULT '{}',
  images           TEXT[] DEFAULT '{}',
  price            DECIMAL(10,2) NOT NULL,
  original_price   DECIMAL(10,2) NOT NULL,
  discount         INTEGER DEFAULT 0,
  is_new           BOOLEAN DEFAULT FALSE,
  is_promo         BOOLEAN DEFAULT FALSE,
  is_end_of_series BOOLEAN DEFAULT FALSE,
  is_active        BOOLEAN DEFAULT TRUE,
  reference        TEXT DEFAULT '',
  barcode          TEXT DEFAULT '',
  stock_by_store   JSONB DEFAULT '{}',
  tags             TEXT[] DEFAULT '{}',
  weight           TEXT,
  dimensions       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Stores ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stores (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  address                 TEXT NOT NULL DEFAULT '',
  city                    TEXT NOT NULL DEFAULT '',
  postal_code             TEXT DEFAULT '',
  phone                   TEXT DEFAULT '',
  email                   TEXT DEFAULT '',
  image                   TEXT DEFAULT '',
  coordinates             JSONB DEFAULT '{"lat":0,"lng":0}',
  hours                   JSONB DEFAULT '[]',
  services                TEXT[] DEFAULT '{}',
  has_parking             BOOLEAN DEFAULT FALSE,
  payment_methods         TEXT[] DEFAULT '{}',
  click_and_collect_delay INTEGER DEFAULT 60,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reservations ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number   TEXT NOT NULL UNIQUE,
  status         TEXT NOT NULL DEFAULT 'nouvelle',
  items          JSONB NOT NULL DEFAULT '[]',
  store          JSONB NOT NULL DEFAULT '{}',
  pickup_slot    JSONB NOT NULL DEFAULT '{}',
  total          DECIMAL(10,2) NOT NULL,
  discount       DECIMAL(10,2) DEFAULT 0,
  promo_code     TEXT,
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT,
  customer_name  TEXT,
  messages       JSONB DEFAULT '[]',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Client Messages ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_messages (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text    TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read    BOOLEAN DEFAULT FALSE
);

-- ═══════════════════════════════════════════════════════════
--  RLS (Row Level Security)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE brands           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages  ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tout le monde voit le catalogue)
CREATE POLICY "public_read_brands"      ON brands      FOR SELECT USING (true);
CREATE POLICY "public_read_categories"  ON categories  FOR SELECT USING (true);
CREATE POLICY "public_read_products"    ON products    FOR SELECT USING (true);
CREATE POLICY "public_read_stores"      ON stores      FOR SELECT USING (true);

-- Écriture : utilisateurs connectés (l'admin est protégé côté app)
CREATE POLICY "auth_write_brands"      ON brands      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_categories"  ON categories  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_products"    ON products    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_stores"      ON stores      FOR ALL USING (auth.role() = 'authenticated');

-- Réservations : chaque user voit les siennes ; admin voit tout
CREATE POLICY "reservations_select" ON reservations FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'admin@goprix.fr');

CREATE POLICY "reservations_insert" ON reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reservations_update" ON reservations FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'admin@goprix.fr');

-- Messages client
CREATE POLICY "messages_select" ON client_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "messages_insert" ON client_messages FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@goprix.fr');

CREATE POLICY "messages_update" ON client_messages FOR UPDATE
  USING (auth.uid() = user_id);

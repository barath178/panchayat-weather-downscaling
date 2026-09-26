-- ============================================================================
-- AeroAgro AI - Supabase PostGIS Initial Migration
-- Enables PostGIS extension, spatial tables, and indices
-- ============================================================================

-- 1. Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Gram Panchayats Table (Spatial polygon boundaries and static terrain metadata)
CREATE TABLE IF NOT EXISTS panchayats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panchayat_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    elevation_mean_m DOUBLE PRECISION NOT NULL,
    slope_mean_deg DOUBLE PRECISION DEFAULT 0.0,
    aspect_primary VARCHAR(32) DEFAULT 'Plains',
    drainage_accumulation_index DOUBLE PRECISION DEFAULT 0.0, -- Cold air and water pooling risk (0.0 to 1.0)
    primary_crops TEXT[] DEFAULT ARRAY['Paddy', 'Vegetables'],
    boundary GEOMETRY(MultiPolygon, 4326) NOT NULL,
    centroid GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spatial Indices for ultrafast spatial joins and containment queries
CREATE INDEX IF NOT EXISTS idx_panchayats_boundary ON panchayats USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_panchayats_centroid ON panchayats USING GIST(centroid);

-- 3. Weather Ingestion Log (Coarse Block Predictions from Open-Meteo / GFS)
CREATE TABLE IF NOT EXISTS coarse_block_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_name VARCHAR(64) NOT NULL,
    source_model VARCHAR(32) DEFAULT 'open-meteo-gfs',
    forecast_time TIMESTAMP WITH TIME ZONE NOT NULL,
    temp_max_c DOUBLE PRECISION NOT NULL,
    temp_min_c DOUBLE PRECISION NOT NULL,
    rainfall_mm DOUBLE PRECISION NOT NULL,
    relative_humidity_pct DOUBLE PRECISION NOT NULL,
    wind_speed_kmh DOUBLE PRECISION NOT NULL,
    wind_direction_deg DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coarse_forecast_time ON coarse_block_forecasts(forecast_time);

-- 4. Downscaled Panchayat Forecasts (Inferred high-res predictions)
CREATE TABLE IF NOT EXISTS downscaled_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panchayat_id UUID REFERENCES panchayats(id) ON DELETE CASCADE,
    coarse_forecast_id UUID REFERENCES coarse_block_forecasts(id) ON DELETE SET NULL,
    forecast_date DATE NOT NULL,
    target_hour INT CHECK (target_hour BETWEEN 0 AND 23),
    temp_c DOUBLE PRECISION NOT NULL,
    rainfall_mm DOUBLE PRECISION NOT NULL,
    relative_humidity_pct DOUBLE PRECISION NOT NULL,
    wind_speed_kmh DOUBLE PRECISION NOT NULL,
    wind_gust_kmh DOUBLE PRECISION,
    soil_moisture_index DOUBLE PRECISION,
    frost_hazard_score DOUBLE PRECISION DEFAULT 0.0, -- 0 to 100
    model_version VARCHAR(32) DEFAULT 'xgb-v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(panchayat_id, forecast_date, target_hour)
);

CREATE INDEX IF NOT EXISTS idx_downscaled_panchayat_date ON downscaled_forecasts(panchayat_id, forecast_date);

-- 5. Agro-Meteorological Advisories
CREATE TABLE IF NOT EXISTS agromet_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panchayat_id UUID REFERENCES panchayats(id) ON DELETE CASCADE,
    advisory_date DATE NOT NULL,
    target_crop VARCHAR(64) NOT NULL,
    spray_window_status VARCHAR(32) NOT NULL, -- 'SAFE', 'CAUTION', 'DANGER'
    spray_safe_hours TEXT[] DEFAULT ARRAY[]::TEXT[],
    irrigation_action VARCHAR(64) NOT NULL,
    disease_alert_title VARCHAR(128),
    disease_risk_level VARCHAR(16), -- 'LOW', 'MODERATE', 'HIGH'
    advisory_en TEXT NOT NULL,
    advisory_mr TEXT, -- Marathi (Regional)
    advisory_hi TEXT, -- Hindi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisories_date_panchayat ON agromet_advisories(panchayat_id, advisory_date);

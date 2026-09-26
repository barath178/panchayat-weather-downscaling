"""
=============================================================================
AeroAgro AI - Google Colab Model Training Pipeline
Trains XGBoost (Temperature) and Random Forest (Precipitation) Downscalers
Using Copernicus ERA5-Land + NASA SRTM 30m DEM + Sentinel-2 NDVI
=============================================================================
Run this script or notebook cells in Google Colab (Free CPU/T4 GPU runtime).
"""

# Cell 1: Install dependencies
# !pip install xgboost scikit-learn pandas numpy geopandas rasterio joblib

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import joblib

print("Step 1: Simulating / Ingesting Multi-Source Geospatial Dataset...")
# In production, replace with Google Earth Engine (ee.Image('NASA/NASADEM_HGT/001'))
# and Copernicus ERA5-Land hourly netCDF downloads
np.random.seed(42)
N_SAMPLES = 5000

# Synthetic dataset mimicking Western Ghats microclimates
elevation_m = np.random.uniform(550, 1350, N_SAMPLES)
block_mean_elev = 680.0
delta_z = elevation_m - block_mean_elev
slope_deg = np.random.uniform(1.0, 35.0, N_SAMPLES)
is_windward = np.random.binomial(1, 0.55, N_SAMPLES)
drainage_accumulation = np.random.beta(2, 5, N_SAMPLES)
ndvi = np.random.uniform(0.3, 0.85, N_SAMPLES)

# Coarse block inputs (18km resolution GFS / ERA5)
coarse_tmax = np.random.uniform(25.0, 38.0, N_SAMPLES)
coarse_tmin = np.random.uniform(8.0, 22.0, N_SAMPLES)
coarse_rain = np.random.exponential(15.0, N_SAMPLES)
coarse_wind = np.random.uniform(5.0, 28.0, N_SAMPLES)

# Ground truth physical response functions
# 1. Temperature lapse rate (-6.5°C / km) + canopy cooling + slope aspect
true_tmax = (
    coarse_tmax +
    (delta_z * -0.0065) +
    (-1.2 * (ndvi - 0.5)) +
    (-0.02 * slope_deg) +
    np.random.normal(0, 0.4, N_SAMPLES)
)

# 2. Orographic rainfall multiplier
orographic_factor = np.where(
    is_windward == 1,
    1.0 + np.maximum(0, delta_z / 320.0) * 0.95 + np.sin(np.radians(slope_deg)) * 0.6,
    0.45 # Leeward rainshadow
)
true_rain = coarse_rain * orographic_factor + np.random.normal(0, 1.2, N_SAMPLES)
true_rain = np.maximum(0, true_rain)

# Create Feature DataFrame
df = pd.DataFrame({
    'coarse_tmax': coarse_tmax,
    'coarse_tmin': coarse_tmin,
    'coarse_rain': coarse_rain,
    'coarse_wind': coarse_wind,
    'elevation_m': elevation_m,
    'delta_z': delta_z,
    'slope_deg': slope_deg,
    'is_windward': is_windward,
    'drainage_acc': drainage_accumulation,
    'ndvi': ndvi,
    'target_tmax': true_tmax,
    'target_rain': true_rain
})

print(f"Dataset shape: {df.shape}")

# Features for ML
features_temp = ['coarse_tmax', 'delta_z', 'slope_deg', 'ndvi']
features_rain = ['coarse_rain', 'elevation_m', 'delta_z', 'slope_deg', 'is_windward']

X_t = df[features_temp]
y_t = df['target_tmax']

X_r = df[features_rain]
y_r = df['target_rain']

# Train/Test Split
X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X_t, y_t, test_size=0.2, random_state=42)
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_r, y_r, test_size=0.2, random_state=42)

# Cell 2: Train XGBoost for Temperature Downscaling
print("\nStep 2: Training XGBoost Regressor for Temperature...")
xgb_temp_model = xgb.XGBRegressor(
    n_estimators=150,
    max_depth=5,
    learning_rate=0.08,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
xgb_temp_model.fit(X_train_t, y_train_t)

preds_t = xgb_temp_model.predict(X_test_t)
print(f"Temperature Model R² Score: {r2_score(y_test_t, preds_t):.4f}")
print(f"Temperature Model RMSE:     {np.sqrt(mean_squared_error(y_test_t, preds_t)):.4f}°C")
print(f"Temperature Model MAE:      {mean_absolute_error(y_test_t, preds_t):.4f}°C")

# Cell 3: Train Random Forest for Precipitation Downscaling
print("\nStep 3: Training Random Forest Regressor for Precipitation...")
rf_rain_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=8,
    min_samples_leaf=4,
    random_state=42,
    n_jobs=-1
)
rf_rain_model.fit(X_train_r, y_train_r)

preds_r = rf_rain_model.predict(X_test_r)
print(f"Precipitation Model R² Score: {r2_score(y_test_r, preds_r):.4f}")
print(f"Precipitation Model RMSE:     {np.sqrt(mean_squared_error(y_test_r, preds_r)):.4f} mm")
print(f"Precipitation Model MAE:      {mean_absolute_error(y_test_r, preds_r):.4f} mm")

# Cell 4: Export Models for FastAPI Production Serving
print("\nStep 4: Exporting Models...")
xgb_temp_model.save_model("temp_downscaler_xgb.json")
joblib.dump(rf_rain_model, "rain_downscaler_rf.joblib")
print("✅ Saved models: temp_downscaler_xgb.json & rain_downscaler_rf.joblib")
print("Ready for deployment to FastAPI / Render / Railway!")

import { CloudRain, CloudDrizzle, CloudSun, Sun, Snowflake, Wind, Flame, type LucideIcon } from 'lucide-react';
import type { WeatherMetrics } from './microclimate';

export interface SkyState {
  label: string;
  detail: string;
  icon: LucideIcon;
  /** Two colour stops for the card's sky wash */
  from: string;
  to: string;
}

/** Human description of the day, used by the Today card's headline and sky gradient. */
export function describeSky(d: WeatherMetrics): SkyState {
  if (d.tempMin <= 4)
    return { label: 'Frosty night', detail: `Clear and cold, down to ${d.tempMin}°C before dawn`, icon: Snowflake, from: '#1b3350', to: '#0f1a24' };
  if (d.rainfallMm >= 40)
    return { label: 'Heavy rain', detail: `${d.rainfallMm} mm expected, waterlogging likely`, icon: CloudRain, from: '#1f3346', to: '#111a20' };
  if (d.rainfallMm >= 10)
    return { label: 'Rainy', detail: `${d.rainfallMm} mm expected through the day`, icon: CloudRain, from: '#20343f', to: '#11191c' };
  if (d.rainfallMm >= 2)
    return { label: 'Passing showers', detail: `Light rain, about ${d.rainfallMm} mm`, icon: CloudDrizzle, from: '#233638', to: '#121a19' };
  if (d.tempMax >= 40)
    return { label: 'Scorching heat', detail: `Up to ${d.tempMax}°C, heat stress for crops and people`, icon: Flame, from: '#4a2a17', to: '#1a1310' };
  if (d.windSpeedKmh >= 25)
    return { label: 'Windy', detail: `Gusty at ${d.windSpeedKmh} km/h, spray drift risk`, icon: Wind, from: '#26352c', to: '#121813' };
  if (d.tempMax >= 33)
    return { label: 'Hot and sunny', detail: `Warm afternoon, ${d.tempMax}°C at peak`, icon: Sun, from: '#3d3218', to: '#16150f' };
  return { label: 'Pleasant', detail: `Mild day between ${d.tempMin}° and ${d.tempMax}°C`, icon: CloudSun, from: '#24382a', to: '#121813' };
}

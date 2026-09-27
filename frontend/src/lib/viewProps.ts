import type { PanchayatData } from '@/data/all_india_regions';
import type { HourPoint, PestRisk, WeatherMetrics } from './microclimate';
import type { Lang } from './advisory';

/** Everything the farmer-facing views need, computed once in the page. */
export interface AdvisoryViewProps {
  panchayat: PanchayatData;
  fine: WeatherMetrics;
  coarse: WeatherMetrics;
  hourly: HourPoint[];
  sprayWindow: { label: string; start?: string; end?: string; hours: number };
  irrigation: { action: string; detail: string; deficit: number };
  pest: PestRisk;
  et0: number;
  crop: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  advisoryText: string;
}

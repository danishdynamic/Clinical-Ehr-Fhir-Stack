export interface Observation {
  id: number;
  patient: number;
  code: string;
  value: number;
  unit: string;
  observed_at: string;
}
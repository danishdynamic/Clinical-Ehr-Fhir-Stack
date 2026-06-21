export interface Composition {
  id: number;
  patient: number;
  archetype_id?: string;
  template_id?: string;
  content: Record<string, unknown>;
  created_at?: string;
}
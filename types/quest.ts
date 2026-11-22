export type ObjectKind =
  | "coffee_mug"
  | "desk_lamp"
  | "golden_key"
  | "magic_book"
  | "energy_crystal"
  | "wall_clock"
  | "globe"
  | "plant_pot";

export type CameraMode = "orbit_top" | "room_point_click" | "room_walk";

export interface QuestItemConfig {
  id: string;
  kind: ObjectKind;
  en: string;
  ru: string;
  hint: string;
  position: [number, number, number];
  approachDistance?: number;
}

export interface QuestStep {
  targetId: string;
  taskEn: string;
  taskRu: string;
}

export interface QuestLevel {
  id: number;
  title: string;
  subtitle: string;
  mode: CameraMode;
  modeLabel: string;
  ambientColor: string;
  floorColor: string;
  steps: QuestStep[];
  items: QuestItemConfig[];
}

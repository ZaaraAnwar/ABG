export const DISPLAY_W = 460;
export const DISPLAY_H = 330;
export const PAD_L = 50;
export const PAD_R = 20;
export const PAD_T = 20;
export const PAD_B = 45;

export const CW = DISPLAY_W - PAD_L - PAD_R;
export const CH = DISPLAY_H - PAD_T - PAD_B;

export const P50_NORMAL = 24.7;
export const P50_LEFT = 20.83;
export const P50_RIGHT = 29.5;
export const HILL_N = 2.7;

export const RIGHT_SHIFT_LINES = [
  { arrow: "↑", text: "P50 (Decreased Affinity)" },
  { arrow: "↑", text: "Temperature" },
  { arrow: "↑", text: "PCO₂" },
  { arrow: "↑", text: "2-3 DPG" },
  { arrow: "↓", text: "pH" },
];

export const LEFT_SHIFT_LINES = [
  { arrow: "↓", text: "P50 (Increased Affinity)" },
  { arrow: "↓", text: "Temperature" },
  { arrow: "↓", text: "PCO₂" },
  { arrow: "↓", text: "2-3 DPG" },
  { arrow: "↑", text: "pH" },
  { arrow: "↑", text: "HbF (fetal Hb)" },
  { arrow: "↑", text: "MetHb / CO-Hb" },
];
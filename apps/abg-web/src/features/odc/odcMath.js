import {
  P50_NORMAL,
  P50_LEFT,
  P50_RIGHT,
  HILL_N,
  PAD_L,
  PAD_T,
  CW,
  CH,
} from "./constants";

export const hillSat = (po2, p50 = P50_NORMAL) =>
  po2 <= 0
    ? 0
    : (Math.pow(po2, HILL_N) /
        (Math.pow(p50, HILL_N) + Math.pow(po2, HILL_N))) *
      100;

export const getP50 = (shiftDir) =>
  shiftDir === "left" ? P50_LEFT : shiftDir === "right" ? P50_RIGHT : P50_NORMAL;

// Clinically-accurate lookup table for the normal (unshifted) ODC curve
const NORMAL_SAT_TABLE = [
  [0,    -1     ],
  [2,    -1     ],
  [3,    0      ],
  [4,    0      ],
  [5,    1      ],
  [6,    3      ],
  [7,    5      ],
  [8,    7      ],
  [9,    9      ],
  [10,   10     ],
  [20,   36.1041],
  [21,   39.0   ],
  [22,   41.0677],
  [23,   44.1442],
  [24,   46.1799],
  [25,   48.2156],
  [26,   50.1026],
  [60,   90     ],
  [61,   92     ],
  [65,   93     ],
  [67,   94     ],
  [70,   94     ],
  [71,   95     ],
  [76,   95     ],
  [77,   96     ],
  [88,   97     ],
  [100,  97     ],
  [150,  98.8   ],
  [500,  100    ],
];

export function lookupSatNormal(po2) {
  if (po2 <= 0) return -1;
  const table = NORMAL_SAT_TABLE;
  if (po2 >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [x0, y0] = table[i];
    const [x1, y1] = table[i + 1];
    if (po2 >= x0 && po2 <= x1) {
      const t = (po2 - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return 0;
}

// Use the clinical lookup table for normal shift; Hill equation (offset by -1) for left/right shifts
export function getCorrectedSaturation(po2, shiftDir, p50) {
  if (shiftDir === "none") return lookupSatNormal(po2);
  // Shifted curves use the Hill equation with a -1 offset to match the clinical reference display
  return hillSat(po2, p50) - 1;
}

export const po2ToX = (po2) => PAD_L + (po2 / 100) * CW;

export const satToY = (sat) => PAD_T + (1 - sat / 100) * CH;

export const xToPo2 = (cx) =>
  Math.max(0, Math.min(100, ((cx - PAD_L) / CW) * 100));
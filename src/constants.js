export const TEXTURES_NAMES = [
  "background",
  "final_screen",
  "phone",
  "preload_background",
  "wood",
];

export const DOM_TEXTURE_IDS = {
  background: "Background",
  final_screen: "FinalScreen",
  phone: "Phone",
  preload_background: "PreloadBackground",
  wood: "Wood",
};

export const ATLAS_IMAGE_ID = "AtlasGui";

export const MOBILE_SIZE = { width: 315, height: 695 };
export const DESKTOP_SIZE = { width: 695, height: 390 };

export const APP_WIDTH = MOBILE_SIZE.width;
export const APP_HEIGHT = MOBILE_SIZE.height;

export const getDesignSize = (screenWidth, screenHeight) =>
  screenWidth >= screenHeight ? DESKTOP_SIZE : MOBILE_SIZE;

export const SOUNDS = ["miniWin", "music", "rollBack", "tap", "wrong"];

export const TILES_NAMES = Array.from({ length: 10 }, (_, i) => `egg${i}`);

export const TILES_COLUMNS_COUNT = 7;
export const TILES_COLUMN_SIZE = 7;
export const BASKET_SPEED_START = 12;
export const BASKET_SPEED_MAX = 52;
export const BASKET_SPEED_RAMP_DURATION = 60_000;
export const BASKET_OFFSET_AFTER_WIN = 80;
export const TILES_INITIAL_SPEED = 2.5;
export const TILES_SPEED_MAX = 0.09;
export const TILES_SPEED_MIN = 0.07;

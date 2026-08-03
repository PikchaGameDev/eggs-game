import { getDesignSize } from "../constants";

export function applyResponsiveLayout(container, screenWidth, screenHeight) {
  const designSize = getDesignSize(screenWidth, screenHeight);
  const scale = Math.min(
    screenWidth / designSize.width,
    screenHeight / designSize.height
  );

  container.scale.set(scale);
  container.position.set(
    (screenWidth - designSize.width * scale) / 2,
    (screenHeight - designSize.height * scale) / 2
  );

  return {
    ...designSize,
    scale,
    viewportWidth: screenWidth / scale,
    viewportHeight: screenHeight / scale,
  };
}

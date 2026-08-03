import { Container, Sprite } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH } from "../../constants";
import { getDomTexture } from "../../utils/domAssets";
import { progressBar } from "../ProgressBar/ProgressBar";

export class PreloadView {
  preloadContainer = new Container();

  background;

  async build() {
    const backgroundTexture = await getDomTexture("PreloadBackground");

    this.background = new Sprite(backgroundTexture);
    this.background.anchor.set(0.5);

    this.preloadContainer.addChild(this.background, progressBar);

    this.updateElementsPositions();
    this.updateElementsScale();
  }

  updateElementsScale(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT) {
    const scale = Math.max(
      screenWidth / this.background.texture.width,
      screenHeight / this.background.texture.height
    );
    const elementsScale = [
      {
        x: scale,
        y: scale,
      },
    ];

    [this.background].forEach((element, i) => {
      element.scale = elementsScale[i];
    });
  }

  updateElementsPositions(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT) {
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    const elementsPosition = [
      {
        x: centerX,
        y: centerY,
      },
      {
        x: centerX,
        y: centerY,
      },
    ];

    [this.background, progressBar].forEach((element, i) => {
      element.x = elementsPosition[i].x;
      element.y = elementsPosition[i].y;
    });
  }

  resize(screenWidth, screenHeight) {
    this.updateElementsScale(screenWidth, screenHeight);
    this.updateElementsPositions(screenWidth, screenHeight);
  }

  getView() {
    return this.preloadContainer;
  }

  destroy() {
    this.preloadContainer.destroy();
  }
}

import { Container, Sprite } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH } from "../../constants";
import { textureStore } from "../../stores/TextureStore";

export class BackgroundView {
  backgroundContainer = new Container();

  background;

  build() {
    const texture = textureStore.getTexture("phoneTexture");

    this.background = new Sprite(texture);
    this.background.anchor.set(0.5);
    this.background.eventMode = "none";

    this.backgroundContainer.addChild(this.background);

    this.updateElementsScale();
    this.updateElementsPositions();
  }

  updateElementsScale(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT) {
    const isDesktop = screenWidth > screenHeight;
    const elementsScale = [
      {
        x: isDesktop ? 0 : 0.5,
        y: isDesktop ? 0 : 0.5,
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
    ];

    [this.background].forEach((element, i) => {
      element.x = elementsPosition[i].x;
      element.y = elementsPosition[i].y;
    });
  }

  resize(screenWidth, screenHeight) {
    this.updateElementsScale(screenWidth, screenHeight);
    this.updateElementsPositions(screenWidth, screenHeight);
    this.background.visible = screenWidth <= screenHeight;
  }

  getView() {
    return this.backgroundContainer;
  }

  destroy() {
    this.backgroundContainer.destroy();
  }
}

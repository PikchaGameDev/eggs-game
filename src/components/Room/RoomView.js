import { Container, Sprite } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH } from "../../constants";
import { textureStore } from "../../stores/TextureStore";

export class RoomView {
  roomContainer = new Container();

  background;

  build() {
    const backgroundTexture = textureStore.getTexture("backgroundTexture");

    this.background = new Sprite(backgroundTexture);
    this.background.anchor.set(0.5);

    this.roomContainer.addChild(this.background);

    this.updateElementsScale();
    this.updateElementsPositions();
  }

  updateElementsScale(
    screenWidth = APP_WIDTH,
    screenHeight = APP_HEIGHT,
    viewportWidth = screenWidth,
    viewportHeight = screenHeight
  ) {
    const isDesktop = screenWidth > screenHeight;
    const contentHeight = isDesktop ? viewportHeight : screenHeight * 0.6;
    const scale = Math.max(
      viewportWidth / this.background.texture.width,
      contentHeight / this.background.texture.height,
      isDesktop ? 0 : 0.8
    );

    this.background.scale.set(scale);
  }

  updateElementsPositions(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT) {
    const centerX = screenWidth / 2;
    const isDesktop = screenWidth > screenHeight;

    const elementsPosition = [
      {
        x: centerX,
        y: isDesktop ? screenHeight / 2 : this.background.height / 2,
      },
    ];

    [this.background].forEach((element, i) => {
      element.position.set(elementsPosition[i].x, elementsPosition[i].y);
    });
  }

  resize(screenWidth, screenHeight, viewportWidth, viewportHeight) {
    this.updateElementsScale(
      screenWidth,
      screenHeight,
      viewportWidth,
      viewportHeight
    );
    this.updateElementsPositions(screenWidth, screenHeight);
  }

  getView() {
    return this.roomContainer;
  }

  destroy() {
    this.roomContainer.destroy();
  }
}

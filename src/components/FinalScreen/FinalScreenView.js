import { Container, Graphics, Sprite, Text } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH } from "../../constants";
import { textureStore } from "../../stores/TextureStore";
import { atlasStore } from "../../stores/AtlasStore";

export class FinalScreenView {
  finalScreenContainer = new Container();

  finalScreen;
  playButton = new Container();
  playButtonBackground = new Graphics();
  playButtonText = new Text("Играть", {
    fill: 0xffffff,
    fontFamily: "Arial, sans-serif",
    fontSize: 28,
    fontWeight: "700",
    stroke: 0x174f13,
    strokeThickness: 4,
  });

  build() {
    const textureScreen = textureStore.getTexture("final_screenTexture");

    this.finalScreen = new Sprite(textureScreen);
    this.finalScreen.anchor.set(0.5);
    this.finalScreen.eventMode = "none";

    this.playButtonText.anchor.set(0.5);
    this.playButton.addChild(this.playButtonBackground, this.playButtonText);
    this.playButton.eventMode = "static";
    this.playButton.cursor = "pointer";

    this.finalScreenContainer.addChild(this.finalScreen, this.playButton);

    this.updateElementsScale();
    this.updateElementsPositions();
  }

  updateElementsScale(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT) {
    const scale = Math.min(
      screenWidth / this.finalScreen.texture.width,
      screenHeight / this.finalScreen.texture.height
    );
    const elementsScale = [
      {
        x: scale,
        y: scale,
      },
    ];

    [this.finalScreen].forEach((element, i) => {
      element.scale = elementsScale[i];
    });
  }

  updateElementsPositions(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT) {
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const isDesktop = screenWidth > screenHeight;
    const buttonWidth = isDesktop ? 200 : 240;
    const buttonHeight = 64;

    this.playButtonBackground
      .clear()
      .beginFill(0x123d12, 0.45)
      .drawRoundedRect(
        -buttonWidth / 2 + 3,
        -buttonHeight / 2 + 6,
        buttonWidth,
        buttonHeight,
        18
      )
      .endFill()
      .lineStyle(4, 0xb7f45d, 1)
      .beginFill(0x39b929)
      .drawRoundedRect(
        -buttonWidth / 2,
        -buttonHeight / 2,
        buttonWidth,
        buttonHeight,
        18
      )
      .endFill();

    const elementsPosition = [
      {
        x: centerX,
        y: centerY,
      },
    ];

    [this.finalScreen].forEach((element, i) => {
      element.x = elementsPosition[i].x;
      element.y = elementsPosition[i].y;
    });

    this.playButton.position.set(
      centerX,
      centerY + this.finalScreen.height * 0.38
    );
  }

  resize(screenWidth, screenHeight) {
    this.updateElementsScale(screenWidth, screenHeight);
    this.updateElementsPositions(screenWidth, screenHeight);
  }

  getView() {
    return this.finalScreenContainer;
  }

  destroy() {
    this.finalScreenContainer.destroy();
  }
}

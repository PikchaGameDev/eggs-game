import { Container, Sprite } from "pixi.js";
import { APP_HEIGHT, APP_WIDTH, TILES_NAMES } from "../../constants";
import { atlasStore } from "../../stores/AtlasStore";

export class BasketView {
  basketContainer = new Container();

  basket;
  tile;
  layoutWidth = APP_WIDTH;
  layoutHeight = APP_HEIGHT;
  travelOffset = 0;

  build() {
    const textureBasket = atlasStore.getTextureFromAtlas(
      "guiAtlas",
      "basket.png"
    );

    this.basket = new Sprite(textureBasket);
    this.basket.anchor.x = 0.5;

    this.createTile();

    this.basketContainer.addChild(this.basket, this.tile);

    this.resize();
  }

  updateElementsScale() {
    const elementsScale = [
      {
        x: 0.1,
        y: 0.1,
      },
      {
        x: 0.2,
        y: 0.2,
      },
    ];

    [this.basket, this.tile].forEach((element, i) => {
      element.scale = elementsScale[i];
    });
  }

  updateElementsPositions() {
    const centerX = this.layoutWidth / 2;
    const centerY = this.layoutHeight / 2;
    const isDesktop = this.layoutWidth > this.layoutHeight;
    const basketStart = isDesktop
      ? { x: centerX - 65, y: 38 }
      : { x: centerX - 90, y: centerY - 60 };
    const tileStart = isDesktop
      ? { x: centerX - 65, y: 68 }
      : { x: centerX - 90, y: centerY - 30 };
    const travelX = isDesktop ? 0 : this.travelOffset;
    const travelY = isDesktop ? this.travelOffset : 0;

    const elementsPosition = [
      {
        x: basketStart.x + travelX,
        y: basketStart.y + travelY,
      },
      {
        x: tileStart.x + travelX,
        y: tileStart.y + travelY,
      },
    ];

    [this.basket, this.tile].forEach((element, i) => {
      element.position.set(elementsPosition[i].x, elementsPosition[i].y);
    });
  }

  createTile(x = 0, y = 0) {
    const tileElementName =
      TILES_NAMES[Math.floor(Math.random() * TILES_NAMES.length)];
    const tileElementTexture = atlasStore.getTextureFromAtlas(
      "guiAtlas",
      `${tileElementName}.png`
    );

    this.tile?.destroy();
    this.tile = new Sprite(tileElementTexture);
    this.tile.label = tileElementName;
    this.tile.anchor.set(0.5);
    this.tile.x = x;
    this.tile.y = y;

    this.basketContainer.addChild(this.tile);
  }

  setTravelOffset(travelOffset) {
    this.travelOffset = travelOffset;
    this.updateElementsPositions();
  }

  resize(screenWidth = APP_WIDTH, screenHeight = APP_HEIGHT, travelOffset = 0) {
    this.layoutWidth = screenWidth;
    this.layoutHeight = screenHeight;
    this.travelOffset = travelOffset;
    this.updateElementsScale();
    this.updateElementsPositions();
  }

  getView() {
    return this.basketContainer;
  }

  destroy() {
    this.basketContainer.destroy();
  }
}

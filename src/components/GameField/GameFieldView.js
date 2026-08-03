import { Container, Sprite } from "pixi.js";
import {
  APP_HEIGHT,
  APP_WIDTH,
  TILES_COLUMNS_COUNT,
  TILES_COLUMN_SIZE,
  TILES_NAMES,
} from "../../constants";
import { atlasStore } from "../../stores/AtlasStore";
import { textureStore } from "../../stores/TextureStore";

export class GameFieldView {
  gameFieldContainer = new Container();

  tilesContainer = new Container();
  tiles = [];

  board;
  layoutWidth = APP_WIDTH;
  layoutHeight = APP_HEIGHT;

  build() {
    const boardTexture = textureStore.getTexture("woodTexture");
    this.board = new Sprite(boardTexture);
    this.board.anchor.set(0.5);

    this.createTilesField();

    this.gameFieldContainer.addChild(this.board, this.tilesContainer);

    this.updateElementsScale();
    this.updateElementsPositions();
  }

  createTilesField() {
    for (let i = 1; i < TILES_COLUMNS_COUNT + 1; i++) {
      const tilesContainer = [];

      const tilesColumn = {
        container: tilesContainer,
      };

      for (let j = 1; j < TILES_COLUMN_SIZE + 1; j++) {
        const tileContainer = new Container();
        tileContainer.eventMode = "static";
        tileContainer.cursor = "pointer";
        tileContainer.zIndex = i * j;

        const tileBackground = this.getTileBackground();
        const tileElement = this.getTileElement();

        tileContainer.addChild(tileBackground, tileElement);

        tilesContainer.push(tileContainer);

        this.tilesContainer.addChild(tileContainer);
      }

      this.tiles.push(tilesColumn);
    }
  }

  changeTile(tile, columnIndex, rowIndex) {
    tile.children[1].destroy();
    tile.x = 0;
    tile.y = 0;
    tile.zIndex = columnIndex * rowIndex;
    tile.addChild(this.getTileElement());
    tile.visible = true;

    this.tilesContainer.addChildAt(tile, (columnIndex - 1) * (rowIndex - 1));
    this.tilesContainer.sortChildren();
  }

  getTileBackground() {
    const tileBackgroundTexture = atlasStore.getTextureFromAtlas(
      "guiAtlas",
      "tile.png"
    );
    const tileBackground = new Sprite(tileBackgroundTexture);

    tileBackground.anchor.set(0.5);

    return tileBackground;
  }

  getTileElement(
    tileElementName =
      TILES_NAMES[Math.floor(Math.random() * TILES_NAMES.length)]
  ) {

    const tileElementTexture = atlasStore.getTextureFromAtlas(
      "guiAtlas",
      `${tileElementName}.png`
    );
    const tileElement = new Sprite(tileElementTexture);
    tileElement.anchor.set(0.5);
    tileElement.label = tileElementName;
    tileElement.scale.x = 0.2;
    tileElement.scale.y = 0.2;

    return tileElement;
  }

  ensureTargetCount(target, minimumCount = 3) {
    const allTiles = this.tiles.flatMap((column) => column.container);
    const targetCount = allTiles.filter(
      (tile) => tile.children[1].label === target
    ).length;
    const missingCount = Math.max(0, minimumCount - targetCount);

    allTiles
      .filter((tile) => tile.children[1].label !== target)
      .slice(0, missingCount)
      .forEach((tile) => {
        tile.children[1].destroy();
        const targetElement = this.getTileElement(target);
        targetElement.y = -8;
        tile.addChild(targetElement);
      });
  }

  getTargetTiles(target, amount = 3) {
    return this.tiles
      .flatMap((column) => column.container)
      .filter((tile) => tile.children[1].label === target)
      .slice(0, amount);
  }

  updateElementsScale() {
    const elementsScale = [
      {
        x: 0.5,
        y: 0.5,
      },
    ];

    this.tiles.forEach((tilesColumn) => {
      tilesColumn.container.forEach((tileContainer) => {
        tileContainer.scale = {
          x: 0.5,
          y: 0.5,
        };
      });
    });

    [this.board].forEach((element, i) => {
      element.scale = elementsScale[i];
    });
  }

  updateElementsPositions() {
    const centerX = this.layoutWidth / 2;
    const centerY = this.layoutHeight / 2;
    const isDesktop = this.layoutWidth > this.layoutHeight;
    const boardX = isDesktop
      ? this.layoutWidth - this.board.width / 2
      : centerX;
    const boardY = isDesktop
      ? centerY
      : this.layoutHeight - this.board.height / 2;
    const boardLeft = boardX - this.board.width / 2;
    const boardTop = boardY - this.board.height / 2;

    this.tiles.forEach((tilesColumn, i) => {
      tilesColumn.container.forEach((tileContainer, j) => {
        if (tileContainer.parent !== this.tilesContainer) {
          return;
        }

        tileContainer.x = (isDesktop ? boardLeft : 0) + 24 + i * 44.4;
        tileContainer.y =
          (isDesktop ? boardTop + 28 : centerY + 73) + j * 42.6;
        tileContainer.children[1].y = -8;
      });
    });

    this.board.position.set(boardX, boardY);
  }

  resize(screenWidth, screenHeight) {
    this.layoutWidth = screenWidth;
    this.layoutHeight = screenHeight;
    this.updateElementsScale();
    this.updateElementsPositions();
  }

  getView() {
    return this.gameFieldContainer;
  }

  destroy() {
    this.gameFieldContainer.destroy();
  }
}

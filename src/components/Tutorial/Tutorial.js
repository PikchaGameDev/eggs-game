import signal from "signal-js";
import { Point } from "pixi.js";
import { TutorialView } from "./TutorialView";

export class Tutorial {
  view;
  tiles = [];
  selectedTiles = new Set();
  isActive = false;
  currentTileIndex = 0;
  tileGlobalPosition = new Point();
  tileLocalPosition = new Point();

  constructor() {
    this.view = new TutorialView();
    this.openConnections();
  }

  start(tiles) {
    this.tiles = tiles;
    this.selectedTiles.clear();
    this.currentTileIndex = 0;
    this.isActive = true;
    this.view.show();
    this.updateElementPositions(true);
  }

  stop() {
    this.isActive = false;
    this.tiles = [];
    this.selectedTiles.clear();
    this.view.hide();
  }

  handleTileSelected(tile) {
    if (!this.isActive) {
      return;
    }

    this.selectedTiles.add(tile);
    const selectedIndex = this.tiles.indexOf(tile);

    if (selectedIndex >= 0) {
      this.view.highlights[selectedIndex].visible = false;
    }

    this.currentTileIndex = this.tiles.findIndex(
      (tutorialTile) => !this.selectedTiles.has(tutorialTile)
    );

    if (this.currentTileIndex < 0) {
      this.view.pointer.visible = false;
    }
  }

  getTilePosition(tile) {
    tile.getGlobalPosition(this.tileGlobalPosition);
    this.view.tutorialContainer.toLocal(
      this.tileGlobalPosition,
      undefined,
      this.tileLocalPosition
    );

    return this.tileLocalPosition;
  }

  updateElementPositions(resetPointer = false) {
    this.tiles.forEach((tile, index) => {
      if (this.selectedTiles.has(tile)) {
        return;
      }

      const position = this.getTilePosition(tile);
      this.view.highlights[index].position.copyFrom(position);
    });

    if (this.currentTileIndex < 0) {
      return;
    }

    const targetPosition = this.getTilePosition(
      this.tiles[this.currentTileIndex]
    );
    const targetX = targetPosition.x;
    const targetY = targetPosition.y - 48;

    if (resetPointer) {
      this.view.pointer.position.set(targetX, targetY);
    } else {
      this.view.pointer.x += (targetX - this.view.pointer.x) * 0.14;
      this.view.pointer.y += (targetY - this.view.pointer.y) * 0.14;
    }
  }

  tick() {
    if (!this.isActive) {
      return;
    }

    this.updateElementPositions();

    const animationTime = performance.now();
    const pulse = 1 + Math.sin(animationTime * 0.007) * 0.07;
    const pointerBob = Math.sin(animationTime * 0.009) * 5;

    this.view.highlights.forEach((highlight) => {
      if (highlight.visible) {
        highlight.scale.set(pulse);
        highlight.alpha = 0.72 + Math.sin(animationTime * 0.007) * 0.2;
      }
    });

    if (this.view.pointer.visible) {
      this.view.pointer.pivot.y = pointerBob;
    }
  }

  resize() {
    if (this.isActive) {
      this.updateElementPositions(true);
    }
  }

  openConnections() {
    signal.on("tutorial_start", this.start.bind(this));
    signal.on("tutorial_tile_selected", this.handleTileSelected.bind(this));
    signal.on("tutorial_stop", this.stop.bind(this));
  }

  getView() {
    return this.view.getView();
  }
}

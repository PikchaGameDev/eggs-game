import signal from "signal-js";
import { FlyingTilesView } from "./FlyingTilesView";
import { soundService } from "../../services/soundServices";
import {
  TILES_INITIAL_SPEED,
  TILES_SPEED_MAX,
  TILES_SPEED_MIN,
} from "../../constants";
import { Point } from "pixi.js";

export class FlyingTiles {
  view;

  targetTile;
  tiles = [];

  speed = [];
  speedIncrements = [];

  isSoundWinPlay = false;
  targetGlobalPosition = new Point();
  targetLocalPosition = new Point();

  constructor() {
    this.view = new FlyingTilesView();

    this.openConnections();
  }

  getView() {
    return this.view.getView();
  }

  isCheckIntersection(entity, area, areaPosition = area.position) {
    return (
      entity.x < areaPosition.x + area.width / 5 &&
      entity.x + entity.width / 5 > areaPosition.x &&
      entity.y < areaPosition.y + area.height / 5 &&
      entity.y + entity.height / 5 > areaPosition.y
    );
  }

  tick() {
    if (!this.tiles.length) {
      return;
    }

    const visibleTiles = this.moveTiles();

    if (!visibleTiles) {
      signal.emit("fly_stop");

      this.view.flyingTilesContainer.removeChildren();

      this.tiles = [];
      this.speed = [];
      this.speedIncrements = [];

      this.isSoundWinPlay = false;
    }
  }

  moveTiles() {
    let visibleTiles = 0;
    this.targetTile.getGlobalPosition(this.targetGlobalPosition);
    this.view.flyingTilesContainer.toLocal(
      this.targetGlobalPosition,
      undefined,
      this.targetLocalPosition
    );

    this.tiles.forEach(({ tile }, i) => {
      if (!tile.visible) {
        return;
      }

      visibleTiles++;

      const deltaX = this.targetLocalPosition.x - tile.x;
      const deltaY = this.targetLocalPosition.y - tile.y;
      const distance = Math.hypot(deltaX, deltaY);

      this.speed[i] += this.speedIncrements[i];
      const movement = Math.min(this.speed[i], distance);

      if (distance > 0) {
        tile.x += (deltaX / distance) * movement;
        tile.y += (deltaY / distance) * movement;
      }

      if (
        movement === distance ||
        this.isCheckIntersection(
          tile,
          this.targetTile,
          this.targetLocalPosition
        )
      ) {
        tile.position.copyFrom(this.targetLocalPosition);
        tile.visible = false;
        visibleTiles--;

        if (!this.isSoundWinPlay) {
          soundService.play("miniWin");
          this.isSoundWinPlay = true;
        }
      }
    });

    return visibleTiles;
  }

  speedCalculation(targetPosition) {
    this.tiles.forEach(({ tile }) => {
      const horizontalDistance = Math.abs(tile.x - targetPosition.x);
      const verticalDistance = Math.abs(tile.y - targetPosition.y);

      this.speedIncrements.push(
        verticalDistance > horizontalDistance
          ? TILES_SPEED_MAX
          : TILES_SPEED_MIN
      );

      this.speed.push(TILES_INITIAL_SPEED);
    });
  }

  handleGetTarget(targetTile) {
    this.targetTile = targetTile;

    this.targetTile.getGlobalPosition(this.targetGlobalPosition);
    this.view.flyingTilesContainer.toLocal(
      this.targetGlobalPosition,
      undefined,
      this.targetLocalPosition
    );

    this.tiles.forEach(({ tile }) => {
      const globalCoords = tile.getGlobalPosition();

      tile.visible = true;
      this.view.flyingTilesContainer.addChild(tile);
      this.view.flyingTilesContainer.toLocal(
        globalCoords,
        undefined,
        tile.position
      );
    });

    this.speedCalculation(this.targetLocalPosition);
  }

  openConnections() {
    signal.on("to_target", this.handleGetTarget.bind(this));

    signal.on("from_tiles", (tiles) => {
      this.tiles = tiles;
    });

  }
}

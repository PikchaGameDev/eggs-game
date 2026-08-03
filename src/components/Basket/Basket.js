import signal from "signal-js";
import {
  BASKET_OFFSET_AFTER_WIN,
  BASKET_SPEED_MAX,
  BASKET_SPEED_RAMP_DURATION,
  BASKET_SPEED_START,
} from "../../constants";
import { soundService } from "../../services/soundServices";
import { BasketView } from "./BasketView";

export class Basket {
  view;

  isSendTargetPos = false;
  travelOffset = 0;
  layoutWidth = 315;
  layoutHeight = 695;
  elapsedPlayTime = 0;
  currentSpeed = BASKET_SPEED_START;
  isFinished = false;

  constructor() {
    this.view = new BasketView();

    this.view.build();

    this.openConnections();
    signal.emit("current_target", this.view.tile.label);
  }

  tick(deltaMS = 1000 / 60) {
    if (this.isFinished) {
      return;
    }

    const safeDeltaMS = Math.min(deltaMS, 50);
    this.elapsedPlayTime += safeDeltaMS;

    const speedProgress = Math.min(
      this.elapsedPlayTime / BASKET_SPEED_RAMP_DURATION,
      1
    );
    const easedProgress = Math.pow(speedProgress, 1.5);

    this.currentSpeed =
      BASKET_SPEED_START +
      (BASKET_SPEED_MAX - BASKET_SPEED_START) * easedProgress;
    this.travelOffset += this.currentSpeed * (safeDeltaMS / 1000);
    this.view.setTravelOffset(this.travelOffset);

    const isDesktop = this.layoutWidth > this.layoutHeight;
    const hasLeftScreen = isDesktop
      ? this.view.basket.y > this.layoutHeight
      : this.view.basket.x > this.layoutWidth;

    if (hasLeftScreen) {
      this.isFinished = true;
      signal.emit("show_finish");
    }

    if (this.isSendTargetPos) {
      signal.emit("update_target_pos", this.view.tile.x, this.view.tile.y);
    }
  }

  openConnections() {
    signal.on("trips_complete", () => {
      this.isSendTargetPos = true;

      signal.emit("to_target", this.view.tile);
    });

    signal.on("fly_stop", this.handleFlyTilesStop.bind(this));
  }

  handleFlyTilesStop() {
    this.isSendTargetPos = false;
    soundService.play("rollBack");
    this.travelOffset = Math.max(
      0,
      this.travelOffset - BASKET_OFFSET_AFTER_WIN
    );
    this.view.setTravelOffset(this.travelOffset);

    this.view.createTile(this.view.tile.x, this.view.tile.y);

    signal.emit("current_target", this.view.tile.label);

    this.view.updateElementsScale();
  }

  resize(screenWidth, screenHeight) {
    this.layoutWidth = screenWidth;
    this.layoutHeight = screenHeight;
    this.view.resize(screenWidth, screenHeight, this.travelOffset);
  }

  getView() {
    return this.view.getView();
  }
}

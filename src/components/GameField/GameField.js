import signal from "signal-js";
import { GameFieldView } from "./GameFieldView";
import { soundService } from "../../services/soundServices";

export class GameField {
  view;

  trips = [];
  isElementsFly = false;
  currentTarget;
  tutorialRound = 0;
  tutorialRoundsAmount = 3;
  tutorialTiles = [];
  isTutorialActive = false;

  constructor() {
    this.view = new GameFieldView();

    this.view.build();

    this.openConnections();
    this.initListeners();
  }

  initListeners() {
    this.view.tiles.forEach((tilesColumn, i) => {
      tilesColumn.container.forEach((tileContainer, j) => {
        tileContainer.on(
          "pointerdown",
          this.handleTileClick.bind(this, tileContainer, i + 1, j + 1)
        );
      });
    });
  }

  handleTileClick(tile, columnIndex, rowIndex) {
    const scale = tile.scale;

    if (this.isElementsFly || scale.x > 0.5 || this.trips.length === 3) {
      return;
    }

    if (this.isTutorialActive && !this.tutorialTiles.includes(tile)) {
      return;
    }

    soundService.play("tap");

    const pickedElement = {
      tile: tile,
      label: tile.children[1].label,
      columnIndex,
      rowIndex,
    };

    if (!this.checkTripsOnSameLabel(pickedElement.label)) {
      this.trips.push(pickedElement);
    } else {
      this.clearTrips();

      this.trips.push(pickedElement);
    }

    tile.scale = {
      x: (scale.x += 0.05),
      y: (scale.y += 0.05),
    };

    tile.zIndex = 100;

    this.view.tilesContainer.sortChildren();

    if (this.isTutorialActive) {
      signal.emit("tutorial_tile_selected", tile);
    }

    this.checkOnFullTrips();
  }

  clearTrips() {
    this.trips.forEach((element) => {
      element.tile.scale = {
        x: 0.5,
        y: 0.5,
      };

      element.tile.zIndex = element.columnIndex * element.rowIndex;
    });

    this.view.tilesContainer.sortChildren();
    this.trips.length = 0;
  }

  checkTripsOnSameLabel(label) {
    if (!this.trips.length) {
      return false;
    }

    return this.trips.some((element) => element.label !== label);
  }

  updateFieldElements() {
    this.trips.forEach(({ tile, columnIndex, rowIndex }) => {
      this.view.changeTile(tile, columnIndex, rowIndex);
    });

    this.view.updateElementsScale();
    this.view.updateElementsPositions();
  }

  refreshField() {
    if (this.trips.length === 3) {
      this.updateFieldElements();
      this.clearTrips();

      this.isElementsFly = false;
    }
  }

  checkOnFullTrips() {
    if (this.trips.length !== 3) {
      return;
    }

    if (!this.checkTripsOnSameLabel(this.currentTarget)) {
      this.isElementsFly = true;

      if (this.isTutorialActive) {
        this.tutorialRound++;
        this.isTutorialActive = false;
        signal.emit("tutorial_stop");
      }

      this.trips.forEach(({ tile }) => {
        tile.visible = false;
      });

      signal.emit("from_tiles", this.trips);
      signal.emit("trips_complete");
    } else {
      soundService.play("wrong");

      setTimeout(() => {
        this.clearTrips();
      }, 500);
    }
  }

  openConnections() {
    signal.on("current_target", (target) => {
      this.currentTarget = target;
      this.view.ensureTargetCount(target);

      if (this.tutorialRound < this.tutorialRoundsAmount) {
        this.tutorialTiles = this.view.getTargetTiles(target);
        this.isTutorialActive = true;
        signal.emit("tutorial_start", this.tutorialTiles);
      } else {
        this.tutorialTiles = [];
        this.isTutorialActive = false;
        signal.emit("tutorial_stop");
      }
    });

    signal.on("fly_stop", () => {
      this.refreshField();
    });
  }

  getView() {
    return this.view.getView();
  }

  resize(screenWidth, screenHeight) {
    this.view.resize(screenWidth, screenHeight);
  }
}

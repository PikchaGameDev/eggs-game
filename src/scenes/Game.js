import { Container } from "pixi.js";
import { Background } from "../components/Background/Background";
import { FinalScreen } from "../components/FinalScreen/FinalScreen";
import { FlyingTiles } from "../components/FlyingTiles/FlyingTiles";
import { GameField } from "../components/GameField/GameField";
import { Basket } from "../components/Basket/Basket";
import { Room } from "../components/Room/Room";
import { soundService } from "../services/soundServices";
import { applyResponsiveLayout } from "../utils/layout";
import { Tutorial } from "../components/Tutorial/Tutorial";

export default class Game {
  pixiApp;

  worldContainer;

  background;
  finalScreen;
  gameField;
  basket;
  room;
  flyingTiles;
  tutorial;

  constructor(pixiApp) {
    this.pixiApp = pixiApp;

    this.worldContainer = new Container();
    this.pixiApp.stage.addChild(this.worldContainer);
  }

  initGameObjects() {
    this.background = new Background();
    this.finalScreen = new FinalScreen();
    this.flyingTiles = new FlyingTiles();
    this.gameField = new GameField();
    this.tutorial = new Tutorial();
    this.basket = new Basket();
    this.room = new Room();

    this.worldContainer.addChild(
      this.room.getView(),
      this.gameField.getView(),
      this.basket.getView(),
      this.flyingTiles.getView(),
      this.tutorial.getView(),
      this.finalScreen.getView(),
      this.background.getView()
    );

    soundService.play("music", 0.1, true);
  }

  tick(deltaMS) {
    this.basket.tick(deltaMS);
    this.flyingTiles.tick();
    this.tutorial.tick();
  }

  resize() {
    const layout = applyResponsiveLayout(
      this.worldContainer,
      window.innerWidth,
      window.innerHeight
    );

    this.room.resize(
      layout.width,
      layout.height,
      layout.viewportWidth,
      layout.viewportHeight
    );
    this.gameField.resize(layout.width, layout.height);
    this.basket.resize(layout.width, layout.height);
    this.tutorial.resize();
    this.finalScreen.resize(layout.width, layout.height);
    this.background.resize(layout.width, layout.height);
  }
}

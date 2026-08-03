import { Application } from "pixi.js";
import Game from "./scenes/Game";
import Preload from "./scenes/Preload";
import { applyResponsiveLayout } from "./utils/layout";

(async () => {
  try {
    const app = new Application({
      resizeTo: window,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      backgroundAlpha: 0,
      antialias: true,
    });

    let gameContainer = document.getElementById("app");

    gameContainer?.appendChild(app.view);

    const preloadScene = new Preload(app);

    await preloadScene.build();

    const resizePreload = () => {
      const layout = applyResponsiveLayout(
        preloadScene.preload.view.getView(),
        window.innerWidth,
        window.innerHeight
      );
      preloadScene.resize(layout.width, layout.height);
    };

    resizePreload();

    await preloadScene.preloadGameAssets();

    const gameScene = new Game(app);

    gameScene.initGameObjects();
    gameScene.resize();

    preloadScene.destroy();

    app.ticker.add(() => {
      gameScene.tick(app.ticker.deltaMS);
    });

    let resizeFrame = 0;
    const resizeGame = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        app.stage.hitArea = app.screen;
        gameScene.resize();
      });
    };

    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    window.addEventListener("resize", resizeGame, { passive: true });
    window.addEventListener("orientationchange", resizeGame, {
      passive: true,
    });
  } catch (e) {
    console.error(e);
  }
})();

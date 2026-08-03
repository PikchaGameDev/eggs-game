import { BaseTexture, Rectangle, Texture } from "pixi.js";
import { Preload } from "../components/Preload/Preload";
import { progressBar } from "../components/ProgressBar/ProgressBar";
import {
  ATLAS_IMAGE_ID,
  DOM_TEXTURE_IDS,
  TEXTURES_NAMES,
} from "../constants";
import { atlasStore } from "../stores/AtlasStore";
import { textureStore } from "../stores/TextureStore";
import {
  getImageElement,
  waitForImage,
  waitForImages,
} from "../utils/domAssets";
import atlasData from "../../assets/gui/atlas/texture_gui.json";

export default class PreloadScene {
  pixiApp;

  preload;

  constructor(pixiApp) {
    this.pixiApp = pixiApp;

    this.preload = new Preload();
  }

  async preloadGameAssets() {
    const imageIds = [
      ATLAS_IMAGE_ID,
      ...TEXTURES_NAMES.map((name) => DOM_TEXTURE_IDS[name]),
    ];

    await waitForImages(imageIds, (progress) => {
      progressBar.setProgress(progress * 0.9);
    });

    TEXTURES_NAMES.forEach((textureName) => {
      textureStore.addTexture(
        `${textureName}Texture`,
        Texture.from(getImageElement(DOM_TEXTURE_IDS[textureName]))
      );
    });

    const atlasImage = await waitForImage(ATLAS_IMAGE_ID);
    const atlasBaseTexture = BaseTexture.from(atlasImage);
    const atlasTextures = {};

    Object.entries(atlasData.frames).forEach(([name, data]) => {
      const { x, y, w, h } = data.frame;
      atlasTextures[name] = new Texture(
        atlasBaseTexture,
        new Rectangle(x, y, w, h)
      );
    });

    atlasStore.addAtlas("guiAtlas", { textures: atlasTextures });
    progressBar.setProgress(1);
  }

  async build() {
    await this.preload.view.build();

    this.pixiApp.stage.addChild(this.preload.view.getView());
  }

  destroy() {
    this.preload.view.destroy();
  }

  resize(screenWidth, screenHeight) {
    this.preload.view.resize(screenWidth, screenHeight);
  }
}

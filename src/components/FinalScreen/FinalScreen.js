import signal from "signal-js";
import { FinalScreenView } from "./FinalScreenView";
import { soundService } from "../../services/soundServices";

export class FinalScreen {
  view;

  constructor() {
    this.view = new FinalScreenView();

    this.view.build();

    this.getView().visible = false;

    this.openConnections();
    this.initListeners();
  }

  openConnections() {
    signal.on("show_finish", () => {
      this.getView().visible = true;

      soundService.stop("music");
    });
  }

  initListeners() {
    this.view.playButton.on("pointerdown", () => {
      window.open(
        "https://play.google.com/store/apps/details?id=com.xinsheng.crush.eggs",
        "__blank"
      );
    });
  }

  getView() {
    return this.view.getView();
  }

  resize(screenWidth, screenHeight) {
    this.view.resize(screenWidth, screenHeight);
  }
}

import { BackgroundView } from "./BackgroundView";

export class Background {
  view;

  constructor() {
    this.view = new BackgroundView();

    this.view.build();
  }

  getView() {
    return this.view.getView();
  }

  resize(screenWidth, screenHeight) {
    this.view.resize(screenWidth, screenHeight);
  }
}

import { RoomView } from "./RoomView";

export class Room {
  view;

  constructor() {
    this.view = new RoomView();

    this.view.build();
  }

  getView() {
    return this.view.getView();
  }

  resize(screenWidth, screenHeight, viewportWidth, viewportHeight) {
    this.view.resize(
      screenWidth,
      screenHeight,
      viewportWidth,
      viewportHeight
    );
  }
}

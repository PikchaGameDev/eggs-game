import { Container, Graphics } from "pixi.js";

export class TutorialView {
  tutorialContainer = new Container();
  highlights = [];
  pointer;

  constructor() {
    this.tutorialContainer.eventMode = "none";
    this.createHighlights();
    this.createPointer();
    this.tutorialContainer.visible = false;
  }

  createHighlights() {
    for (let i = 0; i < 3; i++) {
      const highlight = new Graphics()
        .lineStyle(4, 0xfff04a, 1)
        .beginFill(0xfff04a, 0.2)
        .drawRoundedRect(-29, -31, 58, 62, 10)
        .endFill();

      this.highlights.push(highlight);
      this.tutorialContainer.addChild(highlight);
    }
  }

  createPointer() {
    this.pointer = new Graphics()
      .lineStyle(3, 0x6b3d00, 1)
      .beginFill(0xfff04a)
      .drawCircle(0, 0, 12)
      .drawPolygon([-8, 8, 8, 8, 0, 29])
      .endFill();

    this.tutorialContainer.addChild(this.pointer);
  }

  show() {
    this.highlights.forEach((highlight) => {
      highlight.visible = true;
      highlight.alpha = 1;
    });
    this.pointer.visible = true;
    this.tutorialContainer.visible = true;
  }

  hide() {
    this.tutorialContainer.visible = false;
  }

  getView() {
    return this.tutorialContainer;
  }
}

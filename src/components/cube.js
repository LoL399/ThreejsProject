import { SceneObject } from "./object.js";

const ControlKey = Object.freeze({
  A: "a",
  S: "s",
  D: "d",
  W: "w",
  SPACE: " ",
  CTRL: "shift",
});

export class MovObject extends SceneObject {
  isMoveAble = true;
  //
  moveLeft = false;
  moveRight = false;
  moveUp = false;
  moveDown = false;
  jumpUp = false;
  descend = false;
  //
  grav = 0.1;
  speed = 0.1;
  #maxJump = 3;
  #isMaxJumpReach = false;
  #isFloating = false;

  constructor() {
    super();
    this.createEventBind();
  }

  lockMovement() {
    this.isMoveAble = false;
  }

  unLockMovement() {
    this.isMoveAble = true;
  }

  allowFloat() {
    this.#isFloating = true;
  }

  createEventBind() {
    window.addEventListener("keydown", (event) => {
      let input = event.key.toLocaleLowerCase();
      switch (input) {
        case ControlKey.A:
          this.moveLeft = true;
          break;
        case ControlKey.D:
          this.moveRight = true;
          break;
        case ControlKey.W:
          this.moveUp = true;
          break;
        case ControlKey.S:
          this.moveDown = true;
          break;
        case ControlKey.SPACE:
          this.jumpUp = true;
          break;
        case ControlKey.CTRL:
          this.jumpUp = false;
          this.descend = true;
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      let input = event.key.toLocaleLowerCase();
      switch (input) {
        case ControlKey.A:
          this.moveLeft = false;
          break;
        case ControlKey.D:
          this.moveRight = false;
          break;
        case ControlKey.W:
          this.moveUp = false;
          break;
        case ControlKey.S:
          this.moveDown = false;
          break;
        case ControlKey.SPACE:
          this.jumpUp = false;
          break;
        case ControlKey.CTRL:
          this.descend = false;
          break;
      }
    });
  }

  moveObject() {
    if (!this.isMoveAble || !this.object) return;

    const pos = this.object.position;

    const actions = {
      moveLeft: () => (pos.x -= this.speed),
      moveRight: () => (pos.x += this.speed),
      moveUp: () => (pos.z -= this.speed),
      moveDown: () => (pos.z += this.speed),
      jumpUp: () => {
        if (this.#isMaxJumpReach) return;
        pos.y += this.speed;
      },
      descend: () => {
        if (!this.#isFloating) return;
        if (pos.y <= 0.5) return;
        pos.y -= this.speed;
      },
    };

    for (const [key, action] of Object.entries(actions)) {
      if (this[key]) action();
    }
    if (!this.#isFloating) {
      if ((pos.y > 0.5 && !this.jumpUp) || this.#isMaxJumpReach) {
        pos.y -= this.grav;
      }
      if (pos.y >= 3) {
        this.#isMaxJumpReach = pos.y > this.#maxJump;
      }
    }
    if (pos.y < 0.5) {
      pos.y = 0.5;
      this.#isMaxJumpReach = false;
    }
  }

  destroy() {}
}

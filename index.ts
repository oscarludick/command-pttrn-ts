export enum KEYS {
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT
}

export interface Command {
  execute(): void;
  undo(): void;
}

export class PressKey {
  moveUp() {
    console.log("Key UP Pressed");
  }

  moveDown() {
    console.log("Key DOWN Pressed");
  }

  moveLeft() {
    console.log("Key LEFT Pressed");
  }

  moveRight() {
    console.log("Key RIGHT Pressed");
  }
}

export class NoCommand implements Command {
  execute() {}
  undo() {}
  toString() {
    return "No Command";
  }
}

export class MoveLeftCommand implements Command {
  private pressKey: PressKey;
  constructor(pressKey: PressKey) {
    this.pressKey = pressKey;
  }

  execute() {
    this.pressKey.moveLeft();
  }

  undo() {
    this.pressKey.moveRight();
  }

  toString() {
    return "KEY LEFT";
  }
}

export class MoveUpCommand implements Command {
  private pressKey: PressKey;
  constructor(pressKey: PressKey) {
    this.pressKey = pressKey;
  }

  execute() {
    this.pressKey.moveUp();
  }

  undo() {
    this.pressKey.moveDown();
  }

  toString() {
    return "KEY UP";
  }
}

export class MoveDownCommand implements Command {
  private pressKey: PressKey;
  constructor(pressKey: PressKey) {
    this.pressKey = pressKey;
  }

  execute() {
    this.pressKey.moveDown();
  }

  undo() {
    this.pressKey.moveUp();
  }

  toString() {
    return "KEY DOWN";
  }
}

export class KeyBoard {
  private doCommands: Map<KEYS, Command> = new Map();
  private undoCommand: Command;

  constructor() {
    this.initCommands();
  }

  private initCommands() {
    const noCommand = new NoCommand();
    this.doCommands.set(KEYS.ARROW_UP, noCommand);
    this.doCommands.set(KEYS.ARROW_DOWN, noCommand);
    this.doCommands.set(KEYS.ARROW_LEFT, noCommand);
    this.doCommands.set(KEYS.ARROW_RIGHT, noCommand);
  }

  setCommand(key: KEYS, doCommand: Command) {
    this.doCommands.set(key, doCommand);
  }

  onKeyPressed(key: KEYS) {
    this.doCommands.get(key).execute();
    this.undoCommand = this.doCommands.get(key);
  }

  undoKeyPressed() {
    console.log(`Undoing ${this.undoCommand.toString()}`);
    this.undoCommand.undo();
  }

  toString() {
    console.group(`---Commands---`);
    this.doCommands.forEach(v => {
      console.log(v);
    });
    console.groupEnd();
  }
}

const pressKey: PressKey = new PressKey();
const moveUpCommand: Command = new MoveUpCommand(pressKey);
const moveDownCommand: Command = new MoveUpCommand(pressKey);
const moveLeftCommand: Command = new MoveLeftCommand(pressKey);

const keyboard = new KeyBoard();

keyboard.setCommand(KEYS.ARROW_UP, moveUpCommand);
keyboard.setCommand(KEYS.ARROW_DOWN, moveDownCommand);
keyboard.setCommand(KEYS.ARROW_LEFT, moveLeftCommand);

keyboard.toString();

keyboard.onKeyPressed(KEYS.ARROW_UP);
keyboard.undoKeyPressed();

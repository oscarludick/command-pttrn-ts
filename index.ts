export enum KEYS {
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  NO_KEY
}

export interface Command {
  execute(): void;
  undo(): KEYS;
}

export class PressKey {
  private _currentKey: KEYS = KEYS.NO_KEY;

  moveUp() {
    this._currentKey = KEYS.ARROW_UP;
    console.log("Key UP Pressed");
  }

  moveDown() {
    this._currentKey = KEYS.ARROW_DOWN;
    console.log("Key DOWN Pressed");
  }

  moveLeft() {
    this._currentKey = KEYS.ARROW_LEFT;
    console.log("Key LEFT Pressed");
  }

  moveRight() {
    this._currentKey = KEYS.ARROW_RIGHT;
    console.log("Key RIGHT Pressed");
  }

  get currentKey(): KEYS {
    return this._currentKey;
  }
}

export class NoCommand implements Command {
  execute() {}
  undo() {
    return KEYS.NO_KEY;
  }
}

export class MoveLeftCommand implements Command {
  private pressKey: PressKey;
  private previousKey: KEYS;

  constructor(pressKey: PressKey) {
    this.pressKey = pressKey;
  }

  execute() {
    this.previousKey = pressKey.currentKey;
    this.pressKey.moveLeft();
  }

  undo(): KEYS {
    return this.previousKey;
  }
}

export class MoveUpCommand implements Command {
  private pressKey: PressKey;
  private previousKey: KEYS;

  constructor(pressKey: PressKey) {
    this.pressKey = pressKey;
  }

  execute() {
    this.previousKey = pressKey.currentKey;
    this.pressKey.moveUp();
  }

  undo(): KEYS {
    return this.previousKey;
  }
}

export class MoveDownCommand implements Command {
  private pressKey: PressKey;
  private previousKey: KEYS;

  constructor(pressKey: PressKey) {
    this.pressKey = pressKey;
  }

  execute() {
    this.previousKey = pressKey.currentKey;
    this.pressKey.moveDown();
  }

  undo(): KEYS {
    return this.previousKey;
  }
}

export class KeyBoard {
  private doCommands: Map<KEYS, Command> = new Map();
  private currentCommand: Command;

  constructor() {
    this.initCommands();
  }

  private initCommands() {
    const noCommand = new NoCommand();
    this.doCommands.set(KEYS.ARROW_UP, noCommand);
    this.doCommands.set(KEYS.ARROW_DOWN, noCommand);
    this.doCommands.set(KEYS.ARROW_LEFT, noCommand);
    this.doCommands.set(KEYS.ARROW_RIGHT, noCommand);
    this.doCommands.set(KEYS.NO_KEY, noCommand);
  }

  setCommand(key: KEYS, doCommand: Command) {
    this.doCommands.set(key, doCommand);
  }

  onKeyPressed(key: KEYS) {
    this.doCommands.get(key).execute();
    this.currentCommand = this.doCommands.get(key);
  }

  undoKeyPressed() {
    const prevKey = this.currentCommand.undo();
    console.log(`Undoing...returning to key ${prevKey}`);
    this.doCommands.get(prevKey).execute();
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
const moveDownCommand: Command = new MoveDownCommand(pressKey);
const moveLeftCommand: Command = new MoveLeftCommand(pressKey);

const keyboard = new KeyBoard();

keyboard.setCommand(KEYS.ARROW_UP, moveUpCommand);
keyboard.setCommand(KEYS.ARROW_DOWN, moveDownCommand);
keyboard.setCommand(KEYS.ARROW_LEFT, moveLeftCommand);

keyboard.toString();

keyboard.onKeyPressed(KEYS.ARROW_UP);
keyboard.onKeyPressed(KEYS.ARROW_LEFT);
keyboard.undoKeyPressed();

keyboard.onKeyPressed(KEYS.ARROW_LEFT);
keyboard.onKeyPressed(KEYS.ARROW_DOWN);
keyboard.undoKeyPressed();

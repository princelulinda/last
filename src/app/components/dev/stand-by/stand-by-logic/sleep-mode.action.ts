export class ToggleSleepMode {
  static readonly type = '[toggle] Toggle sleep mode';
  constructor(
    public payload: {
      sleepMode: boolean;
    }
  ) {}
}

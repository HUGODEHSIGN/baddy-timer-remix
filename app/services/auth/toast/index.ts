export type ToastType = 'warning' | 'loading' | 'success' | 'error';
export class ToastData {
  constructor(
    public readonly id: string,
    public type?: ToastType,
    public message?: string
  ) {}

  public setType(type: ToastType) {
    this.type = type;
    return this;
  }
  public setMessage(message: string) {
    this.message = message;
    return this;
  }
}

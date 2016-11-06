export class AlertModel {
  type: string;
  message:string;

  constructor(type, message) {
    this.type = type;
    this.message = message;
  }
}

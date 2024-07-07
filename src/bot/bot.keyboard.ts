import { Markup } from 'telegraf';

export class BotKeyboard {
  static sendLocation() {
    return Markup.keyboard([
      Markup.button.locationRequest('Send location'),
    ]).resize();
  }

  static setTime() {
    return Markup.keyboard(['Set time']).resize();
  }

  static menu() {
    return Markup.keyboard(['Subscription', 'Info']).resize();
  }

  static info() {
    return Markup.keyboard([
      'Set time',
      Markup.button.locationRequest('Send location'),
      'Back',
    ]).resize();
  }
}

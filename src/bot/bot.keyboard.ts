import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Markup } from 'telegraf';

@Injectable()
export class BotKeyboard {
  constructor(private readonly userService: UserService) {}
  static sendLocation() {
    return Markup.keyboard([
      Markup.button.locationRequest('Send location'),
    ]).resize();
  }

  static setTime() {
    return Markup.keyboard(['Set time']).resize();
  }

  async menu(userId) {
    const isSubscribed = await this.userService.checkSubscription(userId);
    if (isSubscribed == undefined || !isSubscribed) {
      return Markup.keyboard(['Subscribe', 'Info']).resize();
    }
    return Markup.keyboard(['Unsubscribe', 'Info']).resize();
  }

  static info() {
    return Markup.keyboard([
      'Set time',
      Markup.button.locationRequest('Send location'),
      'Back',
    ]).resize();
  }
}

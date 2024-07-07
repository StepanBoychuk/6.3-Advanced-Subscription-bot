import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';
import { BotKeyboard } from './bot.keyboard';

@Injectable()
export class BotService {
  constructor(private userService: UserService) {}

  async locationCommand(ctx: Context) {
    const ifUserExist = await this.userService.findOne(ctx.from.id);
    const msg: any = ctx.message; //In other way Typescript doesn't see ctx.message.location field
    const updateUserData: UpdateUserDto = {
      location: {
        lat: msg.location.latitude,
        long: msg.location.longitude,
      },
    };
    if (!ifUserExist) {
      const createUserData: CreateUserDto = {
        ...updateUserData,
        userId: ctx.from.id,
      };
      await this.userService.create(createUserData);
      return {
        text: 'Your location has been saved',
        keyboard: BotKeyboard.setTime(),
      };
    }

    await this.userService.update(ctx.from.id, updateUserData);
    return {
      text: 'Your location has been updated',
      keyboard: BotKeyboard.menu(),
    };
  }

  async setTimeCommand(ctx: Context) {
    const ifUserExist = await this.userService.findOne(ctx.from.id);
    const msg: any = ctx.message; //In other way Typescript doesn't see ctx.message.location field
    const updateUserData: UpdateUserDto = {
      forecastTime: msg.text,
    };
    if (!ifUserExist) {
      const createUserData: CreateUserDto = {
        ...updateUserData,
        userId: ctx.from.id,
      };
      await this.userService.create(createUserData);
    } else {
      await this.userService.update(ctx.from.id, updateUserData);
    }
    return {
      text: `Your daily forecast is set for ${msg.text}`,
      keyboard: BotKeyboard.menu(),
    };
  }

  async infoCommand(ctx: Context) {
    const user = await this.userService.findOne(ctx.from.id);
    if (!user) {
      return {
        text: `You didn't leave any information`,
        keyboard: null,
      };
    }
    let isSubscribed = 'You are subscribed to daily forecast';
    if (user.isSubscribed == false) {
      isSubscribed = 'You are not subscribed to daily forecast';
    }
    const response = `Here is information about you:\n
    Location:
    Latitude: ${user?.location?.lat}
    Longitude: ${user?.location?.long}\n
    Daily forecast time: ${user.forecastTime}\n
    ${isSubscribed}`;
    return {
      text: response,
      keyboard: BotKeyboard.info(),
    };
  }

  async subscriptionCommand(ctx: Context) {
    const user = await this.userService.findOne(ctx.from.id);
    if (!user?.location?.lat || !user.forecastTime) {
      return {
        text: 'Set your location and daily forecast time first',
        keyboard: null,
      };
    }
    await this.userService.subscription(ctx.from.id);
    const response = user.isSubscribed
      ? 'You successfully unsubscribed'
      : 'You successfully subscribed';
    return {
      text: response,
      keyboard: BotKeyboard.menu(),
    };
  }
}

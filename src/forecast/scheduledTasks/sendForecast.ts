import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { ForecastService } from '../forecast.service';

@Injectable()
export class SendForecast {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    @InjectModel('User') private readonly userModel: mongoose.Model<User>,
    private readonly forecastService: ForecastService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendForecast() {
    const currentTime = new Date()
      .toLocaleTimeString('en-US', {
        hour12: false,
      })
      .slice(0, 5);
    const users = await this.userModel.find({ forecastTime: currentTime });
    if (users[0]) {
      users.forEach(async (user) => {
        const response = await this.forecastService.weatherForecasResponse(
          user.location.lat,
          user.location.long,
        );
        await this.bot.telegram.sendMessage(user.userId, response);
      });
    }
  }
}

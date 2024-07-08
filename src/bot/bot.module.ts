import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { ForecastService } from 'src/forecast/forecast.service';
import { BotKeyboard } from './bot.keyboard';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [BotUpdate, UserService, BotService, ForecastService, BotKeyboard],
})
export class BotModule {}

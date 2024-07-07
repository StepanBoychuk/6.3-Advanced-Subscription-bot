import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { ForecastModule } from './forecast/forecast.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    BotModule,
    ForecastModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { SendForecast } from './scheduledTasks/sendForecast';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [ForecastService, SendForecast],
})
export class ForecastModule {}

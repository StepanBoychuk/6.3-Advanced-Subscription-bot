import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  userId: number;

  @Prop({
    type: {
      lat: { type: Number },
      long: { type: Number },
    },
  })
  location: {
    lat: number;
    long: number;
  };
  @Prop()
  forecastTime: string;

  @Prop({ default: false })
  isSubscribed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

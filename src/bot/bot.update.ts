import {
  Command,
  Hears,
  Help,
  InjectBot,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotService } from './bot.service';
import { BotKeyboard } from './bot.keyboard';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
    private readonly botKeyboard: BotKeyboard,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(
      'Greetings! I can send you a daily forecast every day if you subscribe to me. To get started, follow the buttons.',
      BotKeyboard.sendLocation(),
    );
  }

  @Help()
  async helpCommand(ctx: Context) {
    ctx.reply(
      `Here are list of available commands:\n - Subscription: to subscripe/unsubscribe from daily forecast.\n - Info: information about you subscription. \n - Change location button: to change location for your forecast. \n - Set time button: tip on how to set the time of the daily forecast (Just send me the message with time in hh:mm format, f.e 08:00 or 11:45)\n - /menu: Open menu keyboard`,
    );
  }

  @Command('menu')
  async openMenu(ctx: Context) {
    ctx.reply('Open menu keyboard', await this.botKeyboard.menu(ctx.from.id));
  }

  @On('location')
  async onLocation(ctx: Context) {
    const response = await this.botService.locationCommand(ctx);
    await ctx.reply(response.text, response.keyboard);
  }

  @Hears('Set time')
  async setTime(ctx: Context) {
    ctx.reply(
      'Send the time in hh:mm format (f.e. 08:00 or 10:15) at which you would like to receive the forecast',
    );
  }

  @Hears('Info')
  async info(ctx: Context) {
    const response = await this.botService.infoCommand(ctx);
    ctx.reply(response.text, response.keyboard);
  }

  @Hears('Subscribe')
  async subscribe(ctx: Context) {
    const response = await this.botService.subscriptionCommand(ctx);
    ctx.reply(response.text, response.keyboard);
  }

  @Hears('Unsubscribe')
  async unsubscribe(ctx: Context) {
    const response = await this.botService.subscriptionCommand(ctx);
    ctx.reply(response.text, response.keyboard);
  }

  @Hears('Back')
  async back(ctx: Context) {
    ctx.reply('Going back', await this.botKeyboard.menu(ctx.from.id));
  }

  @On('text')
  async onText(ctx: Context) {
    const msg: any = ctx.message;
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(msg.text)) {
      const response = await this.botService.setTimeCommand(ctx);
      ctx.reply(response.text, response.keyboard);
    } else {
      ctx.reply('Unexpected command. Try /help');
    }
  }
}

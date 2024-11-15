import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus, UsePipes } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { KindeEventData } from './dto/kinde-event.dto';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) { }

    @Post('kinde') // POST /webhook/kinde
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async handleKindeWebhook(@Body() event: KindeEventData) {
        try {
            await this.webhookService.processKindeEvent(event);
            return 'Webhook processed'
        } catch (error) {
            throw new Error('Webhook failed to process')
        }
    }
}




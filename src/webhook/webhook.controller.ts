import { Controller, Post, HttpCode, HttpStatus, BadRequestException, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) { }

    private readonly jwks = jwksClient({
        jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
    })

    private async verifyToken(token: string): Promise<any> {
        try {
            const decodedToken = jwt.decode(token, { complete: true }) as any;
            if (!decodedToken || typeof decodedToken === 'string') {
                throw new BadRequestException('Invalid token');
            }

            const { kid } = decodedToken.header;
            const publicKey = await this.jwks.getSigningKey(kid);
            const signingKey = publicKey.getPublicKey();

            return jwt.verify(token, signingKey);
        } catch (error) {
            throw new BadRequestException('Token verification failed: ${error.message}');
        }
    }


    @Post('kinde') // POST /webhook/kinde
    @HttpCode(HttpStatus.OK)
    async handleKindeWebhook(@Req() req) {

        try {
            // Check if rawBody is defined
            const rawToken = req.rawBody ? req.rawBody.toString('utf-8') : null;
            if (!rawToken) {
                console.error('rawBody is undefined or empty');
                throw new BadRequestException('Missing rawBody in request');
            }

            console.log('Webhook payload received (raw JWT):', rawToken);

            // Check token and decode
            const verifiedEvent = await this.verifyToken(rawToken);
            console.log('Token verified and decoded:', verifiedEvent);

            // Process event
            await this.webhookService.processKindeEvent(verifiedEvent);

            return { message: 'Webhook processed successfully' };
        } catch (error) {
            console.error('Error processing webhook:', error.message);
            throw new BadRequestException('Webhook failed to process');
        }
    }
}




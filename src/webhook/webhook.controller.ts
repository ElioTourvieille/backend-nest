import { Controller, Post, HttpCode, HttpStatus, BadRequestException, Req, RawBody } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import { raw } from '@prisma/client/runtime/library';

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
    async handleKindeWebhook(@Req() req: express.Request) {
        try {
          if (!req.rawBody) {
            console.error('rawBody is undefined or empty');
            throw new BadRequestException('Missing rawBody in request');
          }
      
          const rawToken = req.rawBody.toString('utf-8'); // Convertit le Buffer en chaîne
          console.log('Webhook payload received (raw JWT):', rawToken);
      
          // Vérifie et décode le JWT
          const verifiedEvent = await this.verifyToken(rawToken);
          console.log('Token verified and decoded:', verifiedEvent);
      
          // Traite l'événement
          await this.webhookService.processKindeEvent(verifiedEvent);
      
          return { message: 'Webhook processed successfully' };
        } catch (error) {
          console.error('Error processing webhook:', error.message);
          throw new BadRequestException('Webhook failed to process');
        }
      }
}




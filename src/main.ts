import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally with whitelist and transform options
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Custom middleware to handle raw JWT payloads from Kinde webhooks
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers['content-type'] === 'application/jwt') {
      const chunks: Buffer[] = [];
      // Collect chunks of data
      req.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk)); // Stock each chunk in an array
      });
      // Combine chunks into raw body when complete
      req.on('end', () => {
        req.rawBody = Buffer.concat(chunks);
        next();
      });
      // Handle any errors during body parsing
      req.on('error', (err) => {
        console.error('Error reading raw body:', err);
        res.status(500).send('Failed to read request body');
      });
    } else {
      next();
    }
  });
  
  // Parse JSON bodies for regular requests
  app.use(bodyParser.json());

  // Start the server on the specified port or default to 3001
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

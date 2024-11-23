import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers['content-type'] === 'application/jwt') {
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk)); // Stock each chunk in an array
      });
      req.on('end', () => {
        req.rawBody = Buffer.concat(chunks); // Concat each chunk to create a single Buffer
        next();
      });
      req.on('error', (err) => {
        console.error('Error reading raw body:', err);
        res.status(500).send('Failed to read request body');
      });
    } else {
      next();
    }
  });
  
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

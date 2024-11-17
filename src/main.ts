import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware to parse JSON and JWT
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const buffers: Buffer[] = [];
    req.on('data', (chunk) => buffers.push(chunk));
    req.on('end', () => {
      req.rawBody = Buffer.concat(buffers);
      next();
    });
  });
  
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

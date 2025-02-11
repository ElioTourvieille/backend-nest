import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://poker-progrid.com','https://backend-nest.fly.dev'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation pipes globally with whitelist and transform options
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Custom middleware to handle raw JWT payloads from Kinde webhooks
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.headers['content-type'] === 'application/jwt') {
      let body = '';
      req.setEncoding('utf8');
      
      req.on('data', (chunk) => {
        body += chunk;
        // Protection against excessively large payloads
        if (body.length > 1e6) req.destroy();
      });

      req.on('end', () => {
        req.rawBody = Buffer.from(body);
        next();
      });
    } else {
      next();
    }
  });
  
  // Parse JSON bodies for regular requests
  app.use(bodyParser.json());

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

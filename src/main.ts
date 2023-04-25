import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server, createServer } from 'https';
import { join } from 'path';

async function bootstrap() {
  const fs = require('fs');
  const httpsOptions = {
    key: fs.readFileSync(join(__dirname, "../../server/key.pem")),
    cert: fs.readFileSync(join(__dirname, '../../server/cert.pem'))
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions
  });

  await app.listen(3000)
}
bootstrap();
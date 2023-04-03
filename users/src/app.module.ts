import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersGateway } from './users.websocket';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService, UsersGateway],
})
export class AppModule { }

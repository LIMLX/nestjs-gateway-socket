import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway, AppService } from './app.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGateway,
    {
      provide: 'users',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: "127.0.0.1",
            port: 8888
          }
        })
      },
    }
  ],
})
export class AppModule { }

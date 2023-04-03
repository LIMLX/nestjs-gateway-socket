import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  // 创建tcp服务
  const tcpMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 8888
      }
    },
  );
  tcpMicroservice.listen()
}
bootstrap();

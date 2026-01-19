/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { PRODUCTS_PACKAGE_NAME } from '../../../types/proto/products';

async function bootstrap() {
  const tcpMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        port: 4002,
      },
    });
  const redisMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });

  const grpcMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: PRODUCTS_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/products.proto'),
      },
    });

  await Promise.all([
    //tcpMicroservice.listen(),
    redisMicroservice.listen(),
    grpcMicroservice.listen(),
  ]);
  // await app.listen();
  Logger.log(
    'Product Microservice is running on port 4002, listen to redis events'
  );
}

bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES } from './constants';
import { join } from 'path';
import { PRODUCTS_PACKAGE_NAME } from '../../../../types/proto/products';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES.PRODUCT_REDIS_CLIENT,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: MICROSERVICES.PRODUCT_GRPC_CLIENT,
        transport: Transport.GRPC,
        options: {
          package: PRODUCTS_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/products.proto'),
        },
      },
    ]),
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService],
})
export class AppModule {}

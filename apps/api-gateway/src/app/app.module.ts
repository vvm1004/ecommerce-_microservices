import { PRODUCTS_PACKAGE_NAME } from './../../../../types/proto/products';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MICROSERVICES_CLIENTS } from './constants';
import { OrdersController } from './orders/orders.controller';
import { ProductController } from './product/product.controller';
import { join } from 'path';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4003,
        },
      },
      // {
      //   name: MICROSERVICES_CLIENTS.PRODUCT_SERVICE,
      //   transport: Transport.TCP,
      //   options: {
      //     port: 4002,
      //   },
      // },
      {
        name: MICROSERVICES_CLIENTS.ORDERS_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4001,
        },
      },
      {
        name: PRODUCTS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PRODUCTS_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/products.proto'),
        },
      },
    ]),
  ],
  controllers: [AppController, OrdersController, ProductController],
  providers: [AppService],
})
export class AppModule {}

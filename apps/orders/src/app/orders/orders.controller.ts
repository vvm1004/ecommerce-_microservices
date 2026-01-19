import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { MICROSERVICES } from '../constants';
import { ProductServiceClient } from '../../../../../types/proto/products';
import { lastValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController implements OnModuleInit {
  private productGrpcService!: ProductServiceClient;

  constructor(
    @Inject(MICROSERVICES.PRODUCT_REDIS_CLIENT)
    private productRedisClient: ClientProxy,
    @Inject(MICROSERVICES.PRODUCT_GRPC_CLIENT)
    private productGrpcClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productGrpcService =
      this.productGrpcClient.getService<ProductServiceClient>('ProductService');
  }

  @MessagePattern('create_order')
  async createOrder(order: any) {
    console.log({ message: 'Order received on the Order Microservice', order });

    this.productRedisClient.emit('order.created', order);

    const product = await lastValueFrom(
      this.productGrpcService.getProduct({ productId: order.productId })
    );

    return { message: 'Order Created', order, product };
  }
}

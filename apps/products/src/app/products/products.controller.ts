import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import type {
  ProductRequest,
  ProductResponse,
  ProductServiceController,
} from '../../../../../types/proto/products';
import { Observable } from 'rxjs';

@Controller('products')
export class ProductsController implements ProductServiceController {
  @GrpcMethod('ProductService', 'getProduct')
  getProduct(
    request: ProductRequest
  ): Promise<ProductResponse> | Observable<ProductResponse> | ProductResponse {
    console.log('gRPC getProduct called with:', request);
    return {
      productId: request.productId,
      name: 'Laptop',
      price: 1000,
    };
  }

  @EventPattern('order.created')
  async updateStock(order: { id: number; productId: number }) {
    console.log('Checking stock for product', order.productId);

    console.log('Stock Updated');
  }
}

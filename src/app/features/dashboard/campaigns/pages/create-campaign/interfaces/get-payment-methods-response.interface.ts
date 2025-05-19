import {ISupportedPaymentMethod} from './supported_payment_method.interface';

export interface GetPaymentMethodsResponseInterface {
  count: number;
  next: number | undefined;
  previous: number | undefined;
  results: ISupportedPaymentMethod[];
}

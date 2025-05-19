export interface ISupportedPaymentMethod {
  id: string;
  name: string;
  description: string;
  instructions: string;
  is_active: boolean;
}

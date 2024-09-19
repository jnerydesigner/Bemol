export class CreateOrderEvent {
  constructor(
    public readonly userId: number,
    public readonly quantity: number,
    public readonly productId: number,
  ) {}
}

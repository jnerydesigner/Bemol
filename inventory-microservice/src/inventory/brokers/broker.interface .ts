export interface BrokerInterface {
    emitEvent<T>(event: string, data: T): void;
}
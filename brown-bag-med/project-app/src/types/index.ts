export interface Payment {
    id: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
}

export interface Transaction {
    id: string;
    paymentId: string;
    timestamp: Date;
    confirmationStatus: string;
}
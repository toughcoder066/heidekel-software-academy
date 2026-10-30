declare module '@paystack/inline-js' {
  export interface PaystackTransactionResponse {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
  }

  export interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    channels?: string[];
    metadata?: Record<string, any>;
    onSuccess?: (response: PaystackTransactionResponse) => void;
    onCancel?: () => void;
    onError?: (error: any) => void;
    onLoad?: (response: any) => void;
  }

  export default class Paystack {
    constructor();
    checkout(options: PaystackOptions): void;
    newTransaction(options: PaystackOptions): any;
    resumeTransaction(accessCode: string): void;
    cancelTransaction(id: string): void;
  }
}

interface ImportMetaEnv {
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import "server-only";

const API_URL = process.env.DGATEWAY_API_URL || "https://dgatewayapi.desispay.com";
const API_KEY = process.env.DGATEWAY_API_KEY || "";

export interface CollectParams {
  amount: number;
  currency: string;
  phone_number?: string;
  provider?: "iotec" | "relworx" | "stripe";
  description?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export interface CollectResponse {
  data: {
    reference: string;
    provider: string;
    provider_ref: string;
    status: string;
    amount: number;
    currency: string;
    phone_number?: string;
    raw_response: Record<string, unknown>;
    client_secret?: string;
    stripe_publishable_key?: string;
  };
  message: string;
}

export interface VerifyResponse {
  data: {
    reference: string;
    status: "pending" | "completed" | "failed";
    provider: string;
    amount: number;
    currency: string;
  };
  message: string;
}

export interface DGatewayError {
  error: {
    code: string;
    message: string;
  };
}

export async function collectPayment(
  params: CollectParams
): Promise<CollectResponse> {
  const res = await fetch(`${API_URL}/v1/payments/collect`, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      (data as DGatewayError).error?.message || "Payment collection failed"
    );
  }

  return data as CollectResponse;
}

export async function verifyTransaction(
  reference: string
): Promise<VerifyResponse> {
  const res = await fetch(`${API_URL}/v1/webhooks/verify`, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reference }),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`DGateway returned non-JSON response (status ${res.status})`);
  }

  if (!res.ok) {
    throw new Error(
      (data as DGatewayError).error?.message || `Transaction verification failed (status ${res.status})`
    );
  }

  return data as VerifyResponse;
}

// --- Disburse (Withdraw) ---

export interface DisburseParams {
  amount: number;
  currency: string;
  phone_number: string;
  provider?: "iotec" | "relworx";
  description?: string;
}

export interface DisburseResponse {
  data: {
    reference: string;
    provider: string;
    status: string;
    amount: number;
    currency: string;
  };
  message: string;
}

export async function disbursePayment(
  params: DisburseParams
): Promise<DisburseResponse> {
  const res = await fetch(`${API_URL}/v1/payments/disburse`, {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      (data as DGatewayError).error?.message || "Disbursement failed"
    );
  }

  return data as DisburseResponse;
}

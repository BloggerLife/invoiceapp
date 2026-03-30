// lib/types/user.ts
export interface UserMetrics {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalClients: number;
}

export interface UserDetailsResponse {
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string | null;
    role: string;
    status: boolean;
    isVerified: boolean;
    createdAt: Date;
    totalInvoicesCreated: number;
    subscription: {
      plan: string;
      status: string;
      currentPeriodEnd: Date | null;
    } | null;
  };
  brand: {
    id: string;
    name: string;
    logo: string | null;
    currency: string | null;
    slogan: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
    brandColor: string | null;
    thankYouMsg: string | null;
    template: string;
  } | null;
  metrics: UserMetrics;
  invoices: {
    data: Array<{
      id: string;
      invoiceNumber: string;
      invoiceDate: Date;
      dueDate: Date;
      status: string;
      totalAmount: number;
      client: {
        contactPerson: string;
        companyName: string;
      };
    }>;
    total: number;
  };
  clients: {
    data: Array<{
      id: string;
      contactPerson: string;
      companyName: string;
      email: string | null;
      phone: string | null;
      location: string | null;
      isActive: boolean;
      createdAt: Date;
      _count: {
        invoices: number;
      };
    }>;
    total: number;
  };
}

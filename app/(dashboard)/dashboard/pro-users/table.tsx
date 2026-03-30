"use client";
import React, { useState, useEffect } from "react";
import { SubscriptionPlan } from "@prisma/client";

interface ProUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: string;
  currentPlanPrice: number;
  totalSpent: number;
  totalPayments: number;
  stripeCustomerId?: string;
  joinedDate: Date;
  lastPaymentDate?: Date;
}

const ProUsersTable: React.FC = () => {
  const [users, setUsers] = useState<ProUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<SubscriptionPlan | "">("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/pro-users?page=${pagination.page}&limit=${pagination.limit}&search=${search}&plan=${planFilter}`
      );
      const data = await response.json();
      setUsers(data.users);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching pro users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, planFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePlanFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlanFilter(e.target.value as SubscriptionPlan | "");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan.toUpperCase()) {
      case "MONTHLY": return "Starter";
      case "YEARLY": return "Pro";
      default: return "Free";
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan.toUpperCase()) {
      case "MONTHLY": return "UGX 35,000/mo";
      case "YEARLY": return "UGX 75,000/mo";
      default: return "Free";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pro Users</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={planFilter}
            onChange={handlePlanFilter}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Plans</option>
            <option value="MONTHLY">Starter (UGX 35,000/mo)</option>
            <option value="YEARLY">Pro (UGX 75,000/mo)</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  {user.companyName && (
                    <div className="text-sm text-gray-500">{user.companyName}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getPlanDisplayName(user.subscriptionPlan)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getPlanPrice(user.subscriptionPlan)}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full inline-block ${
                      user.subscriptionStatus === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : user.subscriptionStatus === "TRIALING"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.subscriptionStatus.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.totalPayments} payments</div>
                  {user.lastPaymentDate && (
                    <div className="text-sm text-gray-500">Last: {formatDate(user.lastPaymentDate)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(user.totalSpent)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.joinedDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  user.subscriptionStatus === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : user.subscriptionStatus === "TRIALING"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.subscriptionStatus.toLowerCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
              <div>
                <span className="text-gray-500">Plan</span>
                <div className="font-medium text-gray-900">
                  {getPlanDisplayName(user.subscriptionPlan)} · {getPlanPrice(user.subscriptionPlan)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Total Spent</span>
                <div className="font-medium text-gray-900">{formatCurrency(user.totalSpent)}</div>
              </div>
              <div>
                <span className="text-gray-500">Payments</span>
                <div className="font-medium text-gray-900">{user.totalPayments}</div>
              </div>
              <div>
                <span className="text-gray-500">Joined</span>
                <div className="font-medium text-gray-900">{formatDate(user.joinedDate)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} users
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProUsersTable;

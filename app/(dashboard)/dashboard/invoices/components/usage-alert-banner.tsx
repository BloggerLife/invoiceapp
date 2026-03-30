"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceQuotaResponse } from "@/actions/limits";
import Link from "next/link";

interface UsageData {
  dailyLimit: number;
  hasUnlimited: boolean;
  remaining: number;
  resetTime: string;
  totalUsedToday: number;
}

export default function UsageBanner({
  usageData,
}: {
  usageData: InvoiceQuotaResponse;
}) {
  // const usageData: UsageData = {
  //   dailyLimit: 2,
  //   hasUnlimited: false,
  //   remaining: 2,
  //   resetTime: "Tue Jun 10 2025 00:00:00 GMT+0300 (East Africa Time)",
  //   totalUsedToday: 0,
  // };

  const { dailyLimit, hasUnlimited, remaining, resetTime, totalUsedToday } =
    usageData;

  // Calculate usage percentage
  const usagePercentage = hasUnlimited
    ? 0
    : (totalUsedToday / dailyLimit) * 100;

  // Format reset time
  const resetDate = new Date(resetTime);
  const timeUntilReset = resetDate.getTime() - Date.now();
  const hoursUntilReset = Math.ceil(timeUntilReset / (1000 * 60 * 60));

  // Determine alert variant based on usage
  const getAlertVariant = () => {
    if (hasUnlimited) return "default";
    if (remaining === 0) return "destructive";
    if (remaining <= dailyLimit * 0.2) return "destructive";
    if (remaining <= dailyLimit * 0.5) return "default";
    return "default";
  };

  const getStatusColor = () => {
    if (hasUnlimited) return "text-blue-600";
    if (remaining === 0) return "text-red-600";
    if (remaining <= dailyLimit * 0.2) return "text-orange-600";
    if (remaining <= dailyLimit * 0.5) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (usagePercentage >= 80) return "bg-red-500";
    if (usagePercentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Alert variant={getAlertVariant()} className="w-full max-w-2xl">
      <Zap className="h-4 w-4" />
      <AlertDescription className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Usage Status</span>
              <span className={`text-sm font-semibold ${getStatusColor()}`}>
                {hasUnlimited
                  ? "Unlimited"
                  : `${remaining} of ${dailyLimit} remaining`}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {hasUnlimited
                ? "You have unlimited usage"
                : `You've used ${totalUsedToday} out of ${dailyLimit} invoices today`}
            </div>
          </div>
        </div>

        {!hasUnlimited && (
          <div className="space-y-2">
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Resets in {hoursUntilReset} hours (
                {resetDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
                )
              </span>
            </div>
          </div>
        )}
        {!hasUnlimited && remaining <= dailyLimit * 0.5 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              Need more invoices?
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href="/pricing" className="text-xs">
                Upgrade Plan
              </Link>
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

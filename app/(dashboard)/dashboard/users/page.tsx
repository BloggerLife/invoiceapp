// Your courses page
import { getAllUsers } from "@/actions/users";
import { Suspense } from "react";

import { TableLoading } from "@/components/ui/data-table";
import UsersTableListing from "@/components/dashboard/UsersTableListing";

// Create an async component for data fetching
async function StudentListingWithData() {
  const users = (await getAllUsers()) || [];

  return (
    <UsersTableListing
      title={`Users (${users.length})`}
      subtitle="Manage Users"
      users={users}
    />
  );
}

export default function Courses() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <StudentListingWithData />
      </Suspense>
    </div>
  );
}

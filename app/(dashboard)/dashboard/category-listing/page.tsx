import CategoryListing, {
  CategoryWithDepartment,
  Department,
} from "@/components/Lists/CategoryListing";

export default function Categories() {
  const categories: CategoryWithDepartment[] = [];
  const departments: Department[] = [];
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <CategoryListing
        departments={departments}
        title="Categories"
        subtitle="Manage Categories"
        categories={categories}
      />
    </div>
  );
}

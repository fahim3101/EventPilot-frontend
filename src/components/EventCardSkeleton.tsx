export default function EventCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton w-full h-40 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

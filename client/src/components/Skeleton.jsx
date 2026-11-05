import "../assets/css/skeleton.css";

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-shimmer skeleton-image" />
      <div className="skeleton-shimmer skeleton-line" style={{ width: "70%" }} />
      <div className="skeleton-shimmer skeleton-line" style={{ width: "40%" }} />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
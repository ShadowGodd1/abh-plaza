import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-gold">404</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink mb-3">Page not found</h1>
        <p className="text-sm text-muted mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="btn-primary inline-flex items-center"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

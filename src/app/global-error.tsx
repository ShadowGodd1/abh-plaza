"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, sans-serif", backgroundColor: "#F7F4ED", margin: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "12px", backgroundColor: "#FBECEC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px", color: "#B53A3A" }}>!</span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#181818", marginBottom: "8px" }}>Something went wrong</h2>
          <p style={{ fontSize: "14px", color: "#5E5A52", marginBottom: "24px", maxWidth: "400px" }}>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 24px",
              backgroundColor: "#C89B4A",
              color: "#111315",
              border: "none",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

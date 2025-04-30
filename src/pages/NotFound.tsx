import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-white">
      <img
        src="/savvy/savvy_lost.svg"
        alt="Savvy lost"
        className="w-40 h-40 animate-bounce-slow mb-6"
      />
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        Oops! This page doesn't exist.
      </h1>
      <p className="text-muted-foreground mb-6">
        Looks like Savvy took a wrong turn. Let’s head back to safety.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
      >
        Back to Home
      </Link>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-bounce-slow {
          animation: bounce 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

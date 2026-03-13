import React from "react";
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import Button from "./Button";

/**
 * Used as the `errorElement` in React Router v6 routes.
 * Catches both loader/action errors (RouteErrorResponse) and unexpected render errors.
 */
const RouterErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let status: number | null = null;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = "Page not found";
      message = "The page you're looking for doesn't exist or has been moved.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        {status === 404 ? (
          <svg
            className="h-10 w-10 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-10 w-10 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        )}
      </div>

      {status && (
        <p className="mb-2 text-5xl font-extrabold text-gray-300 dark:text-gray-700">
          {status}
        </p>
      )}
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      <p className="mb-8 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
        {message}
      </p>

      <div className="flex gap-3">
        <Button variant="ghost" size="md" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate("/")}>
          Home
        </Button>
      </div>
    </div>
  );
};

export default RouterErrorBoundary;

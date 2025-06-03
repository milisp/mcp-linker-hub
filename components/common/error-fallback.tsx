export const ErrorFallback = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😵</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Servers
          </h3>
          <p className="text-gray-600 mb-6">
            Something went wrong while loading the servers. Please try again.
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
};

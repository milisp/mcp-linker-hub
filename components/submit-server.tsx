export function SubmitSection() {
  return (
    <section
      id="submit"
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Share Your MCP Server</h2>
        <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
          Built something amazing? Share it with the community and help others
          discover your MCP server.
        </p>
        <button
          onClick={() => alert("Submit server form would appear here.")} // Replace with actual form/modal
          className="px-8 py-3 rounded-lg text-lg font-medium bg-white text-indigo-600 hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
        >
          Submit Your Server
        </button>
      </div>
    </section>
  );
}

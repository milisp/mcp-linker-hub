import { Database, Eye, Github, Lock, Shield, Trash2 } from "lucide-react";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Shield className="w-16 h-16 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-600">
                        Your privacy matters to us. Here's how we protect your data.
                    </p>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium inline-block mt-4">
                        Effective Date: June 3, 2025
                    </div>
                </div>

                {/* Content Cards */}
                <div className="space-y-8">
                    {/* What We Collect */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <Database className="w-8 h-8 text-green-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">What We Collect</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="border-l-4 border-green-400 pl-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Favorite Servers</h3>
                                <p className="text-gray-600">
                                    When you mark servers as favorites, this information is synced to our cloud service 
                                    to ensure availability across your devices.
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-400 pl-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Server Configurations</h3>
                                <p className="text-gray-600">
                                    Save at localstorage.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What We Don't Collect */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <Eye className="w-8 h-8 text-red-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">What We Don't Collect</h2>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <p className="text-gray-700">
                                        We do <strong>not</strong> collect personal identity data (such as your name, 
                                        email, or IP address), unless you explicitly sign in to a linked cloud account.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-red-500 mr-2 mt-1">•</span>
                                    <p className="text-gray-700">
                                        We do <strong>not</strong> share your data with any third-party services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How Data Is Stored */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <Lock className="w-8 h-8 text-purple-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">How Your Data Is Stored</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <h3 className="font-semibold text-purple-800 mb-3">Secure Storage</h3>
                                <p className="text-gray-700">
                                    All synced data is stored securely and is accessible only to you via your account.
                                </p>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <h3 className="font-semibold text-purple-800 mb-3">Security Measures</h3>
                                <p className="text-gray-700">
                                    We take reasonable security measures to protect your information from unauthorized access.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Your Control */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <Trash2 className="w-8 h-8 text-orange-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Your Control</h2>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                    <p className="text-gray-700">
                                        You can delete your cloud-synced data at any time.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                    <p className="text-gray-700">
                                        Local configurations are always available offline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                        <div className="text-center">
                            <Github className="w-12 h-12 mx-auto mb-4 opacity-90" />
                            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
                            <p className="text-blue-100 mb-6">
                                If you have questions about this privacy policy, please contact us via our GitHub issues page.
                            </p>
                            <a 
                                href="https://github.com/milisp/mcp-linker/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <Github className="w-5 h-5 mr-2" />
                                Visit GitHub Issues
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-500">
                        © 2025 MCP-Linker. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
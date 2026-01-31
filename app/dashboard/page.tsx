import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
    const user = await currentUser();

    return (
        <div className="min-h-screen bg-black text-white mt-25">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome back, {user?.firstName || 'User'}! 👋
                        </h1>
                        <p className="text-gray-400">
                            Ready to build some amazing agents?
                        </p>
                    </div>

                </div>

                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-600 transition-all">
                        <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Create New Agent</h3>
                        <p className="text-gray-400 text-sm">Start building your logic-driven agent from scratch</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-600 transition-all">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">My Agents</h3>
                        <p className="text-gray-400 text-sm">View and manage your existing agents</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-600 transition-all">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                        <p className="text-gray-400 text-sm">Track performance and usage metrics</p>
                    </div>
                </div>

                {/* User Info */}
                <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-4">Account Information</h2>
                    <div className="space-y-2 text-gray-400">
                        <p><span className="text-white font-medium">Email:</span> {user?.emailAddresses[0]?.emailAddress}</p>
                        <p><span className="text-white font-medium">User ID:</span> {user?.id}</p>
                        <p><span className="text-white font-medium">Joined:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

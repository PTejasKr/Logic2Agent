import React from 'react'

function Dashboard() {
    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Logic2Agent</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your AI agents, data, and account settings from this dashboard.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Agents</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-600">5</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active agents</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Sources</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">12</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connected sources</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
                    <p className="text-3xl font-bold mt-2 text-yellow-600">24</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completed today</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Credits</h3>
                    <p className="text-3xl font-bold mt-2 text-purple-600">1,250</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Remaining credits</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">New agent created</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Created "Customer Support Bot" 2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Data synced</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Synced CRM data successfully 4 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Performance boost</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Improved response time by 25% yesterday</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
import React from 'react'
import { Scissors } from 'lucide-react'

function MyAgents() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Scissors className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Weather Agent</h3>
                <p className="text-xs text-gray-500">2 days ago</p>
            </div>
        </div>
    )
}

export default MyAgents

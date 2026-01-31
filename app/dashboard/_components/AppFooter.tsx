import React from 'react';

function AppFooter() {
    return (
        <footer className="py-6 px-8 border-t bg-white dark:bg-gray-900">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} Logic2Agent. All rights reserved.
                    </p>
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                        Terms
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;
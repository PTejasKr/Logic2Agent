"use client";

import React from 'react'
import ChatUI from './_components/ChatUI'
import Header from '../../_component/Header'
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function PreviewAgent() {
    const { agentId } = useParams();
    const agentData = useQuery(api.agent.getAgentById, { agentId: agentId as string });

    return (
        <div className='h-screen flex flex-col bg-white dark:bg-gray-950'>
            <Header agentName={agentData?.name} agentId={agentId as string} />
            <div className='flex-1 flex overflow-hidden'>
                {/* Main Preview Area */}
                <div className='flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden'>
                    <div className='text-center space-y-4'>
                        <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
                            <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin' />
                        </div>
                        <h2 className='text-xl font-semibold text-gray-400'>Preview Workspace</h2>
                        <p className='text-sm text-gray-500 max-w-xs mx-auto'>
                            This is where your agent's generated interface will appear. Use the chat panel to interact with it.
                        </p>
                    </div>

                    {/* Background Decorative Elements */}
                    <div className='absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none'>
                        <div className='absolute inset-0' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    </div>
                </div>

                {/* Chat Panel - Right Side */}
                <div className='w-[400px] h-full flex flex-col border-l border-gray-200 dark:border-gray-800 shadow-2xl z-10'>
                    <ChatUI />
                </div>
            </div>
        </div>
    )
}

export default PreviewAgent
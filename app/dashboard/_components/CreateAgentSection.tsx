import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

function CreateAgentSection() {
    return (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
            <h2 className='font-bold text-3xl mb-2 text-white'>Create AI Agent</h2>
            <p className='text-md text-gray-400 mb-8'>Build a AI Agent workflow with custom logic and tools</p>
            <Button size={'lg'} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                <Plus /> Create Agent
            </Button>
        </div>
    )
}

export default CreateAgentSection

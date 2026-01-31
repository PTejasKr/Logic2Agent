import React from 'react'
import CreateAgentSection from './_components/CreateAgentSection'
import AiAgentTab from './_components/AiAgentTab'

function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center w-full mt-0 p-4">
            <CreateAgentSection />
            <div className="w-full relative overflow-hidden">
                <AiAgentTab />


                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
            </div>

        </div>
    )
}

export default Dashboard
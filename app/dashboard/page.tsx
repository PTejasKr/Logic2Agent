import React from 'react'
import CreateAgentSection from './_components/CreateAgentSection'
import AiAgentTab from './_components/AiAgentTab'

function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center w-full mt-20 p-4">
            <CreateAgentSection />
            <div className="w-full">
                <AiAgentTab />
            </div>
        </div>
    )
}

export default Dashboard
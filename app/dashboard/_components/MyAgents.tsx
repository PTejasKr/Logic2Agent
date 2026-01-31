"use client";
import React, { useContext, useEffect, useState } from 'react'
import { GitBranch, Trash2 } from 'lucide-react'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import moment from 'moment';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner';

function MyAgents() {
    const { userDetail } = useContext(UserDetailContext);
    const convex = useConvex();
    const deleteAgentMutation = useMutation(api.agent.deleteAgent);
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (userDetail) {
            GetUserAgents();
        }
    }, [userDetail]);

    const GetUserAgents = async () => {
        if (!userDetail?._id) return;
        const result = await convex.query(api.agent.getAgentList, { userId: userDetail?._id });
        setAgentList(result);
    }

    const handleDeleteAgent = async () => {
        if (!deleteId) return;

        try {
            // @ts-ignore
            await deleteAgentMutation({ agentId: deleteId });
            toast.success("Agent deleted successfully");
            GetUserAgents(); // Refresh list
        } catch (error) {
            toast.error("Failed to delete agent");
            console.error(error);
        } finally {
            setDeleteId(null);
        }
    }

    return (
        <div className="mt-5">
            {agentList && agentList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {agentList.map((agent: Agent, index: number) => (
                        <div key={index} className="group relative border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                            <Link href={'/agent-builder/' + agent.agentId} className='block p-5'>
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                                    <GitBranch className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                                <p className="text-xs text-gray-500">{moment(agent._creationTime).fromNow()}</p>
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // @ts-ignore
                                    setDeleteId(agent._id);
                                }}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 mt-5">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <GitBranch className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No agents found</h3>
                    <p className="text-gray-500 mt-1">Create your first AI agent to get started</p>
                </div>
            )}

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your agent and remove its data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            onClick={() => setDeleteId(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAgent}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                        >
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyAgents

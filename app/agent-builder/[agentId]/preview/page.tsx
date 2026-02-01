"use client";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Code2, Loader2, RefreshCw, Send, SquareArrowOutUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';

interface ChatMessage {
    role: 'user' | 'agent' | 'system';
    content: string;
    id: string;
}
import { api } from '@/convex/_generated/api';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import Custom Nodes
import StartNode from '../../_component/StartNode';
import AgentNode from '../../_component/AgentNode';
import EndNode from '../../_component/EndNode';
import IfElseNode from '../../_component/IfElseNode';
import WhileNode from '../../_component/WhileNode';
import UserApprovalNode from '../../_component/UserApprovalNode';
import ApiNode from '../../_component/ApiNode';
import { PublishModal } from './_components/PublishModal';

const nodeTypes = {
    StartNode,
    AgentNode,
    EndNode,
    IfElseNode,
    WhileNode,
    UserApprovalNode,
    ApiNode
};

function PreviewAgent() {
    const { agentId } = useParams();
    const router = useRouter();
    const agentData = useQuery(api.agent.getAgentById, { agentId: agentId as string });
    // ⚙️ Store generated workflow config
    const [config, setConfig] = React.useState<any>();
    // 🤖 Store AI Generated Tool Config
    const [toolConfig, setToolConfig] = React.useState<any>();

    // 💬 Chat State
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // 🦾 Convex mutation to save config
    const updateAgent = useMutation(api.agent.UpdateAgentDetail);

    // 🔄 Reboot state
    const [isRebooting, setIsRebooting] = React.useState(false);

    // � Publish Modal State
    const [isPublishModalOpen, setIsPublishModalOpen] = React.useState(false);

    // �📜 Auto-scroll to bottom of chat
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 🧩 Generate workflow once agent data is loaded
    React.useEffect(() => {
        if (agentData) {
            GenerateWorkflow()
        }
    }, [agentData])

    // 🚀 Generate Tool Config once workflow config is ready
    React.useEffect(() => {
        if (config && !toolConfig) {
            GenerateToolConfig(config)
        }
    }, [config])

    // 📡 Call API to generate tool config
    const GenerateToolConfig = async (inputConfig: any, silent = true) => {
        if (!silent) setIsRebooting(true);
        try {
            const result = await fetch('/api/generate-agent-tool-config', {
                method: 'POST',
                body: JSON.stringify({ jsonConfig: inputConfig }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const text = await result.text();

            if (!result.ok) {
                const errData = text ? JSON.parse(text) : { error: 'Unknown Error' };
                toast.error(`Reboot Failed: ${errData.error || result.statusText}`);
                setIsRebooting(false);
                return null;
            }

            if (!text) {
                console.error(`API Error (${result.status}): Empty response body`);
                return null;
            }

            try {
                const data = JSON.parse(text);
                console.log("🤖 AI Tool Config:", data);

                if (data._fallback) {
                    toast.info("Groq limit reached. Using OpenAI safety net for configuration.");
                }

                setToolConfig(data);

                // 💾 Save to DB if manually triggered
                if (!silent && agentData?._id) {
                    await updateAgent({
                        id: agentData._id,
                        agentToolConfig: data
                    });
                }
                return data;
            } catch (err) {
                console.error("Failed to parse JSON. Raw Text:", text);
                return null;
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            return null;
        } finally {
            if (!silent) setIsRebooting(false);
        }
    }

    // 🔄 Manual Reboot Handler
    const handleReboot = async () => {
        if (config) {
            await GenerateToolConfig(config, false);
        }
    }

    // 📩 Send Message Logic
    const handleSendMessage = async () => {
        if (!userInput.trim() || !toolConfig) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: userInput
        };

        setMessages(prev => [...prev, userMsg]);
        setUserInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat-with-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    toolConfig: toolConfig
                })
            });

            const data = await response.json();

            if (data._fallback) {
                toast.info("Groq limit reached. Switched to OpenAI for this response.");
            }

            if (data.reply) {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'agent',
                    content: data.reply
                }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: "Error: Failed to get response from agent."
            }]);
        } finally {
            setIsTyping(false);
        }
    }

    // ⚙️ Generate workflow config (node/edge relationship)
    const GenerateWorkflow = () => {
        if (!agentData) return;

        // 🧩 Build Edge Map for quick source → target lookup
        const edgeMap = (agentData?.edges || [])?.reduce((acc: any, edge: any) => {
            if (!acc[edge.source]) acc[edge.source] = [];
            acc[edge.source].push(edge);
            return acc;
        }, {});

        // 🔄 Build flow array by mapping each node
        const flow = (agentData?.nodes || [])?.map((node: any) => {
            const connectedEdges = edgeMap[node.id] || [];
            let next: any = null;

            switch (node.type) {
                // Compass Conditional branching node with "if" and "else"
                case "IfElseNode": {
                    const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
                    const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");

                    next = {
                        if: ifEdge?.target || null,
                        else: elseEdge?.target || null,
                    };
                    break;
                }

                // Brain Agent or AI Node
                case "AgentNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    } else if (connectedEdges.length > 1) {
                        next = connectedEdges.map((e: any) => e.target);
                    }
                    break;
                }

                // Link API Call Node
                case "ApiNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    }
                    break;
                }

                // Check User Approval Node (manual checkpoint)
                case "UserApprovalNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    }
                    break;
                }

                // Rocket Start Node
                case "StartNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    }
                    break;
                }

                // Flag End Node
                case "EndNode": {
                    next = null; // No next node
                    break;
                }

                // Wrench Default handling for any unknown node type
                default: {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    } else if (connectedEdges.length > 1) {
                        next = connectedEdges.map((e: any) => e.target);
                    }
                    break;
                }
            }

            // Brick Return a simplified node configuration
            return {
                id: node.id,
                type: node.type,
                label: node.data?.label || node.type,
                settings: node.data || {},
                next,
            };
        });

        // Target Find the Start Node
        const startNode = agentData?.nodes?.find((n: any) => n.type === "StartNode");

        // Brick Final Config structure
        const config = {
            startNode: startNode?.id || null,
            flow,
        };

        console.log("✅ Generated Workflow Config:", config);
        setConfig(config);
    }

    return (
        <div className='h-screen w-full flex flex-col bg-white dark:bg-gray-950'>
            {/* Header */}
            <div className='h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6'>
                {/* Left: Back Navigation */}
                <div className='flex items-center gap-4'>
                    <Link href={`/agent-builder/${agentId}`} className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'>
                        <ChevronLeft className='w-6 h-6' />
                    </Link>
                    <h1 className='text-xl font-bold'>{agentData?.name || 'Loading...'}</h1>
                </div>

                {/* Right: Actions */}
                <div className='flex items-center gap-3'>
                    <Button
                        variant='outline'
                        onClick={handleReboot}
                        disabled={isRebooting || !config}
                        className='gap-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                    >
                        <RefreshCw className={`w-4 h-4 ${isRebooting ? 'animate-spin' : ''}`} />
                        {isRebooting ? 'Rebooting...' : 'Reboot Agent'}
                    </Button>

                    <Button
                        variant='ghost'
                        onClick={() => setIsPublishModalOpen(true)}
                        className='gap-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all'
                    >
                        <Code2 className='w-4 h-4' />
                        Code
                    </Button>

                    <Link href={`/agent-builder/${agentId}`}>
                        <Button className='gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium shadow-sm'>
                            <X className='w-4 h-4' />
                            Close preview
                        </Button>
                    </Link>

                    <Button
                        onClick={() => setIsPublishModalOpen(true)}
                        className='gap-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium shadow-sm active:scale-95 transition-all'
                    >
                        Publish
                    </Button>
                </div>
            </div>

            {/* Publish Modal */}
            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                toolConfig={toolConfig}
                agentName={agentData?.name || "AI Agent"}
            />

            {/* Preview Content Area - 3:2 Split */}
            <div className='flex-1 flex overflow-hidden'>
                {/* Left Side: Graph (60%) */}
                <div className='flex-[3] relative border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'>
                    {agentData ? (
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={agentData.nodes || []}
                                edges={agentData.edges || []}
                                nodeTypes={nodeTypes}
                                nodesDraggable={true}
                                nodesConnectable={false}
                                elementsSelectable={false}
                                fitView
                                proOptions={{ hideAttribution: true }}
                            >
                                <Background color='#333' variant={'dots' as any} gap={20} size={1} />
                                <Controls className='bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' />
                                <MiniMap
                                    style={{
                                        backgroundColor: '#0a0a0a',
                                        borderRadius: '8px',
                                        border: '1px solid #333'
                                    }}
                                    maskColor="rgba(0, 0, 0, 0.1)"
                                    nodeColor={(n) => {
                                        if (n.type === 'StartNode') return '#3b82f6';
                                        if (n.type === 'AgentNode') return '#10b981';
                                        if (n.type === 'ApiNode') return '#f59e0b';
                                        return '#888';
                                    }}
                                />
                            </ReactFlow>
                        </ReactFlowProvider>
                    ) : (
                        <div className='flex items-center justify-center h-full'>
                            <div className='animate-pulse flex flex-col items-center gap-2'>
                                <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
                                <p className='text-gray-400 font-medium'>Loading Agent...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Chat UI (40%) */}
                <div className='flex-[2] bg-white dark:bg-gray-950 flex flex-col relative overflow-hidden'>
                    {/* Chat Header */}
                    <div className='p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                            <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Agent Active</span>
                        </div>
                        {toolConfig && (
                            <span className='text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full font-medium'>
                                Groq Powered
                            </span>
                        )}
                    </div>

                    {/* Message Area */}
                    <div
                        ref={scrollRef}
                        className='flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800'
                    >
                        {messages.length === 0 && (
                            <div className='h-full flex flex-col items-center justify-center text-center p-8'>
                                <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
                                    <Send className='w-8 h-8 text-gray-300' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200 mb-1'>Ready to assist</h3>
                                <p className='text-sm text-gray-500 max-w-[200px]'>
                                    Send a message to start interacting with your AI agent.
                                </p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-black text-white rounded-tr-none'
                                        : msg.role === 'system'
                                            ? 'bg-red-50 text-red-600 border border-red-100 italic'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className='flex justify-start'>
                                <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm'>
                                    <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className='p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950'>
                        <div className='relative flex items-center gap-2'>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={!toolConfig ? "Analyzing workflow..." : "Ask your agent anything..."}
                                disabled={!toolConfig || isTyping}
                                className='flex-1 h-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all'
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!toolConfig || isTyping || !userInput.trim()}
                                className='absolute right-2 w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-black'
                            >
                                {isTyping ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
                            </button>
                        </div>
                        <p className='text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest font-bold opacity-60'>
                            Agent Preview Instance
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewAgent
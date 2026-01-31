"use client";
import React from 'react'
import Header from '../_component/Header'
import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, reconnectEdge, useReactFlow, ReactFlowProvider, Panel, useOnSelectionChange } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import StartNode from '../_component/StartNode';
import AgentNode from '../_component/AgentNode';
import EndNode from '../_component/EndNode';
import IfElseNode from '../_component/IfElseNode';
import WhileNode from '../_component/WhileNode';
import UserApprovalNode from '../_component/UserApprovalNode';
import ApiNode from '../_component/ApiNode';
import ToolPanel from '../_component/ToolPanel';
import SettingPannel from '../_component/SettingPannel';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { UpdateAgentDetail } from '@/convex/agent';

const initialNodes = [
    { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Node 1' }, type: 'StartNode' },
    { id: 'n2', position: { x: 400, y: 100 }, data: { label: 'Node 2' }, type: 'AgentNode' },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const nodeTypes = {
    StartNode: StartNode,
    AgentNode: AgentNode,
    EndNode: EndNode,
    IfElseNode: IfElseNode,
    WhileNode: WhileNode,
    UserApprovalNode: UserApprovalNode,
    ApiNode: ApiNode
};

function AgentBuilderPage() {
    return (
        <ReactFlowProvider>
            <AgentBuilderContent />
        </ReactFlowProvider>
    );
}

function AgentBuilderContent() {
    const { agentId } = useParams();
    const agentData = useQuery(api.agent.getAgentById, { agentId: agentId as string });
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [isMounted, setIsMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const UpdateAgentDetail = useMutation(api.agent.UpdateAgentDetail);
    const edgeReconnectSuccessful = useRef(true);

    const [selectedNode, setSelectedNode] = useState<any>(null);

    useOnSelectionChange({
        onChange: ({ nodes }) => {
            const node = nodes[0];
            if (node) {
                // Ensure selected is true for verification
                const nodeWithSelection = { ...node, selected: true };
                console.log("Selected Node:", nodeWithSelection);
                setSelectedNode(nodeWithSelection);
            } else {
                setSelectedNode(null);
            }
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);


    // useEffect(() => {
    //     if (isMounted && agentData?._id) {
    //         SaveNodesAndEdges();
    //     }
    // }, [nodes, edges, agentData]);


    const SaveNodesAndEdges = async () => {
        if (!agentData?._id) return;
        setIsSaving(true);
        try {
            const result = await UpdateAgentDetail({
                id: agentData._id,
                nodes,
                edges,
            });
            toast.success("Flow saved successfully!");
            console.log(result);
        } catch (error) {
            toast.error("Failed to save flow");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => {
            const updatedEdges = addEdge(params, eds);
            console.log(updatedEdges);
            return updatedEdges;
        }),
        [setEdges]
    );

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_: any, edge: any) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    return (
        <div className='h-screen flex flex-col'>
            <Header agentName={agentData?.name} />
            <div className='flex-1 flex w-full overflow-hidden'>
                <ToolPanel />
                <div className='flex-1 h-full relative'>
                    {isMounted ? (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            deleteKeyCode={['Backspace', 'Delete']}
                            fitView
                            colorMode='system'
                            nodeTypes={nodeTypes}
                        >
                            <MiniMap />
                            <Background />
                            <Controls />
                            <Panel position="top-right">
                                <button
                                    onClick={SaveNodesAndEdges}
                                    disabled={isSaving}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md transition-colors disabled:bg-blue-400 flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                </button>
                            </Panel>
                        </ReactFlow>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-500 font-medium">Loading workspace...</p>
                        </div>
                    )}
                    <SettingPannel selectedNode={selectedNode} setNodes={setNodes} onSave={SaveNodesAndEdges} />
                </div>
            </div>
        </div >
    )
}

export default AgentBuilderPage;

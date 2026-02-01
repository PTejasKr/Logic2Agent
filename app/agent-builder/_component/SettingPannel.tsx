"use client";

import { Separator } from '@radix-ui/react-separator';
import { MousePointer2, Settings2, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface SettingPannelProps {
    selectedNode: any;
    setNodes: any;
    onSave: () => void;
    agentName?: string;
}

function SettingPannel({ selectedNode, setNodes, onSave, agentName }: SettingPannelProps) {
    const [inputs, setInputs] = useState<any>({});

    useEffect(() => {
        console.log("SettingPannel Received Node:", selectedNode);
        if (selectedNode) {
            const initialData = { ...selectedNode.data };
            // Default name to agentName if not present
            if (!initialData.name && agentName) {
                initialData.name = agentName;
            }
            setInputs(initialData);
        }
    }, [selectedNode, agentName]);

    const handleInputChange = (key: string, value: any) => {
        const newInputs = { ...inputs, [key]: value };
        setInputs(newInputs);
        setNodes((nodes: any) =>
            nodes.map((node: any) =>
                node.id === selectedNode.id
                    ? { ...node, data: newInputs }
                    : node
            )
        );
    };

    if (!selectedNode || selectedNode.type === 'StartNode') {
        return null;
    }

    return (
        <div className='absolute top-14 right-0 bottom-0 z-20 w-[350px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl'>
            {/* Header */}
            <div className='p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm'>
                <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 p-2 rounded-lg'>
                        <Settings2 className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                        <h2 className='font-bold text-gray-800 dark:text-gray-200'>{selectedNode.type} Settings</h2>
                        <p className='text-xs text-gray-400'>ID: {selectedNode.id}</p>
                    </div>
                </div>
            </div>

            {/* Content - Generic Settings for All Nodes */}
            <div className='flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800'>
                <div className='space-y-6'>

                    {/* Common Settings: Name & Instructions (Available for all or specific ones? Let's keep for all as base) */}
                    {/* EndNode Specific Settings */}
                    {selectedNode.type === 'EndNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Choose the workflow output</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Output</label>
                                <textarea
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[100px] font-mono'
                                    value={inputs.output || ''}
                                    onChange={(e) => handleInputChange('output', e.target.value)}
                                    placeholder='{name:string}'
                                />
                            </div>
                        </div>
                    )}

                    {/* IfElseNode Specific Settings */}
                    {selectedNode.type === 'IfElseNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Create conditions to branch your workflow</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>If</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm'
                                    value={inputs.condition || ''}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    placeholder="Enter condition e.g output=='any condition'"
                                />
                            </div>
                        </div>
                    )}

                    {/* WhileNode Specific Settings */}
                    {selectedNode.type === 'WhileNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Loop your logic</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>while</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm'
                                    value={inputs.condition || ''}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    placeholder="Enter condition e.g output=='any condition'"
                                />
                            </div>
                        </div>
                    )}

                    {/* UserApprovalNode Specific Settings */}
                    {selectedNode.type === 'UserApprovalNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Pause for a human to approve or reject a step</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm'
                                    value={inputs.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Name"
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Message</label>
                                <textarea
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[100px] resize-none'
                                    value={inputs.message || ''}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    placeholder="Describe the message to show to the user"
                                />
                            </div>
                        </div>
                    )}

                    {/* ApiNode Specific Settings */}
                    {selectedNode.type === 'ApiNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Call an external API endpoint with your chosen method</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm'
                                    value={inputs.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder='API Agent Name'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Request Method</label>
                                <select
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm'
                                    value={inputs.method || 'GET'}
                                    onChange={(e) => handleInputChange('method', e.target.value)}
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>API URL</label>
                                <input
                                    type="url"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-mono'
                                    value={inputs.url || ''}
                                    onChange={(e) => handleInputChange('url', e.target.value)}
                                    placeholder='https://api.example.com/data'
                                />
                            </div>

                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Include API Key</label>
                                <div
                                    className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${inputs.includeApiKey ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    onClick={() => handleInputChange('includeApiKey', !inputs.includeApiKey)}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${inputs.includeApiKey ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>

                            {inputs.includeApiKey && (
                                <div className='space-y-4 animate-in fade-in slide-in-from-top-2 duration-200'>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>API Key Parameter Name</label>
                                        <input
                                            type="text"
                                            className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-mono'
                                            value={inputs.apiKeyParamName || 'key'}
                                            onChange={(e) => handleInputChange('apiKeyParamName', e.target.value)}
                                            placeholder='e.g., key, appid, token'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>API Key Value</label>
                                        <input
                                            type="password"
                                            className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-mono'
                                            value={inputs.apiKey || ''}
                                            onChange={(e) => handleInputChange('apiKey', e.target.value)}
                                            placeholder='Enter API Key'
                                        />
                                    </div>
                                </div>
                            )}

                            {inputs.method === 'POST' && (
                                <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                                    <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Body Parameters (JSON)</label>
                                    <textarea
                                        className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[100px] font-mono'
                                        value={inputs.bodyParams || ''}
                                        onChange={(e) => handleInputChange('bodyParams', e.target.value)}
                                        placeholder='{ "param1": "value1", "param2": "value2" }'
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Common Settings: Name & Instructions - HIDE for EndNode, IfElseNode, WhileNode, UserApprovalNode AND ApiNode */}
                    {selectedNode.type !== 'EndNode' && selectedNode.type !== 'IfElseNode' && selectedNode.type !== 'WhileNode' && selectedNode.type !== 'UserApprovalNode' && selectedNode.type !== 'ApiNode' && (
                        <>
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm'
                                    value={inputs.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder={`e.g., AI Trip Planner`}
                                />
                            </div>


                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Instructions</label>
                                <textarea
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[100px] resize-none'
                                    value={inputs.instructions || ''}
                                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                                    placeholder='Instructions or Description'
                                />
                            </div>

                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Include chat history</label>
                                <div
                                    className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${inputs.includeChatHistory ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    onClick={() => handleInputChange('includeChatHistory', !inputs.includeChatHistory)}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${inputs.includeChatHistory ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Model</label>
                                <select
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none'
                                    value={inputs.model || 'llama-3.3-70b-versatile'}
                                    onChange={(e) => handleInputChange('model', e.target.value)}>
                                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Restored)</option>
                                    <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
                                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                                </select>
                            </div>

                            <div className='space-y-4'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 block'>Output Format</label>

                                <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit'>
                                    <button
                                        onClick={() => handleInputChange('outputFormat', 'text')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${inputs.outputFormat === 'text' || !inputs.outputFormat
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Text
                                    </button>

                                    <button
                                        onClick={() => handleInputChange('outputFormat', 'json')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${inputs.outputFormat === 'json'
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Json
                                    </button>
                                </div>

                                {inputs.outputFormat === 'json' && (
                                    <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                                        <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Enter Json Schema</label>
                                        <textarea
                                            className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[50px] font-mono'
                                            value={inputs.jsonSchema || ''}
                                            onChange={(e) => handleInputChange('jsonSchema', e.target.value)}
                                            placeholder='{ title: "string" }'
                                        />
                                    </div>
                                )}

                                {inputs.outputFormat === 'text' && (
                                    <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                                        <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Output</label>
                                        <textarea
                                            className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[50px] font-mono'
                                            value={inputs.jsonSchema || ''}
                                            onChange={(e) => handleInputChange('jsonSchema', e.target.value)}
                                            placeholder='Output will be texted here'
                                        />
                                    </div>
                                )}


                            </div>
                        </>
                    )}

                    <button
                        onClick={() => {
                            const saveData = {
                                name: inputs.name,
                                instructions: inputs.instructions,
                                includeChatHistory: inputs.includeChatHistory,
                                model: inputs.model || 'llama-3.3-70b-versatile',
                                outputFormat: inputs.outputFormat || 'text',
                                jsonSchema: inputs.jsonSchema,
                                ...inputs // include any other dynamic keys
                            };

                            console.log("--- Saving Node Settings ---");
                            console.log("Node ID:", selectedNode.id);
                            console.log("Model Selected:", saveData.model);
                            console.log("Output Format:", saveData.outputFormat);
                            console.log("Schema:", saveData.jsonSchema);
                            console.log("Full Saved Data:", saveData);

                            toast.success("Settings saved ");
                            // Trigger Database Save
                            onSave();
                        }}
                        className='w-full bg-black text-white hover:bg-gray-800 p-3 rounded-xl font-medium transition-colors'
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm'>
                <button
                    onClick={() => {
                        setNodes((nds: any) => nds.filter((n: any) => n.id !== selectedNode.id));
                        toast.success("Node deleted");
                    }}
                    className='w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all text-sm font-semibold'
                >
                    <Trash2 className='w-4 h-4' />
                    Delete Node
                </button>
            </div>
        </div>
    )
}

export default SettingPannel
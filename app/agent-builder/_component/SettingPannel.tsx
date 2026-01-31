"use client";

import { Separator } from '@radix-ui/react-separator';
import { MousePointer2, Settings2, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface SettingPannelProps {
    selectedNode: any;
    setNodes: any;
    onSave: () => void;
}

function SettingPannel({ selectedNode, setNodes, onSave }: SettingPannelProps) {
    const [inputs, setInputs] = useState<any>({});

    useEffect(() => {
        console.log("SettingPannel Received Node:", selectedNode);
        if (selectedNode) {
            setInputs(selectedNode.data);
        }
    }, [selectedNode]);

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

    if (!selectedNode) {
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

                    {/* Node Specific Settings */}
                    {selectedNode.type === 'ApiNode' && (
                        <>
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>API URL</label>
                                <input
                                    type="url"
                                    className='w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-mono'
                                    value={inputs.url || ''}
                                    onChange={(e) => handleInputChange('url', e.target.value)}
                                    placeholder='https://api.example.com/v1/...'
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Method</label>
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
                        </>
                    )}

                    {/* Common Agent Settings (likely relevant for AgentNode, maybe others but user asked for "same panels") */}
                    {/* Render these for AgentNode or *all* if the user really wants uniform AI settings everywhere. 
                        Let's render them for AgentNode OR if the user wants them broadly. 
                        Given "all agent tools should have same setting pannels", I'll include them but maybe logically it applies to Agent. 
                        Let's include them for ALL for now as per previous instruction, but AFTER the specific fields.
                    */}

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
                            value={inputs.model || 'gpt-4'}
                            onChange={(e) => handleInputChange('model', e.target.value)}>
                            <option value="gemini-flash-1.5">Gemini Flash 1.5</option>
                            <option value="gemini-pro-1.5">Gemini Pro 1.5</option>
                            <option value="gemini-pro-2.0">Gemini Pro 2.0</option>
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

                    <button
                        onClick={() => {
                            const saveData = {
                                name: inputs.name,
                                instructions: inputs.instructions,
                                includeChatHistory: inputs.includeChatHistory,
                                model: inputs.model || 'gpt-4',
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
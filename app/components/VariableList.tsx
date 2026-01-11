'use client';

import React, { useRef, useState } from 'react';
import { usePLC } from './PlcContext';

export const VariableList: React.FC = () => {
    const { variables, selectedVars, toggleVariableSelection, isRunning } = usePLC();
    const prevVariablesRef = useRef(variables);
    const [error, setError] = useState<string | null>(null);

    // Freeze values if Load Stop
    const displayedVars = isRunning ? variables : prevVariablesRef.current;


    if (isRunning) prevVariablesRef.current = variables;
    const handleSelect = (name: string) => {
        const isSelected = selectedVars.includes(name);

        if (!isSelected && selectedVars.length >= 4) {
            setError('You can monitor a maximum of 4 variables at a time.');
            return;
        }

        setError(null);
        toggleVariableSelection(name);
    };


    return (
        <div className="flex flex-col h-full w-full">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                PLC VARIABLES
            </h2>
            {/* Error message */}
            {error && (
                <div className="mb-2 px-2 py-1 text-xs text-red-700 bg-red-100 rounded border border-red-200">
                    {error}
                </div>
            )}
            <div className="flex flex-col gap-1">
                {displayedVars.map((v) => (
                    <div
                        key={v.name}
                        onClick={() => handleSelect(v.name)}
                        className={`
              flex justify-between items-center
              px-3 py-2 rounded-md cursor-pointer
              text-sm font-medium
              transition-colors duration-150
              ${selectedVars.includes(v.name)
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
            `}
                    >
                        <span className="truncate">{v.name}</span>
                        <span className="text-xs font-mono opacity-80">
                            {typeof v.value === 'number'
                                ? v.value.toFixed(2)
                                : v.value
                                    ? 'ON'
                                    : 'OFF'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

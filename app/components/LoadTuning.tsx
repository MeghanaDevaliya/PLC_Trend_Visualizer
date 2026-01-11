import React from "react";
import { usePLC } from "./PlcContext";

export const LoadTuning: React.FC = () => {
  const { frequency, setFrequency, isRunning, setIsRunning } = usePLC();

  const onToggleLoad = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="p-3 border rounded w-[400px] bg-white">
      <h2 className="font-bold mb-3">Load Tuning</h2>

      {/* select frequency from dropdown */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm">Simulation Frequency:</span>
        <select
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={2}>Low (2 Hz)</option>
          <option value={10}>Medium (10 Hz)</option>
          <option value={20}>High (20 Hz)</option>
        </select>
      </div>

     
      <div style={{ marginBottom: 8 }}>
        <button
          onClick={onToggleLoad}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            background: isRunning ? '#d62728' : '#2ca02c',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
          }}
        >
          {isRunning ? 'Load Stop' : 'Load Start'}
        </button>
      </div>
    </div>
  );
};

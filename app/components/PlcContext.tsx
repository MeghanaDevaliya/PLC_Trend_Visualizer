'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type VarType = 'BOOL' | 'INT' | 'REAL';

export interface PLCVariable {
  name: string;
  type: VarType;
  value: boolean | number;
}

interface ContextType {
  variables: PLCVariable[];
  selectedVars: string[];
  toggleVariableSelection: (name: string) => void;
  frequency: number;
  setFrequency: (freq: number) => void;
  plcStream$: Observable<{ timestamp: number; variables: PLCVariable[] }>;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
}

const PLCContext = createContext<ContextType | undefined>(undefined);

export const PLCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const displayVariable: { name: string; type: VarType }[] = [
    { name: 'Main_Limit_Switch', type: 'BOOL' },
    { name: 'Safety_Alarm', type: 'BOOL' },
    { name: 'Motor_Start', type: 'BOOL' },
    { name: 'BOOL_4', type: 'BOOL' },
    { name: 'MotorSpeed', type: 'INT' },
    { name: 'CycleTime', type: 'INT' },
    { name: 'Setpoint_X', type: 'INT' },
    { name: 'Temp_Sensor_1', type: 'REAL' },
    { name: 'PowerUsage', type: 'REAL' },
    { name: 'Pressure_Sensor_1', type: 'REAL' },
    { name: 'Flow_Rate', type: 'REAL' },
    { name: 'Level_Sensor', type: 'REAL' },
    { name: 'Humidity', type: 'REAL' },
    { name: 'FlowRate', type: 'REAL' },
    { name: 'Temp_Sensor_3', type: 'REAL' },
    
  ];

  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<number>(20);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // This state is ONLY updated when isRunning === true
  const [variables, setVariables] = useState<PLCVariable[]>(
    displayVariable.map(v => ({ ...v, value: v.type === 'BOOL' ? false : 0 }))
  );

  const toggleVariableSelection = (name: string) => {
    setSelectedVars(prev => {
      if (prev.includes(name)) return prev.filter(v => v !== name);
      if (prev.length >= 4) return prev;
      return [...prev, name];
    });
  };

  // RxJS emits live PLC variable values
  const plcStream$: Observable<{ timestamp: number; variables: PLCVariable[] }> = interval(
    1000 / frequency
  ).pipe(
    map(() => {
      const t = Date.now();
      const updatedVars: PLCVariable[] = displayVariable.map((v, idx) => {
        if (v.type === 'BOOL') return { ...v, value: Math.random() > 0.5 };
        if (v.type === 'INT') return { ...v, value: Math.floor(Math.random() * 100) };
        if (v.type === 'REAL') {
          const base = 50 + 20 * Math.sin(t / 1000 + idx);
          return { ...v, value: base + Math.random() * 2 - 1 };
        }
        return { ...v, value: 0 };
      });
      return { timestamp: t, variables: updatedVars };
    })
  );


  useEffect(() => {
    const sub = plcStream$.subscribe(({ variables: incoming }) => {
      if (!isRunning) return; // Freeze UI
      setVariables(incoming);   // Only updates when isRunning === true
    });
    return () => sub.unsubscribe();
  }, [plcStream$, isRunning]);

  return (
    <PLCContext.Provider
      value={{
        variables,
        selectedVars,
        toggleVariableSelection,
        frequency,
        setFrequency,
        plcStream$,
        isRunning,
        setIsRunning,
      }}
    >
      {children}
    </PLCContext.Provider>
  );
};

export const usePLC = () => {
  const context = useContext(PLCContext);
  if (!context) throw new Error('not valid');
  return context;
};

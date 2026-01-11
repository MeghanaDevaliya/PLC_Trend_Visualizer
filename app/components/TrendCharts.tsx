'use client';
import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { usePLC } from './PlcContext';
import { Subscription } from 'rxjs';

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#dc2626'];
const MAX_POINTS = 50;

export const TrendChart: React.FC = () => {
    const { selectedVars, plcStream$, frequency,isRunning  } = usePLC();
    const chartRef = useRef<HighchartsReact>(null);
    const bufferRef = useRef<Record<string, [number, number][]>>({});

    const prevSelectedRef = useRef<string[]>([]);

    // Initialize buffers for selected variables
    useEffect(() => {
        selectedVars.forEach((v) => {
            if (!bufferRef.current[v]) bufferRef.current[v] = [];
        });
    }, [selectedVars]);

    // Subscribe to live stream
    useEffect(() => {
        if (!isRunning || selectedVars.length === 0) return;
      
        const subscription: Subscription = plcStream$.subscribe(
          ({ timestamp, variables }) => {
            const chart = chartRef.current?.chart;
            if (!chart) return;
      
            selectedVars.forEach((vName, idx) => {
              const variable = variables.find(v => v.name === vName);
              if (!variable) return;
      
              const y = Number(variable.value);
              const buf = bufferRef.current[vName] ?? [];
              buf.push([timestamp, y]);
              if (buf.length > MAX_POINTS) buf.shift();
              bufferRef.current[vName] = buf;
      
              const series = chart.series.find(s => s.name === vName);
      
              if (series) {
                series.addPoint([timestamp, y], false, series.data.length >= MAX_POINTS);
              } else {
                chart.addSeries(
                  {
                    name: vName,
                    data: buf,
                    color: COLORS[idx % COLORS.length],
                    step: variable.type === 'BOOL' ? 'left' : undefined,
                
                  },
                  false
                );
              }
            });
      
            const windowMs = MAX_POINTS * (1000 / frequency);
            chart.xAxis[0].setExtremes(timestamp - windowMs, timestamp, false, false);
      
            chart.redraw(false);
          }
        );
      
        return () => {
          subscription.unsubscribe(); 
        };
      }, [plcStream$, selectedVars, frequency, isRunning]);
      

    useEffect(() => {
        const chart = chartRef.current?.chart;
        if (!chart) return;
      
        prevSelectedRef.current
          .filter((name) => !selectedVars.includes(name))
          .forEach((name) => {
            chart.series.find((s) => s.name === name)?.remove(false);
            delete bufferRef.current[name];
          });
      
        prevSelectedRef.current = selectedVars;
        chart.redraw();
      }, [selectedVars]);

    if (!selectedVars.length)
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                Select variables to view trends
            </div>
        );

    return <HighchartsReact highcharts={Highcharts} options={{
        chart: {
            type: 'line', 
            animation: false,
            width: 880,
            height: 460,
            
        },
        title: {
            text: '',
          },
        legend: {
            align: 'center',
            layout: 'horizontal',
            itemStyle: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              width: 120,
            }}

    }} ref={chartRef} />;
};

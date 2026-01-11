'use client'
import React from "react";
import { PLCProvider } from "./PlcContext";
import { VariableList } from "../components/VariableList";
import { TrendChart } from "../components/TrendCharts";
import { LoadTuning } from "../components/LoadTuning";

const Dashboard: React.FC = () => {
    return (
        <PLCProvider>
            <div className="p-6 bg-gray-50 min-h-screen overflow-hidden">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    PLC Variable Trend Visualizer
                </h1>

                {/* MAIN LAYOUT */}
                <div className="flex flex-col lg:flex-row gap-6 w-full overflow-hidden">


                    <div className="  w-[280px] min-w-[280px] max-w-[280px]  bg-white shadow-md rounded-lg p-4
                               h-[600px]  flex flex-col "  >


                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto pr-2">
                            <VariableList />
                        </div>
                    </div>


                    {/* RIGHT PANEL */}
                    <div className="flex flex-col gap-6 flex-1 min-w-0 overflow-hidden">

                        <div
                            className="
                              bg-white shadow-md rounded-lg p-4
                              w-[900px] min-w-[900px] max-w-[900px]
                              h-[520px]
                              overflow-hidden
                            "
                        >
                            <h2 className="font-semibold text-lg mb-2 text-gray-700">
                                Real-Time Trend Chart
                            </h2>

                            <div className="w-full h-full overflow-hidden">
                                <TrendChart />
                            </div>
                        </div>


                        <div
                            className="
                              bg-white shadow-md rounded-lg p-4
                              w-[900px] min-w-[900px] max-w-[900px]
                              overflow-hidden
                            "
                        >
                            <LoadTuning />
                        </div>
                    </div>
                </div>
            </div>
        </PLCProvider>
    );
};

export default Dashboard;

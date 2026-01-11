# PLC Variable Trend Visualizer

A real-time variable trend visualizer for industrial PLC systems built using Next.js, React, RxJS, and Highcharts. This tool allows automation engineers to monitor live PLC variables, debug control logic, and tune system performance.


# Setup and run instructions
1. Clone the repository :

bash /cmd
git clone https://github.com/MeghanaDevaliya/PLC_Trend_Visualizer.git
cd plc-trend-visualizer

2. Install dependencies:
npm install

Run the development server:
3.npm run dev

4.Open your browser at http://localhost:3000
 to access the application.

5. output 
 # Architecture Decisions & Performance Optimizations
Next.js with React -  responsive SPA experience.

RxJS - simulating PLC data streams .

Context API manages state (variables, selectedVars, isRunning, frequency) and updates efficiently.

TrendChart subscription -  updates chart when isRunning === true, reducing unnecessary re-renders 

# Chart Rendering Approach
Highcharts (SVG) is used for trend visualization.

Reason for SVG over Canvas:
SVG allows interactive elements, tooltips, legends, and axis labels with minimal configuration.

The dataset is relatively small (50 points per variable, max 4 variables), so SVG performs well.
 

 # Component Structure & Separation of Concerns

PlcContext.tsx
Manages data stream, live variables, selected variables, and load state.

VariableList.tsx
Displays variable names and live values. Handles selection and error messages.

TrendChart.tsx
Subscribes to PLC stream and plots selected variables.

LoadTuning.tsx
Provides a single Load Start / Stop button and frequency controls.

  output file- screenshot of the output.

# Any known limitations or trade-offs

-SVG may become less efficient for thousands of data points.
-more varaible selection may degrade UI performance. 
-after page refresh trend data will be lost as its not stored.



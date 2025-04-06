import React, { useEffect } from "react";
const Plotly = window.Plotly;






export function ParetoChart({ feasibleOutcomes, paretoFrontier }) {
  useEffect(() => {
    const feasibleX = feasibleOutcomes.map((o) => o.utilityHR);
    const feasibleY = feasibleOutcomes.map((o) => o.utilityEmployee);

    const paretoX = paretoFrontier.map((o) => o.utilityHR);
    const paretoY = paretoFrontier.map((o) => o.utilityEmployee);
    // console.log("Feasible Outcomes:", feasibleOutcomes);
    // console.log("Pareto Frontier:", paretoFrontier);
    
    const data = [
      {
        x: feasibleX,
        y: feasibleY,
        mode: "markers",
        type: "scatter",
        name: "Feasible Outcomes",
        marker: { color: "blue", size: 8 },
      },
      {
        x: paretoX,
        y: paretoY,
        mode: "markers",
        type: "scatter",
        name: "Pareto Frontier",
        marker: { color: "red", size: 10 },
      }
    //   ,
    //   {
    //     x: [negotiatedX],
    //     y: [negotiatedY],
    //     mode: "markers",
    //     type: "scatter",
    //     name: "Negotiated Agreement",
    //     marker: { color: "green", size: 14, symbol: "star" },
    //   },
    ];

    const layout = {
      title: "Pareto Frontier and Negotiated Agreement",
      xaxis: { title: "Utility for HR" },
      yaxis: { title: "Utility for Employee" },
      showlegend: true,
    };

    Plotly.newPlot("paretoChart", data, layout);
  }, [feasibleOutcomes, paretoFrontier]);

  return <div id="paretoChart" style={{ width: "200%", height: "600px" }}></div>;
}

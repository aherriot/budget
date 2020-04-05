import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js";

const TransactionsChart = ({
  accounts,
  transactions,
  onSelectAccount,
  activeTabId
}) => {
  const distinctMonths = new Set();
  transactions.data.forEach(row => {
    const date = new Date(row.inDate);
    const yearMonth =
      date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
    distinctMonths.add(yearMonth);
  });

  console.log(distinctMonths);

  useEffect(() => {
    const chartContext = document.getElementById("chart");
    const chart = new Chart(chartContext, {
      type: "bar",
      data: {
        labels: Array.from(distinctMonths),
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3]
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }, []);

  return (
    <div>
      <canvas id="chart" />
    </div>
  );
};

TransactionsChart.propTypes = {
  acccounts: PropTypes.object.isRequired,
  transactions: PropTypes.object.isRequired,
  onSelectAccount: PropTypes.func.isRequired,
  activeTabId: PropTypes.string.isRequired
};

export default TransactionsChart;

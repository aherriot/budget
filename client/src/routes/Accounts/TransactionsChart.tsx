import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Chart from "chart.js";

interface Props {
  accountId: string;
  // onSelectAccount: (id: string) => void;
}

const TransactionsChart = ({ accountId }: Props) => {
  // const dispatch = useDispatch();
  const transactions = useSelector((state) => state.data.transactions);

  const distinctMonths = useMemo(() => new Set<string>(), []);
  transactions.data.forEach((row) => {
    const date = new Date(row.inDate);
    const yearMonth =
      date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
    distinctMonths.add(yearMonth);
  });

  useEffect(() => {
    const chartContext = document.getElementById("chart") as HTMLCanvasElement;
    new Chart(chartContext, {
      type: "bar",
      data: {
        labels: Array.from(distinctMonths),
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }, [distinctMonths]);

  return (
    <div>
      <canvas id="chart" />
    </div>
  );
};

export default TransactionsChart;

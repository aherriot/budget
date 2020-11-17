import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Chart from "chart.js";

interface Props {
  accountId: string;
}

const TransactionsChart = ({ accountId }: Props) => {
  const chartContextRef = useRef<HTMLCanvasElement>(null);
  const transactions = useSelector((state) => state.data.transactions);
  const accounts = useSelector((state) => state.data.accounts);
  const accountsView = useSelector((state) => state.routes.accounts);

  useEffect(() => {
    let chart: Chart;
    if (chartContextRef.current === null) {
      return;
    }

    const firstMonth = moment(accountsView.dateRange[0]).startOf("month");
    const lastMonth = moment(accountsView.dateRange[1]).startOf("month");

    const months: string[] = [];
    const distinctAccounts = new Set<string>();
    const amounts: Record<string, Record<string, number>> = {};
    let month = firstMonth;

    while (month <= lastMonth) {
      const monthAsString = month.format("YYYY-MM");
      months.push(monthAsString);
      amounts[monthAsString] = {};
      month.add(1, "month");
    }

    transactions.data.forEach((row) => {
      const inMonth = moment(row.inDate).startOf("month");
      const outMonth = moment(row.outDate).startOf("month");
      if (row.inAmount) {
        distinctAccounts.add(row.inAccount);
        if (amounts[inMonth.format("YYYY-MM")][row.inAccount] == null) {
          amounts[inMonth.format("YYYY-MM")][row.inAccount] = 0;
        }
        amounts[inMonth.format("YYYY-MM")][row.inAccount] += row.inAmount;
      }
      if (row.outAmount) {
        distinctAccounts.add(row.outAccount);
        if (amounts[inMonth.format("YYYY-MM")][row.outAccount] == null) {
          amounts[inMonth.format("YYYY-MM")][row.outAccount] = 0;
        }
        amounts[outMonth.format("YYYY-MM")][row.outAccount] -= row.outAmount;
      }
    });

    const accountsAsArray = Array.from(distinctAccounts);

    chart = new Chart(chartContextRef.current, {
      type: "bar",
      data: {
        labels: months,
        datasets: accountsAsArray.map((accountId, index) => {
          return {
            label: accounts.byId[accountId].name,
            data: Object.values(amounts).map(
              (amount) => amount[accountId] / 100
            ),
            backgroundColor: getColor(
              index / Math.max(1, accountsAsArray.length - 1)
            ),
            hoverBackgroundColor: getColor(
              index / Math.max(1, accountsAsArray.length - 1)
            ),
          };
        }),
      },
      options: {
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [accounts, accountsView.dateRange, transactions]);

  return <canvas id="chart" ref={chartContextRef} />;
};

/**
 *
 * @param val A number from 0 to 1
 * @return string hsl value that works well when paired with other outputs
 * If you pass invoke this with uniformly distributed values, it will give you a visually pleasing colour
 */
function getColor(val: number): string {
  // hue slowly rises towards 1
  const hue = Math.floor(val * 200 + 200) % 360;

  // saturation is a quadratic function that bottoms out in the middle
  const saturation = 150 * ((val - 0.3) * (val - 0.3)) + 28;

  // lightness slowly descends
  const light = 60 - val * 10;

  return `hsl(${hue}, ${saturation}%, ${light}%)`;
}

export default TransactionsChart;

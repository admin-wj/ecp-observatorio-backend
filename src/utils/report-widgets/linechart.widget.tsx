import { FC } from 'react';

import { DataEntry } from '../types';

interface LineChartProps {
  id: string;
  data: DataEntry[];
  xlabel: string;
  ylabel: string;
}

export const LineChartWidget: FC<LineChartProps> = async ({
  id,
  data,
  xlabel,
  ylabel,
}) => {
  const { ChartJSNodeCanvas } = await import('chartjs-node-canvas');

  const width = 800;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const chartConfig: any = {
    type: 'line',
    data: {
      labels: data.map((entry) => entry.x),
      datasets: Object.keys(data[0] || {})
        .filter((key) => key === id)
        .map((key) => ({
          label: key,
          data: data.map((entry) => entry[key]),
          borderColor: '#C4D600',
          fill: 'rgba(196, 214, 0, 0.7)',
        })),
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: xlabel,
          },
        },
        y: {
          title: {
            display: true,
            text: ylabel,
          },
        },
      },
    },
  };
  const image = await chartJSNodeCanvas.renderToDataURL(chartConfig);

  return <img src={image} alt="Line Chart" />;
};

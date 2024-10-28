import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

interface ChartComponentProps {
  applicationData: { [key: string]: number };
  financeData: { approved: number; rejected: number; total: number };
}

const ChartComponent: React.FC<ChartComponentProps> = ({ applicationData, financeData }) => {
  const barData = {
    labels: Object.keys(applicationData),
    datasets: [
      {
        label: 'Antall Søknader per Type',
        data: Object.values(applicationData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Godkjente Summer', 'Avslåtte Summer', 'Totale Søknader'],
    datasets: [
      {
        label: 'Finansiell Status',
        data: [financeData.approved, financeData.rejected, financeData.total],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container">
      <h2 className='mb-8 mt-12'>Oversikt over Søknadstyper</h2>
      <div className="chart-wrapper">
        <Bar data={barData} options={chartOptions} />
      </div>

      <h2 className="mt-6 mb-8">Finansiell Oversikt</h2>
      <div className="chart-wrapper">
        <Pie data={pieData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartComponent;
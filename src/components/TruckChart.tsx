
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface TruckData {
  id: string;
  vehicle?: string;
  hire?: number;
  expense?: number;
  trips?: number;
  fuel?: number;
  bata?: number;
  maintenance?: number;
  holding?: number;
  unloading?: number;
  toll?: number;
  rto?: number;
  misc?: number;
  balance?: number;
  datetime: string;
  dateAdded: string;
}

interface TruckChartProps {
  trucks: TruckData[];
}

const TruckChart: React.FC<TruckChartProps> = ({ trucks }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (trucks.length === 0) {
      return;
    }

    // Prepare data for income vs expenses analysis
    const labels = trucks.map(truck => truck.vehicle || `Truck ${truck.id.slice(0, 8)}`);
    const incomeData = trucks.map(truck => truck.hire || 0);
    const expenseData = trucks.map(truck => 
      (truck.expense || 0) + (truck.fuel || 0) + (truck.bata || 0) + 
      (truck.maintenance || 0) + (truck.holding || 0) + (truck.unloading || 0) + 
      (truck.toll || 0) + (truck.rto || 0) + (truck.misc || 0)
    );

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income (Hire)',
            data: incomeData,
            backgroundColor: 'hsla(120, 70%, 60%, 0.8)',
            borderColor: 'hsla(120, 70%, 60%, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Total Expenses',
            data: expenseData,
            backgroundColor: 'hsla(0, 70%, 60%, 0.8)',
            borderColor: 'hsla(0, 70%, 60%, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#374151'
            }
          },
          title: {
            display: true,
            text: 'Income vs Expenses Analysis',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#1f2937'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (₹)',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#6b7280'
            },
            grid: {
              color: '#e5e7eb'
            },
            ticks: {
              color: '#6b7280',
              callback: function(value) {
                return '₹' + Number(value).toLocaleString();
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Vehicles',
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#6b7280'
            },
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [trucks]);

  if (trucks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg font-medium">No data to display</p>
          <p className="text-sm">Add truck entries to see the financial analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TruckChart;

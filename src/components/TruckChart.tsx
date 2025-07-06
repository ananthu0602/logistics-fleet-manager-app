
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface TruckData {
  id: string;
  vin: string;
  model: string;
  year: number;
  capacity: number;
  charges: number;
  notes: string;
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

    // Prepare data for the chart
    const modelCapacityMap = new Map<string, number>();
    trucks.forEach(truck => {
      const currentCapacity = modelCapacityMap.get(truck.model) || 0;
      modelCapacityMap.set(truck.model, currentCapacity + truck.capacity);
    });

    const labels = Array.from(modelCapacityMap.keys());
    const data = Array.from(modelCapacityMap.values());

    // Generate colors
    const backgroundColors = labels.map((_, index) => {
      const hue = (index * 137.5) % 360; // Golden angle for color distribution
      return `hsla(${hue}, 70%, 60%, 0.8)`;
    });

    const borderColors = backgroundColors.map(color => 
      color.replace('0.8)', '1)')
    );

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Capacity (tons)',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
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
            text: 'Fleet Capacity by Model',
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
              text: 'Capacity (tons)',
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
              color: '#6b7280'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Truck Models',
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
              color: '#6b7280',
              maxRotation: 45
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
          <p className="text-sm">Add trucks to see the capacity analysis</p>
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

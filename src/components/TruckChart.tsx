
import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface TruckData {
  id: string;
  vehicleNumber?: string;
  driver?: string;
  datetime: string;
  serviceCost?: number;
  maintenanceCost?: number;
  fuelCost?: number;
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

    // Prepare data for cost analysis chart
    const costTypes = ['Service Cost', 'Maintenance Cost', 'Fuel Cost'];
    const totalServiceCost = trucks.reduce((sum, truck) => sum + (truck.serviceCost || 0), 0);
    const totalMaintenanceCost = trucks.reduce((sum, truck) => sum + (truck.maintenanceCost || 0), 0);
    const totalFuelCost = trucks.reduce((sum, truck) => sum + (truck.fuelCost || 0), 0);
    
    const data = [totalServiceCost, totalMaintenanceCost, totalFuelCost];

    // Generate colors
    const backgroundColors = [
      'hsla(210, 70%, 60%, 0.8)', // Blue for service
      'hsla(30, 70%, 60%, 0.8)',  // Orange for maintenance
      'hsla(0, 70%, 60%, 0.8)'    // Red for fuel
    ];

    const borderColors = [
      'hsla(210, 70%, 60%, 1)',
      'hsla(30, 70%, 60%, 1)',
      'hsla(0, 70%, 60%, 1)'
    ];

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: costTypes,
        datasets: [{
          label: 'Total Cost ($)',
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
            text: 'Fleet Cost Breakdown',
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
              text: 'Total Cost ($)',
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
                return '$' + Number(value).toLocaleString();
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Cost Types',
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
          <p className="text-sm">Add truck entries to see the cost analysis</p>
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

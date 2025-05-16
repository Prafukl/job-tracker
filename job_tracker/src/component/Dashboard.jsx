import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import "../Dashboard.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const stats = {
  total: 1200,
  pending: 300,
  interviews: 150,
  offers: 75,
  responseRate: 85,
  rejectionRate: 15,
  source: "LinkedIn",
  avgTime: "24h",
  thisMonth: 200,
  monthlyData: [120, 150, 180, 200, 220, 250, 300, 280, 260, 240, 230, 200],
  statusDist: { Pending: 300, Interview: 150, Offer: 75, Rejected: 675 },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Dashboard = () => {
  const barData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Applications",
        data: stats.monthlyData,
        backgroundColor: "#4f46e5",
        borderRadius: 6,
        barThickness: 28,
        hoverBackgroundColor: "#6366f1",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(stats.statusDist),
    datasets: [
      {
        data: Object.values(stats.statusDist),
        backgroundColor: [
          "#f59e0b", // yellow
          "#4f46e5", // indigo
          "#10b981", // green
          "#ef4444", // red
        ],
        hoverBackgroundColor: [
          "#fbbf24", // lighter yellow
          "#6366f1", // lighter indigo
          "#34d399", // lighter green
          "#f87171", // lighter red
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const statCards = [
    { label: "Total Applications", value: stats.total, icon: "📋" },
    { label: "Pending Applications", value: stats.pending, icon: "⏳" },
    { label: "Interviews", value: stats.interviews, icon: "💼" },
    { label: "Offers", value: stats.offers, icon: "🎉" },
    { label: "Response Rate", value: `${stats.responseRate}%`, icon: "📨" },
    { label: "Rejection Rate", value: `${stats.rejectionRate}%`, icon: "❌" },
    { label: "Most Active Source", value: stats.source, icon: "🔍" },
    { label: "Avg. Response Time", value: stats.avgTime, icon: "⏱️" },
    { label: "This Month's Applications", value: stats.thisMonth, icon: "📅" },
  ];

  return (
    <div className="dashboard-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-header"
      >
        <h1 className="dashboard-title">📊 Dashboard Overview</h1>
        <p className="dashboard-subtitle">Track your job application progress and insights</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="stats-grid"
      >
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={fadeIn}
            className="stat-card"
            whileHover={{ scale: 1.03 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <h3 className="stat-label">{stat.label}</h3>
            <p className="stat-value">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="charts-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3 className="chart-title">Monthly Applications</h3>
            <span className="chart-subtitle">2023 Application Trend</span>
          </div>
          <div className="chart-wrapper">
            <Bar 
              data={barData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    backgroundColor: '#1e293b',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                  },
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    grid: {
                      color: '#e2e8f0',
                    },
                    ticks: {
                      color: '#64748b'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: '#64748b'
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3 className="chart-title">Application Status</h3>
            <span className="chart-subtitle">Distribution by current status</span>
          </div>
          <div className="chart-wrapper">
            <Doughnut 
              data={pieData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                  tooltip: {
                    backgroundColor: '#1e293b',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                  },
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle',
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
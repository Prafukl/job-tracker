import React, { useState, useEffect } from "react";
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
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

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
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviews: 0,
    offers: 0,
    responseRate: 0,
    rejectionRate: 0,
    source: "N/A",
    avgTime: "N/A",
    thisMonth: 0,
    monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    statusDist: { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) {
        // Set default stats for non-authenticated users
        setStats({
          total: 0,
          pending: 0,
          interviews: 0,
          offers: 0,
          responseRate: 0,
          rejectionRate: 0,
          source: "N/A",
          avgTime: "N/A",
          thisMonth: 0,
          monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          statusDist: { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 },
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        // Initialize statistics
        let total = 0;
        let pending = 0;
        let interviews = 0;
        let offers = 0;
        let rejected = 0;
        let thisMonth = 0;
        let sourceCounts = {};
        const monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const statusDist = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
        
        // Current date for calculations
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Process each application
        querySnapshot.forEach((doc) => {
          const app = doc.data();
          total++;
          
          // Count by status
          if (app.jobStatus === 'Applied') {
            pending++;
            statusDist.Applied++;
          } else if (app.jobStatus === 'Interview') {
            interviews++;
            statusDist.Interview++;
          } else if (app.jobStatus === 'Offer') {
            offers++;
            statusDist.Offer++;
          } else if (app.jobStatus === 'Rejected') {
            rejected++;
            statusDist.Rejected++;
          }
          
          // Track job sources
          if (app.jobSource) {
            sourceCounts[app.jobSource] = (sourceCounts[app.jobSource] || 0) + 1;
          }
          
          // Monthly data
          if (app.applicationDate) {
            const appDate = new Date(app.applicationDate);
            const appMonth = appDate.getMonth();
            const appYear = appDate.getFullYear();
            
            // If application is from current year
            if (appYear === currentYear) {
              monthlyData[appMonth]++;
              
              // If application is from current month
              if (appMonth === currentMonth) {
                thisMonth++;
              }
            }
          }
        });
        
        // Calculate response rate (non-applied/total)
        const responseRate = total > 0 ? Math.round(((interviews + offers + rejected) / total) * 100) : 0;
        
        // Calculate rejection rate
        const rejectionRate = (interviews + offers + rejected) > 0 ? 
          Math.round((rejected / (interviews + offers + rejected)) * 100) : 0;
        
        // Find most common source
        let mostCommonSource = "N/A";
        let maxCount = 0;
        Object.entries(sourceCounts).forEach(([source, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostCommonSource = source;
          }
        });
        
        // Update state with calculated stats
        setStats({
          total,
          pending,
          interviews,
          offers,
          responseRate,
          rejectionRate,
          source: mostCommonSource,
          avgTime: "24h", // This would require more data to calculate accurately
          thisMonth,
          monthlyData,
          statusDist,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

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
          "#f59e0b", // yellow (Applied)
          "#4f46e5", // indigo (Interview)
          "#10b981", // green (Offer)
          "#ef4444", // red (Rejected)
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
        <p className="dashboard-subtitle">
          {currentUser ? 
            "Track your job application progress and insights" : 
            "Sign in to track your job applications"}
        </p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading your dashboard...
        </div>
      ) : (
        <>
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
                <span className="chart-subtitle">{new Date().getFullYear()} Application Trend</span>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
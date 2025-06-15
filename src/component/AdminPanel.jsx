import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc,
  where,
  limit 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  deleteObject 
} from 'firebase/storage';
import { db } from '../firebase';
import { 
  Users, 
  Video, 
  Building, 
  FileText, 
  Trash2, 
  Eye, 
  Upload, 
  Plus,
  BarChart3,
  Crown,
  AlertTriangle,
  Calendar
} from 'lucide-react';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutorials: 0,
    totalCompanies: 0,
    totalApplications: 0,
    recentActivity: []
  });
  const [tutorials, setTutorials] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const storage = getStorage();

  // Check if user is admin
  const isAdmin = currentUser && currentUser.email === 'admin@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch tutorials
      const tutorialsRef = collection(db, 'tutorials');
      const tutorialsQuery = query(tutorialsRef, orderBy('createdAt', 'desc'));
      const tutorialsSnapshot = await getDocs(tutorialsQuery);
      const tutorialsData = [];
      tutorialsSnapshot.forEach((doc) => {
        tutorialsData.push({ id: doc.id, ...doc.data() });
      });
      setTutorials(tutorialsData);

      // Fetch companies
      const companiesRef = collection(db, 'companies');
      const companiesQuery = query(companiesRef, orderBy('name', 'asc'));
      const companiesSnapshot = await getDocs(companiesQuery);
      const companiesData = [];
      companiesSnapshot.forEach((doc) => {
        companiesData.push({ id: doc.id, ...doc.data() });
      });
      setCompanies(companiesData);

      // Fetch users
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, orderBy('lastLogin', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = [];
      usersSnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);

      // Fetch basic stats
      const applicationsRef = collection(db, 'applications');
      const applicationsSnapshot = await getDocs(applicationsRef);

      setStats({
        totalUsers: usersSnapshot.size,
        totalTutorials: tutorialsSnapshot.size,
        totalCompanies: companiesSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        recentActivity: tutorialsData.slice(0, 5)
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTutorial = async (tutorial) => {
    try {
      // Delete video file from storage if it exists
      if (tutorial.videoType === 'file' && tutorial.storagePath) {
        try {
          const videoRef = ref(storage, tutorial.storagePath);
          await deleteObject(videoRef);
        } catch (error) {
          console.error('Error deleting video file:', error);
        }
      }

      // Delete thumbnail if it exists
      if (tutorial.thumbnailStoragePath) {
        try {
          const thumbnailRef = ref(storage, tutorial.thumbnailStoragePath);
          await deleteObject(thumbnailRef);
        } catch (error) {
          console.error('Error deleting thumbnail:', error);
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'tutorials', tutorial.id));
      
      // Update local state
      setTutorials(prev => prev.filter(t => t.id !== tutorial.id));
      setStats(prev => ({ ...prev, totalTutorials: prev.totalTutorials - 1 }));
      
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      alert('Failed to delete tutorial. Please try again.');
    }
  };

  const handleDeleteCompany = async (company) => {
    try {
      await deleteDoc(doc(db, 'companies', company.id));
      setCompanies(prev => prev.filter(c => c.id !== company.id));
      setStats(prev => ({ ...prev, totalCompanies: prev.totalCompanies - 1 }));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company. Please try again.');
    }
  };

  const confirmDelete = (item, type) => {
    setItemToDelete({ ...item, type });
    setShowDeleteModal(true);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'Never';
    const dateObj = date instanceof Date ? date : date.toDate();
    return dateObj.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActiveUser = (lastLogin) => {
    if (!lastLogin) return false;
    const lastLoginDate = lastLogin instanceof Date ? lastLogin : lastLogin.toDate();
    const now = new Date();
    const diffInHours = (now - lastLoginDate) / (1000 * 60 * 60);
    return diffInHours <= 24; // Active if logged in within last 24 hours
  };

  const getUserActivityStatus = (lastLogin) => {
    if (!lastLogin) return { status: 'Never', color: '#9ca3af' };
    
    const lastLoginDate = lastLogin instanceof Date ? lastLogin : lastLogin.toDate();
    const now = new Date();
    const diffInHours = (now - lastLoginDate) / (1000 * 60 * 60);
    
    if (diffInHours <= 1) {
      return { status: 'Online', color: '#10b981' };
    } else if (diffInHours <= 24) {
      return { status: 'Active', color: '#3b82f6' };
    } else if (diffInHours <= 168) { // 7 days
      return { status: 'Recent', color: '#f59e0b' };
    } else {
      return { status: 'Inactive', color: '#ef4444' };
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: '1rem',
        color: '#666'
      }}>
        <AlertTriangle size={48} />
        <h2>Access Denied</h2>
        <p>Only administrators can access this panel.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <Crown size={32} style={{ color: '#f59e0b' }} />
        <h1 style={{ margin: 0, color: '#1f2937', fontSize: '2rem' }}>
          Admin Panel
        </h1>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'tutorials', label: 'Tutorials', icon: Video },
          { id: 'companies', label: 'Companies', icon: Building }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                border: 'none',
                background: selectedTab === tab.id ? '#3b82f6' : 'transparent',
                color: selectedTab === tab.id ? 'white' : '#6b7280',
                borderRadius: '0.5rem 0.5rem 0 0',
                cursor: 'pointer',
                borderBottom: selectedTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                fontWeight: selectedTab === tab.id ? '600' : '400'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          Loading admin data...
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {[
                  { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#3b82f6' },
                  { icon: Video, label: 'Tutorials', value: stats.totalTutorials, color: '#10b981' },
                  { icon: Building, label: 'Companies', value: stats.totalCompanies, color: '#f59e0b' },
                  { icon: FileText, label: 'Applications', value: stats.totalApplications, color: '#8b5cf6' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          background: `${stat.color}20`
                        }}>
                          <Icon size={24} style={{ color: stat.color }} />
                        </div>
                        <div>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                            {stat.label}
                          </p>
                          <p style={{ margin: 0, fontSize: '1.875rem', fontWeight: '700', color: '#1f2937' }}>
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937' }}>Recent Tutorials</h3>
                {stats.recentActivity.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.recentActivity.map(tutorial => (
                      <div key={tutorial.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: '#f9fafb',
                        borderRadius: '0.5rem'
                      }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: '500', color: '#1f2937' }}>
                            {tutorial.title}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                            {tutorial.category} • {formatDate(tutorial.createdAt)}
                          </p>
                        </div>
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          background: tutorial.videoType === 'youtube' ? '#fef3c7' : '#dbeafe',
                          color: tutorial.videoType === 'youtube' ? '#92400e' : '#1e40af',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {tutorial.videoType === 'youtube' ? 'YouTube' : 'Uploaded'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No recent tutorials</p>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ margin: 0, color: '#1f2937' }}>User Management</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Active Users: {users.filter(user => isActiveUser(user.lastLogin)).length}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Total Users: {users.length}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                {users.length > 0 ? (
                  <div>
                    {users.map((user, index) => {
                      const activityStatus = getUserActivityStatus(user.lastLogin);
                      return (
                        <div key={user.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                              <h4 style={{ margin: 0, color: '#1f2937' }}>
                                {user.displayName || 'Unknown User'}
                              </h4>
                              {user.email === 'admin@gmail.com' && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.125rem 0.5rem',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500'
                                }}>
                                  <Crown size={12} />
                                  Admin
                                </div>
                              )}
                            </div>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#4f46e5', fontSize: '0.875rem', fontWeight: '500' }}>
                              {user.email}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                              <span>Joined: {formatDate(user.createdAt)}</span>
                              <span>Last Login: {formatDateTime(user.lastLogin)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.25rem 0.75rem',
                              background: `${activityStatus.color}20`,
                              color: activityStatus.color,
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: activityStatus.color
                              }}></div>
                              {activityStatus.status}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    No users found.
                  </div>
                )}
              </div>

              {/* User Statistics */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                {[
                  { 
                    label: 'Online Now', 
                    value: users.filter(user => {
                      if (!user.lastLogin) return false;
                      const lastLoginDate = user.lastLogin instanceof Date ? user.lastLogin : user.lastLogin.toDate();
                      const diffInHours = (new Date() - lastLoginDate) / (1000 * 60 * 60);
                      return diffInHours <= 1;
                    }).length,
                    color: '#10b981'
                  },
                  { 
                    label: 'Active (24h)', 
                    value: users.filter(user => isActiveUser(user.lastLogin)).length,
                    color: '#3b82f6'
                  },
                  { 
                    label: 'This Week', 
                    value: users.filter(user => {
                      if (!user.lastLogin) return false;
                      const lastLoginDate = user.lastLogin instanceof Date ? user.lastLogin : user.lastLogin.toDate();
                      const diffInHours = (new Date() - lastLoginDate) / (1000 * 60 * 60);
                      return diffInHours <= 168; // 7 days
                    }).length,
                    color: '#f59e0b'
                  },
                  { 
                    label: 'Admins', 
                    value: users.filter(user => user.email === 'admin@gmail.com').length,
                    color: '#8b5cf6'
                  }
                ].map((stat, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                      {stat.label}
                    </p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tutorials Tab */}
          {selectedTab === 'tutorials' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ margin: 0, color: '#1f2937' }}>Manage Tutorials</h2>
                <button
                  onClick={() => window.location.href = '/tutorials'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <Plus size={18} />
                  Add Tutorial
                </button>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                {tutorials.length > 0 ? (
                  <div>
                    {tutorials.map((tutorial, index) => (
                      <div key={tutorial.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        borderBottom: index < tutorials.length - 1 ? '1px solid #e5e7eb' : 'none'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>
                            {tutorial.title}
                          </h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                            {tutorial.category} • {tutorial.videoType} • {formatDate(tutorial.createdAt)}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => window.open(tutorial.videoUrl, '_blank')}
                            style={{
                              padding: '0.5rem',
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              color: '#374151'
                            }}
                            title="View Tutorial"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(tutorial, 'tutorial')}
                            style={{
                              padding: '0.5rem',
                              background: '#fef2f2',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              color: '#dc2626'
                            }}
                            title="Delete Tutorial"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    No tutorials found. Start by adding your first tutorial!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Companies Tab */}
          {selectedTab === 'companies' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ margin: 0, color: '#1f2937' }}>Manage Companies</h2>
                <button
                  onClick={() => window.location.href = '/companies'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <Plus size={18} />
                  Add Company
                </button>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                {companies.length > 0 ? (
                  <div>
                    {companies.map((company, index) => (
                      <div key={company.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        borderBottom: index < companies.length - 1 ? '1px solid #e5e7eb' : 'none'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>
                            {company.name}
                          </h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                            {company.location} • {company.services?.join(', ') || 'No services listed'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => confirmDelete(company, 'company')}
                            style={{
                              padding: '0.5rem',
                              background: '#fef2f2',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              color: '#dc2626'
                            }}
                            title="Delete Company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    No companies found. Start by adding companies to your directory!
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <AlertTriangle size={24} style={{ color: '#dc2626' }} />
              <h3 style={{ margin: 0, color: '#1f2937' }}>Confirm Deletion</h3>
            </div>
            
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
              Are you sure you want to delete "{itemToDelete.title || itemToDelete.name}"? 
              This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (itemToDelete.type === 'tutorial') {
                    handleDeleteTutorial(itemToDelete);
                  } else if (itemToDelete.type === 'company') {
                    handleDeleteCompany(itemToDelete);
                  }
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
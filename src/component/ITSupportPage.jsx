import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where,
  orderBy, 
  getDocs
} from 'firebase/firestore';
//import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { 
  Play,
  Search,
  X,
  ArrowLeft,
  Monitor,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addTutorialStyles } from './TutorialStyles';

const ITSupportPage = () => {
  //const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [itSupportTutorials, setItSupportTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // IT Support subdomains from the original categories
  const itSupportSubdomains = [
    'Help Desk',
    'System Administration', 
    'Network Troubleshooting',
    'Hardware Support',
    'Software Installation',
    'User Training'
  ];

  // Add styles
  useEffect(() => {
    const removeStyles = addTutorialStyles();
    return () => {
      if (removeStyles) removeStyles();
    };
  }, []);

  // Fetch IT Support tutorials from Firestore
  useEffect(() => {
    const fetchITSupportTutorials = async () => {
      try {
        setLoading(true);
        const tutorialsRef = collection(db, 'tutorials');
        const q = query(
          tutorialsRef, 
          where('category', '==', 'IT Support'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedTutorials = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTutorials.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date()
          });
        });
        
        setItSupportTutorials(fetchedTutorials);
        setFilteredTutorials(fetchedTutorials);
      } catch (error) {
        console.error('Error fetching IT Support tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchITSupportTutorials();
  }, []);

  // Filter tutorials based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTutorials(itSupportTutorials);
    } else {
      const filtered = itSupportTutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTutorials(filtered);
    }
  }, [searchTerm, itSupportTutorials]);

  const formatDate = (date) => {
    if (!date) return '';
    return date instanceof Date 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const playVideo = (tutorial) => {
    setCurrentVideo(tutorial);
    setShowVideoModal(true);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="tutorial-container">
      {/* Header with Back Button */}
      <div className="tutorial-header">
        <div className="header-left">
          <button 
            onClick={() => navigate('/tutorials')}
            className="back-button"
            style={{
              background: 'none',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#64748b',
              marginRight: '20px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#4a6cf7';
              e.target.style.color = '#4a6cf7';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.color = '#64748b';
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Tutorials</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="page-title-section" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4a6cf7, #3b5ce4)',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wrench size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0'
          }}>
            IT Support Hub
          </h1>
        </div>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Master IT support skills with comprehensive tutorials covering help desk operations, 
          system administration, troubleshooting, and user support techniques.
        </p>
      </div>

      {/* Introduction Video Section */}
      <div className="intro-video-section" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '40px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Monitor size={24} />
            Welcome to IT Support Training
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            margin: '0'
          }}>
            Start your IT support journey with this comprehensive introduction
          </p>
        </div>

        {/* Featured Introduction Video */}
        <div 
          className="featured-video-container"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer'
          }}
          onClick={() => {
            // You can replace this with an actual IT Support introduction video
            const introVideo = {
              id: 'intro',
              title: 'IT Support Fundamentals - Complete Introduction',
              videoType: 'youtube',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual IT Support intro video
              thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
            };
            playVideo(introVideo);
          }}
        >
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0' }}>
            <img 
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" // Replace with actual thumbnail
              alt="IT Support Introduction"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              <Play size={32} color="#4a6cf7" />
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            color: '#1e293b',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            🎯 What You'll Learn
          </h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            flexWrap: 'wrap',
            fontSize: '0.9rem',
            color: '#64748b'
          }}>
            <span>• Help Desk Operations</span>
            <span>• System Administration</span>
            <span>• Troubleshooting Techniques</span>
            <span>• User Training & Support</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section" style={{ marginBottom: '30px' }}>
        <div style={{
          position: 'relative',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0 16px',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#4a6cf7';
            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(74, 108, 247, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <Search size={20} style={{ color: '#64748b', marginRight: '12px' }} />
            <input
              type="text"
              placeholder="Search IT Support tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: '1',
                border: 'none',
                outline: 'none',
                padding: '14px 0',
                fontSize: '16px',
                background: 'transparent'
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            color: '#64748b',
            fontSize: '14px'
          }}>
            Found {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} 
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        )}
      </div>

      {/* Subdomain Categories Info */}
      <div className="categories-info" style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#1e293b',
          fontSize: '1.2rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <HelpCircle size={20} />
          IT Support Topics Covered
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {itSupportSubdomains.map((subdomain, index) => (
            <div
              key={index}
              style={{
                background: '#f8fafc',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                color: '#475569',
                fontWeight: '500'
              }}
            >
              🛠️ {subdomain}
            </div>
          ))}
        </div>
      </div>

      {/* Tutorials Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #4a6cf7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p>Loading IT Support tutorials...</p>
        </div>
      ) : (
        <>
          {filteredTutorials.length > 0 ? (
            <div className="tutorials-grid">
              {filteredTutorials.map(tutorial => (
                <div key={tutorial.id} className="tutorial-card">
                  <div 
                    className="tutorial-thumbnail"
                    onClick={() => playVideo(tutorial)}
                  >
                    <img 
                      src={tutorial.thumbnailUrl} 
                      alt={tutorial.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/640x360?text=IT+Support+Tutorial';
                      }}
                    />
                    <div className="play-button">
                      <Play size={24} color="#4a6cf7" />
                    </div>
                  </div>
                  <div className="tutorial-info">
                    <div className="tutorial-tags">
                      <span className="tutorial-category">IT Support</span>
                      {tutorial.subdomain && (
                        <span className="tutorial-subdomain">{tutorial.subdomain}</span>
                      )}
                    </div>
                    <h3 className="tutorial-info-title">{tutorial.title}</h3>
                    <p className="tutorial-description">{tutorial.description}</p>
                  </div>
                  <div className="tutorial-footer">
                    <div className="tutorial-date">{formatDate(tutorial.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🛠️</div>
              <h2 className="empty-title">
                {searchTerm ? 'No tutorials found' : 'No IT Support tutorials available yet'}
              </h2>
              <p className="empty-description">
                {searchTerm 
                  ? `No tutorials found matching "${searchTerm}". Try different keywords.`
                  : 'IT Support tutorials will be added here soon. Check back later for comprehensive training content.'}
              </p>
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  style={{
                    background: '#4a6cf7',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Video Player Modal */}
      {showVideoModal && currentVideo && (
        <div className="modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="video-modal-close"
              onClick={() => setShowVideoModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {currentVideo.videoType === 'youtube' ? (
              <iframe
                className="video-iframe"
                src={`${currentVideo.videoUrl}?autoplay=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                className="video-player"
                src={currentVideo.videoUrl}
                controls
                autoPlay
              ></video>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ITSupportPage;
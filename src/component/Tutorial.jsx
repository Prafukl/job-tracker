import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { 
  Upload, 
  X, 
  Play, 
  Youtube, 
  FileVideo,
  Trash2, 
  Plus
} from 'lucide-react';
import { addTutorialStyles } from './TutorialStyles';

// Tutorial Component
const Tutorial = () => {
  const { currentUser } = useAuth();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const [categories] = useState([
    'Software Engineering', 
    'Data Engineering', 
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cloud Computing',
    'IT Support',
    'Cybersecurity',
    'UX/UI Design',
    'Project Management',
    'Linkedin',
    'Resume Building',
    'Email Writing'
  ]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Software Engineering',
    videoType: 'youtube', // 'youtube' or 'file'
    youtubeUrl: '',
    videoFile: null,
    videoUrl: '',
    thumbnailUrl: '',
  });
  
  const fileInputRef = useRef(null);
  const storage = getStorage();

  // Check if user is admin
  useEffect(() => {
    if (currentUser && currentUser.email === 'admin@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Fetch tutorials from Firestore
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        const tutorialsRef = collection(db, 'tutorials');
        const q = query(
          tutorialsRef, 
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
        
        setTutorials(fetchedTutorials);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
    
    // Add custom styles
    const removeStyles = addTutorialStyles();
    
    // Cleanup
    return () => {
      if (removeStyles) removeStyles();
    };
  }, []);



  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle video type selection
  const handleVideoTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      videoType: type,
      videoFile: null,
      videoUrl: '',
      youtubeUrl: ''
    }));
  };

  // Handle video file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, WebM, or OGG)');
      return;
    }
    
    // Check file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      alert('File size exceeds 100MB limit. Please select a smaller file or use YouTube embed.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      videoFile: file
    }));
  };

  // Format file size
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setFormData(prev => ({
      ...prev,
      videoFile: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Extract YouTube video ID from URL
  const extractYoutubeId = (url) => {
    if (!url) return null;
    
    // Regular expressions for different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generate YouTube thumbnail URL
  const getYoutubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Upload video to Firebase Storage
  const uploadVideo = async () => {
    if (!formData.videoFile) return null;
    
    try {
      setUploading(true);
      
      // Create a reference to the storage location
      const timestamp = Date.now();
      const filename = formData.videoFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storagePath = `tutorials/videos/${timestamp}_${filename}`;
      const storageRef = ref(storage, storagePath);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, formData.videoFile);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            setUploading(false);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              setUploadProgress(0);
              resolve({
                url: downloadURL,
                path: storagePath
              });
            } catch (error) {
              console.error('Error getting download URL:', error);
              setUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Upload setup error:', error);
      setUploading(false);
      return null;
    }
  };

  // Save tutorial to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !isAdmin) {
      alert('Only admin users can upload tutorials');
      return;
    }
    
    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate based on video type
    if (formData.videoType === 'youtube') {
      if (!formData.youtubeUrl) {
        alert('Please enter a YouTube URL');
        return;
      }
      
      const videoId = extractYoutubeId(formData.youtubeUrl);
      if (!videoId) {
        alert('Invalid YouTube URL. Please enter a valid YouTube video URL');
        return;
      }
    } else if (formData.videoType === 'file') {
      if (!formData.videoFile) {
        alert('Please select a video file to upload');
        return;
      }
    }
    
    try {
      // Process video based on type
      let videoData = {
        videoType: formData.videoType,
        videoUrl: '',
        thumbnailUrl: '',
        storagePath: ''
      };
      
      if (formData.videoType === 'youtube') {
        const videoId = extractYoutubeId(formData.youtubeUrl);
        videoData.videoUrl = `https://www.youtube.com/embed/${videoId}`;
        videoData.thumbnailUrl = getYoutubeThumbnail(videoId);
      } else if (formData.videoType === 'file') {
        // Upload video file
        const uploadResult = await uploadVideo();
        if (uploadResult) {
          videoData.videoUrl = uploadResult.url;
          videoData.storagePath = uploadResult.path;
          // For a custom thumbnail, you could upload that separately
          // For now, we'll just use a placeholder
          videoData.thumbnailUrl = 'https://via.placeholder.com/640x360?text=Video+Tutorial';
        } else {
          throw new Error('Failed to upload video');
        }
      }
      
      // Save to Firestore
      const tutorialData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        ...videoData,
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'tutorials'), tutorialData);
      
      // Add to state with client-side timestamp for immediate display
      const newTutorial = {
        ...tutorialData,
        id: docRef.id,
        createdAt: new Date()
      };
      
      setTutorials(prev => [newTutorial, ...prev]);
      
      // Close modal and reset form
      setShowUploadModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'Software Engineering',
        videoType: 'youtube',
        youtubeUrl: '',
        videoFile: null,
        videoUrl: '',
        thumbnailUrl: '',
      });
      
    } catch (error) {
      console.error('Error saving tutorial:', error);
      alert('Failed to save tutorial. Please try again.');
    }
  };

  // Delete tutorial
  const confirmDelete = (id) => {
    setTutorialToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!currentUser || !isAdmin || !tutorialToDelete) return;

    try {
      // Find the tutorial to delete
      const tutorialToDeleteObj = tutorials.find(tut => tut.id === tutorialToDelete);
      
      // If it's a file upload, delete from storage
      if (tutorialToDeleteObj && tutorialToDeleteObj.videoType === 'file' && tutorialToDeleteObj.storagePath) {
        try {
          const fileRef = ref(storage, tutorialToDeleteObj.storagePath);
          await deleteObject(fileRef);
        } catch (error) {
          console.error('Error deleting video file:', error);
          // Continue with tutorial deletion even if file deletion fails
        }
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'tutorials', tutorialToDelete));
      
      // Remove from state
      setTutorials(prev => prev.filter(tut => tut.id !== tutorialToDelete));
      
      // Close modal
      setShowDeleteModal(false);
      setTutorialToDelete(null);
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      alert('Failed to delete tutorial. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTutorialToDelete(null);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    return date instanceof Date 
      ? date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
  };

  // Filter tutorials by category
  const filteredTutorials = activeCategory === 'All' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === activeCategory);

  // Play video
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const playVideo = (tutorial) => {
    setCurrentVideo(tutorial);
    setShowVideoModal(true);
  };

  return (
    <div className="tutorial-container">
      <div className="tutorial-header">
        <h1 className="tutorial-title">Video Tutorials</h1>
        {isAdmin && (
          <div className="tutorial-actions">
            <button 
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} />
              <span>Upload Tutorial</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="filter-container">
        <button 
          className={`filter-button ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading tutorials...
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
                        e.target.src = 'https://via.placeholder.com/640x360?text=Video+Tutorial';
                      }}
                    />
                    <div className="play-button">
                      <Play size={24} color="#4a6cf7" />
                    </div>
                  </div>
                  <div className="tutorial-info">
                    <span className="tutorial-category">{tutorial.category}</span>
                    <h3 className="tutorial-info-title">{tutorial.title}</h3>
                    <p className="tutorial-description">{tutorial.description}</p>
                  </div>
                  <div className="tutorial-footer">
                    <div className="tutorial-date">
                      {formatDate(tutorial.createdAt)}
                    </div>
                    {isAdmin && (
                      <div className="tutorial-actions-menu">
                        <button 
                          className="delete-button"
                          onClick={() => confirmDelete(tutorial.id)}
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h2 className="empty-title">No tutorials available</h2>
              <p className="empty-description">
                {activeCategory !== 'All' 
                  ? `There are no tutorials in the "${activeCategory}" category yet.`
                  : isAdmin 
                    ? 'Upload your first tutorial to get started.'
                    : 'Check back later for new tutorials.'}
              </p>
              {isAdmin && (
                <button 
                  className="upload-button"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Plus size={18} />
                  <span>Upload Tutorial</span>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Upload New Tutorial</h2>
              <button 
                className="close-button"
                onClick={() => setShowUploadModal(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title *</label>
                <input 
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter tutorial title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter tutorial description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video Type *</label>
                <div className="type-selector">
                  <div 
                    className={`type-option ${formData.videoType === 'youtube' ? 'active' : ''}`}
                    onClick={() => handleVideoTypeChange('youtube')}
                  >
                    <Youtube className="type-option-icon" size={24} />
                    <span className="type-option-label">YouTube Video</span>
                  </div>
                  <div 
                    className={`type-option ${formData.videoType === 'file' ? 'active' : ''}`}
                    onClick={() => handleVideoTypeChange('file')}
                  >
                    <FileVideo className="type-option-icon" size={24} />
                    <span className="type-option-label">Upload Video File</span>
                  </div>
                </div>
              </div>

              {formData.videoType === 'youtube' ? (
                <div className="form-group">
                  <label htmlFor="youtubeUrl" className="form-label">YouTube URL *</label>
                  <input 
                    type="text"
                    id="youtubeUrl"
                    name="youtubeUrl"
                    className="form-input"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    required={formData.videoType === 'youtube'}
                  />
                </div>
              ) : (
                <div className="file-upload-container">
                  <label className="form-label">Video File *</label>
                  {formData.videoFile ? (
                    <>
                      <div className="file-preview">
                        <FileVideo className="file-preview-icon" size={24} />
                        <div className="file-preview-info">
                          <div className="file-preview-name">{formData.videoFile.name}</div>
                          <div className="file-preview-size">{formatFileSize(formData.videoFile.size)}</div>
                        </div>
                        <button 
                          type="button"
                          className="file-preview-remove"
                          onClick={removeSelectedFile}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      {uploading && (
                        <div className="progress-bar">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <label className="file-upload-input-container">
                      <Upload className="file-upload-icon" size={30} />
                      <span className="file-upload-text">Click to upload or drag and drop</span>
                      <span className="file-upload-hint">MP4, WebM or OGG (Max 100MB)</span>
                      <input 
                        type="file"
                        className="file-upload-input"
                        onChange={handleFileChange}
                        accept="video/mp4,video/webm,video/ogg"
                        ref={fileInputRef}
                      />
                    </label>
                  )}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="submit-button"
                  disabled={uploading || (formData.videoType === 'file' && !formData.videoFile)}
                >
                  {uploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Upload Tutorial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Confirm Deletion</h2>
              <button 
                className="close-button"
                onClick={cancelDelete}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-form">
              <p>Are you sure you want to delete this tutorial? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="submit-button delete-confirm-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoModal && currentVideo && (
        <div 
          className="modal-overlay"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
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
    </div>
  );
};

export default Tutorial;
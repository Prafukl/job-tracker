import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
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
  Plus,
  Edit,
  Image
} from 'lucide-react';
import { addTutorialStyles } from './TutorialStyles';

const Tutorial = () => {
  const { currentUser } = useAuth();
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    subdomain: '',
    thumbnailFile: null
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Software Engineering',
    subdomain: '',
    videoType: 'youtube',
    youtubeUrl: '',
    videoFile: null,
    thumbnailFile: null,
    videoUrl: '',
    thumbnailUrl: ''
  });

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const editThumbnailInputRef = useRef(null);
  const storage = getStorage();

  const categories = {
    'Software Engineering': [
      'Full Stack Development', 'Backend Development', 'Frontend Development',
      'Mobile Development', 'Game Development', 'API Development',
      'Microservices', 'Software Architecture'
    ],
    'Data Engineering': [
      'ETL Pipelines', 'Data Warehousing', 'Big Data', 'Stream Processing',
      'Data Lake', 'Apache Spark', 'Kafka', 'Airflow'
    ],
    'Web Development': [
      'React.js', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Laravel',
      'WordPress', 'E-commerce'
    ],
    'Mobile Development': [
      'React Native', 'Flutter', 'iOS Development', 'Android Development',
      'Xamarin', 'Ionic', 'Progressive Web Apps'
    ],
    'DevOps': [
      'CI/CD', 'Docker', 'Kubernetes', 'Infrastructure as Code',
      'Monitoring', 'GitOps', 'Configuration Management'
    ],
    'Cloud Computing': [
      'AWS', 'Azure', 'Google Cloud', 'Serverless', 'Virtualization',
      'Containerization', 'Cloud Security', 'Multi-cloud'
    ],
    'IT Support': [
      'Help Desk', 'System Administration', 'Network Troubleshooting',
      'Hardware Support', 'Software Installation', 'User Training'
    ],
    'Cybersecurity': [
      'Penetration Testing', 'Network Security', 'Application Security',
      'Cloud Security', 'Incident Response', 'Compliance', 'Threat Intelligence'
    ],
    'UX/UI Design': [
      'User Research', 'Wireframing', 'Prototyping', 'Visual Design',
      'Interaction Design', 'Design Systems', 'Usability Testing'
    ],
    'Computer Hardware': [
      'UPS', 'SMPS', 'CPU', 'GPU', 'Motherboard', 'Monitor', 'CMOS Battery'
    ],
    'Project Management': [
      'Agile/Scrum', 'Waterfall', 'Risk Management', 'Stakeholder Management',
      'Budget Management', 'Team Leadership'
    ],
    'Linkedin': [
      'Profile Optimization', 'Networking', 'Job Search', 'Content Strategy',
      'Personal Branding', 'LinkedIn Ads'
    ],
    'Resume Building': [
      'ATS Optimization', 'Cover Letters', 'Portfolio Development',
      'Industry-Specific Resumes', 'Interview Preparation'
    ],
    'Networking': ['Basic Concepts'],
    'Email Writing': [
      'Professional Communication', 'Follow-up Emails', 'Cold Outreach',
      'Email Etiquette', 'Networking Emails'
    ]
  };

  useEffect(() => {
    if (currentUser && currentUser.email === 'admin@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        const tutorialsRef = collection(db, 'tutorials');
        const q = query(tutorialsRef, orderBy('createdAt', 'desc'));
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
    const removeStyles = addTutorialStyles();
    return () => {
      if (removeStyles) removeStyles();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subdomain: '' } : {})
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subdomain: '' } : {})
    }));
  };

  const handleVideoTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      videoType: type,
      videoFile: null,
      thumbnailFile: null,
      videoUrl: '',
      youtubeUrl: '',
      thumbnailUrl: ''
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, WebM, or OGG)');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      alert('File size exceeds 100MB limit. Please select a smaller file or use YouTube embed.');
      return;
    }
    setFormData(prev => ({ ...prev, videoFile: file }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or JPG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Thumbnail size exceeds 5MB limit. Please select a smaller image.');
      return;
    }
    setFormData(prev => ({ ...prev, thumbnailFile: file }));
  };

  const handleEditThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or JPG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Thumbnail size exceeds 5MB limit. Please select a smaller image.');
      return;
    }
    setEditFormData(prev => ({ ...prev, thumbnailFile: file }));
  };

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) return sizeInBytes + ' bytes';
    else if (sizeInBytes < 1024 * 1024) return (sizeInBytes / 1024).toFixed(1) + ' KB';
    else return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const removeSelectedFile = (type) => {
    if (type === 'videoFile') {
      setFormData(prev => ({ ...prev, videoFile: null }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (type === 'thumbnailFile') {
      setFormData(prev => ({ ...prev, thumbnailFile: null }));
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    } else if (type === 'editThumbnailFile') {
      setEditFormData(prev => ({ ...prev, thumbnailFile: null }));
      if (editThumbnailInputRef.current) editThumbnailInputRef.current.value = '';
    }
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYoutubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const uploadThumbnail = async (file) => {
    if (!file) return null;
    try {
      const timestamp = Date.now();
      const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storagePath = `tutorials/thumbnails/${timestamp}_${filename}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Thumbnail upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ url: downloadURL, path: storagePath });
            } catch (error) {
              console.error('Error getting thumbnail download URL:', error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Thumbnail upload setup error:', error);
      return null;
    }
  };

  const uploadVideo = async () => {
    if (!formData.videoFile) return null;
    try {
      setUploading(true);
      const timestamp = Date.now();
      const filename = formData.videoFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storagePath = `tutorials/videos/${timestamp}_${filename}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, formData.videoFile);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Video upload error:', error);
            setUploading(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              setUploadProgress(0);
              resolve({ url: downloadURL, path: storagePath });
            } catch (error) {
              console.error('Error getting video download URL:', error);
              setUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Video upload setup error:', error);
      setUploading(false);
      return null;
    }
  };

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
      if (!formData.thumbnailFile) {
        alert('Please select a thumbnail image for the video');
        return;
      }
    }
    try {
      setUploading(true);
      let videoData = {
        videoType: formData.videoType,
        videoUrl: '',
        thumbnailUrl: '',
        storagePath: '',
        thumbnailStoragePath: ''
      };
      if (formData.videoType === 'youtube') {
        const videoId = extractYoutubeId(formData.youtubeUrl);
        videoData.videoUrl = `https://www.youtube.com/embed/${videoId}`;
        videoData.thumbnailUrl = getYoutubeThumbnail(videoId);
      } else if (formData.videoType === 'file') {
        const videoUploadResult = await uploadVideo();
        const thumbnailUploadResult = await uploadThumbnail(formData.thumbnailFile);
        if (videoUploadResult && thumbnailUploadResult) {
          videoData.videoUrl = videoUploadResult.url;
          videoData.storagePath = videoUploadResult.path;
          videoData.thumbnailUrl = thumbnailUploadResult.url;
          videoData.thumbnailStoragePath = thumbnailUploadResult.path;
        } else {
          throw new Error('Failed to upload video or thumbnail');
        }
      }
      const tutorialData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subdomain: formData.subdomain || '',
        ...videoData,
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'tutorials'), tutorialData);
      setTutorials(prev => [{
        ...tutorialData,
        id: docRef.id,
        createdAt: new Date()
      }, ...prev]);
      setShowUploadModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'Software Engineering',
        subdomain: '',
        videoType: 'youtube',
        youtubeUrl: '',
        videoFile: null,
        thumbnailFile: null,
        videoUrl: '',
        thumbnailUrl: ''
      });
    } catch (error) {
      console.error('Error saving tutorial:', error);
      alert('Failed to save tutorial. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const startEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setEditFormData({
      title: tutorial.title,
      description: tutorial.description,
      category: tutorial.category,
      subdomain: tutorial.subdomain || '',
      thumbnailFile: null
    });
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setEditingTutorial(null);
    setEditFormData({});
    setShowEditModal(false);
  };

  const saveEdit = async () => {
    if (!editFormData.title || !editFormData.category) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setUploading(true);
      const tutorialRef = doc(db, 'tutorials', editingTutorial.id);
      let updateData = {
        title: editFormData.title,
        description: editFormData.description,
        category: editFormData.category,
        subdomain: editFormData.subdomain || '',
        updatedAt: serverTimestamp()
      };

      if (editFormData.thumbnailFile) {
        if (editingTutorial.videoType === 'file' && editingTutorial.thumbnailStoragePath) {
          try {
            const oldThumbnailRef = ref(storage, editingTutorial.thumbnailStoragePath);
            await deleteObject(oldThumbnailRef);
          } catch (error) {
            console.error('Error deleting old thumbnail:', error);
          }
        }
        
        const thumbnailUploadResult = await uploadThumbnail(editFormData.thumbnailFile);
        if (thumbnailUploadResult) {
          updateData.thumbnailUrl = thumbnailUploadResult.url;
          updateData.thumbnailStoragePath = thumbnailUploadResult.path;
        } else {
          throw new Error('Failed to upload new thumbnail');
        }
      } else if (editingTutorial.videoType === 'youtube') {
        const videoId = extractYoutubeId(editingTutorial.videoUrl);
        updateData.thumbnailUrl = getYoutubeThumbnail(videoId);
      }

      await updateDoc(tutorialRef, updateData);
      setTutorials(prev => prev.map(tutorial => 
        tutorial.id === editingTutorial.id 
          ? { 
              ...tutorial, 
              ...updateData,
              updatedAt: new Date()
            } 
          : tutorial
      ));
      setEditingTutorial(null);
      setEditFormData({});
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating tutorial:', error);
      alert('Failed to update tutorial. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const confirmDelete = (id) => {
    setTutorialToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!currentUser || !isAdmin || !tutorialToDelete) return;
    try {
      const tutorialToDeleteObj = tutorials.find(tut => tut.id === tutorialToDelete);
      if (tutorialToDeleteObj && tutorialToDeleteObj.videoType === 'file') {
        if (tutorialToDeleteObj.storagePath) {
          try {
            const videoRef = ref(storage, tutorialToDeleteObj.storagePath);
            await deleteObject(videoRef);
          } catch (error) {
            console.error('Error deleting video file:', error);
          }
        }
        if (tutorialToDeleteObj.thumbnailStoragePath) {
          try {
            const thumbnailRef = ref(storage, tutorialToDeleteObj.thumbnailStoragePath);
            await deleteObject(thumbnailRef);
          } catch (error) {
            console.error('Error deleting thumbnail file:', error);
          }
        }
      }
      await deleteDoc(doc(db, 'tutorials', tutorialToDelete));
      setTutorials(prev => prev.filter(tut => tut.id !== tutorialToDelete));
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

  const formatDate = (date) => {
    if (!date) return '';
    return date instanceof Date 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredTutorials = activeCategory === 'All' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.category === activeCategory);

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

      {showEditModal && editingTutorial && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Edit Tutorial</h2>
              <button 
                className="close-button"
                onClick={cancelEdit}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-title" className="form-label">Title *</label>
                <input 
                  type="text"
                  id="edit-title"
                  name="title"
                  className="form-input"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  placeholder="Enter tutorial title"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-category" className="form-label">Category *</label>
                  <select
                    id="edit-category"
                    name="category"
                    className="form-select"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    required
                  >
                    {Object.keys(categories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {editFormData.category && categories[editFormData.category] && (
                  <div className="form-group">
                    <label htmlFor="edit-subdomain" className="form-label">Subdomain (Optional)</label>
                    <select
                      id="edit-subdomain"
                      name="subdomain"
                      className="form-select"
                      value={editFormData.subdomain}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Subdomain (Optional)</option>
                      {categories[editFormData.category].map(subdomain => (
                        <option key={subdomain} value={subdomain}>{subdomain}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="edit-description" className="form-label">Description</label>
                <textarea
                  id="edit-description"
                  name="description"
                  className="form-textarea"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  placeholder="Enter tutorial description"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail Image (Optional)</label>
                {editFormData.thumbnailFile ? (
                  <div className="file-preview">
                    <Image className="file-preview-icon" size={24} />
                    <div className="file-preview-info">
                      <div className="file-preview-name">{editFormData.thumbnailFile.name}</div>
                      <div className="file-preview-size">{formatFileSize(editFormData.thumbnailFile.size)}</div>
                    </div>
                    <button 
                      type="button"
                      className="file-preview-remove"
                      onClick={() => removeSelectedFile('editThumbnailFile')}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <img 
                      src={editingTutorial.thumbnailUrl} 
                      alt="Current thumbnail"
                      className="current-thumbnail"
                      style={{ maxWidth: '200px', marginBottom: '10px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x112?text=Thumbnail';
                      }}
                    />
                    <label className="file-upload-input-container">
                      <Upload className="file-upload-icon" size={30} />
                      <span className="file-upload-text">Click to upload or drag and drop new thumbnail</span>
                      <span className="file-upload-hint">JPEG, PNG or JPG (Max 5MB)</span>
                      <input 
                        type="file"
                        className="file-upload-input"
                        onChange={handleEditThumbnailChange}
                        accept="image/jpeg,image/png,image/jpg"
                        ref={editThumbnailInputRef}
                      />
                    </label>
                  </>
                )}
                {uploading && (
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={cancelEdit}>Cancel</button>
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={uploading}
                >
                  {uploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Update Tutorial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="filter-container">
        <button 
          className={`filter-button ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {Object.keys(categories).map(category => (
          <button
            key={category}
            className={`filter-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'Software Engineering' ? '💻' :
             category === 'Data Engineering' ? '📊' :
             category === 'Web Development' ? '🌐' :
             category === 'Mobile Development' ? '📱' :
             category === 'DevOps' ? '⚙️' :
             category === 'Cloud Computing' ? '☁️' :
             category === 'IT Support' ? '🛠️' :
             category === 'Cybersecurity' ? '🔒' :
             category === 'UX/UI Design' ? '🎨' :
             category === 'Project Management' ? '📋' :
             category === 'Linkedin' ? '💼' :
             category === 'Resume Building' ? '📄' :
             category === 'Email Writing' ? '✉️' : '📚'}
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
                    <div className="tutorial-tags">
                      <span className="tutorial-category">{tutorial.category}</span>
                      {tutorial.subdomain && (
                        <span className="tutorial-subdomain">{tutorial.subdomain}</span>
                      )}
                    </div>
                    <h3 className="tutorial-info-title">{tutorial.title}</h3>
                    <p className="tutorial-description">{tutorial.description}</p>
                  </div>
                  <div className="tutorial-footer">
                    <div className="tutorial-date">{formatDate(tutorial.createdAt)}</div>
                    {isAdmin && (
                      <div className="tutorial-actions-menu">
                        <button 
                          className="edit-tutorial-btn"
                          onClick={() => startEdit(tutorial)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
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
              <div className="form-row">
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
                    {Object.keys(categories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {formData.category && categories[formData.category] && (
                  <div className="form-group">
                    <label htmlFor="subdomain" className="form-label">Subdomain (Optional)</label>
                    <select
                      id="subdomain"
                      name="subdomain"
                      className="form-select"
                      value={formData.subdomain}
                      onChange={handleChange}
                    >
                      <option value="">Select Subdomain (Optional)</option>
                      {categories[formData.category].map(subdomain => (
                        <option key={subdomain} value={subdomain}>{subdomain}</option>
                      ))}
                    </select>
                  </div>
                )}
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
                <>
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
                            onClick={() => removeSelectedFile('videoFile')}
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
                  <div className="file-upload-container">
                    <label className="form-label">Thumbnail Image *</label>
                    {formData.thumbnailFile ? (
                      <>
                        <div className="file-preview">
                          <Image className="file-preview-icon" size={24} />
                          <div className="file-preview-info">
                            <div className="file-preview-name">{formData.thumbnailFile.name}</div>
                            <div className="file-preview-size">{formatFileSize(formData.thumbnailFile.size)}</div>
                          </div>
                          <button 
                            type="button"
                            className="file-preview-remove"
                            onClick={() => removeSelectedFile('thumbnailFile')}
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
                        <span className="file-upload-hint">JPEG, PNG or JPG (Max 5MB)</span>
                        <input 
                          type="file"
                          className="file-upload-input"
                          onChange={handleThumbnailChange}
                          accept="image/jpeg,image/png,image/jpg"
                          ref={thumbnailInputRef}
                        />
                      </label>
                    )}
                  </div>
                </>
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
                  disabled={uploading || (formData.videoType === 'file' && (!formData.videoFile || !formData.thumbnailFile))}
                >
                  {uploading ? `Uploading ${Math.round(uploadProgress)}%` : 'Upload Tutorial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <button className="cancel-button" onClick={cancelDelete}>Cancel</button>
              <button className="submit-button delete-confirm-button" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Tutorial;
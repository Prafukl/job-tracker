import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
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
import { db } from '../firebase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  X, 
  Search, 
  Filter, 
  FileText, 
  Video
} from 'lucide-react';
import { addKnowledgeBaseStyles } from './KnowledgeBaseStyles';

const KnowledgeBaseArticle = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form data for adding/editing articles
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    domain: 'Software Engineering',
    images: [],
    videoUrl: ''
  });

  const fileInputRef = useRef(null);
  const storage = getStorage();

  // Domain categories
  const domains = [
    'Software Engineering',
    'Web Development',
    'Data Science',
    'Mobile Development',
    'DevOps',
    'UI/UX Design',
    'Project Management',
    'IT Support'
  ];

  // Add styles
  useEffect(() => {
    const removeStyles = addKnowledgeBaseStyles();
    return () => {
      if (removeStyles) removeStyles();
    };
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (currentUser && currentUser.email === 'admin@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Fetch articles from Firestore
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesRef = collection(db, 'knowledgeBase');
        const q = query(articlesRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const fetchedArticles = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedArticles.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date()
          });
        });
        
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = extractYoutubeId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      setUploading(true);
      const uploadedImages = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert('Please select image files only');
          continue;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5MB limit');
          continue;
        }
        
        const timestamp = Date.now();
        const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storagePath = `knowledgeBase/images/${currentUser.uid}/${timestamp}_${filename}`;
        const storageRef = ref(storage, storagePath);
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedImages.push({
                  url: downloadURL,
                  path: storagePath,
                  name: filename
                });
                resolve();
              } catch (error) {
                console.error('Error getting download URL:', error);
                reject(error);
              }
            }
          );
        });
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
      
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove image from form data
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !isAdmin) {
      alert('Only admin users can add knowledge base articles');
      return;
    }
    
    if (!formData.title || !formData.content || !formData.domain) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Process video URL if it's from YouTube
      let processedVideoUrl = formData.videoUrl;
      if (formData.videoUrl && (formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be'))) {
        const embedUrl = getYoutubeEmbedUrl(formData.videoUrl);
        if (embedUrl) {
          processedVideoUrl = embedUrl;
        }
      }
      
      const articleData = {
        ...formData,
        videoUrl: processedVideoUrl,
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        createdAt: serverTimestamp()
      };
      
      if (showEditModal && selectedArticle) {
        // Update existing article
        const articleRef = doc(db, 'knowledgeBase', selectedArticle.id);
        await updateDoc(articleRef, {
          ...articleData,
          updatedAt: serverTimestamp()
        });
        
        // Update in state
        setArticles(prev => prev.map(article => 
          article.id === selectedArticle.id 
            ? { ...article, ...articleData, updatedAt: new Date() } 
            : article
        ));
      } else {
        // Add new article
        const docRef = await addDoc(collection(db, 'knowledgeBase'), articleData);
        
        // Add to state
        const newArticle = {
          ...articleData,
          id: docRef.id,
          createdAt: new Date()
        };
        
        setArticles(prev => [newArticle, ...prev]);
      }
      
      // Reset form and close modal
      setFormData({
        title: '',
        content: '',
        domain: 'Software Engineering',
        images: [],
        videoUrl: ''
      });
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedArticle(null);
      
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article. Please try again.');
    }
  };

  // Edit article
  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      domain: article.domain,
      images: article.images || [],
      videoUrl: article.videoUrl || ''
    });
    setShowEditModal(true);
  };

  // Delete article
  const confirmDelete = (id) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!currentUser || !isAdmin || !articleToDelete) return;

    try {
      const articleToDeleteObj = articles.find(article => article.id === articleToDelete);
      
      // Delete images from storage
      if (articleToDeleteObj?.images && articleToDeleteObj.images.length > 0) {
        for (const image of articleToDeleteObj.images) {
          if (image.path) {
            try {
              const imageRef = ref(storage, image.path);
              await deleteObject(imageRef);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'knowledgeBase', articleToDelete));
      
      // Remove from state
      setArticles(prev => prev.filter(article => article.id !== articleToDelete));
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
    }
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'All' || article.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  // Format date
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

  return (
    <div className="kb-container">
      <div className="kb-header">
        <div className="kb-header-content">
          <h1 className="kb-title">Knowledge Base</h1>
          <p className="kb-subtitle">Explore articles to help with your job search journey</p>
        </div>
        {isAdmin && (
          <button 
            className="kb-add-button"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Add Article</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="kb-search-filter">
        <div className="kb-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="kb-filter">
          <Filter size={20} />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="All">All Domains</option>
            {domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="kb-loading">Loading articles...</div>
      ) : (
        <div className="kb-articles">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div key={article.id} className="kb-article-card">
                <div className="kb-article-header">
                  <h2 className="kb-article-title">{article.title}</h2>
                  <div className="kb-article-domain">{article.domain}</div>
                </div>
                
                <div className="kb-article-content">
                  <p>{article.content}</p>
                </div>
                
                {article.images && article.images.length > 0 && (
                  <div className="kb-article-images">
                    {article.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image.url} 
                        alt={`Content for article ${index + 1}`} 
                        className="kb-article-image"
                      />
                    ))}
                  </div>
                )}
                
                {article.videoUrl && (
                  <div className="kb-video-container">
                    <div className="kb-video-title-bar">
                      <Video size={18} />
                      <span>Video: {article.title}</span>
                    </div>
                    
                    <div className="kb-article-video">
                      <iframe
                        src={article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? 
                              getYoutubeEmbedUrl(article.videoUrl) || article.videoUrl : article.videoUrl}
                        title={article.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="kb-video-iframe"
                      ></iframe>
                    </div>
                  </div>
                )}
                
                <div className="kb-article-footer">
                  <div className="kb-article-date">
                    Published on {formatDate(article.createdAt)}
                  </div>
                  
                  {isAdmin && (
                    <div className="kb-article-actions">
                      <button 
                        className="kb-edit-button"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="kb-delete-button"
                        onClick={() => confirmDelete(article.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="kb-empty-state">
              <FileText size={50} />
              <h2>No articles found</h2>
              <p>{searchTerm || domainFilter !== 'All' 
                ? 'Try adjusting your search or filter' 
                : isAdmin 
                  ? 'Add your first knowledge base article' 
                  : 'Check back later for new articles'}
              </p>
              {isAdmin && (
                <button 
                  className="kb-add-button"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={18} />
                  <span>Add Article</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Article Modal */}
      {(showAddModal || showEditModal) && (
        <div className="kb-modal-overlay">
          <div className="kb-modal">
            <div className="kb-modal-header">
              <h2>{showEditModal ? 'Edit Article' : 'Add New Article'}</h2>
              <button 
                className="kb-modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedArticle(null);
                  setFormData({
                    title: '',
                    content: '',
                    domain: 'Software Engineering',
                    images: [],
                    videoUrl: ''
                  });
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="kb-modal-content">
              <div className="kb-form-group">
                <label htmlFor="title">Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter article title"
                  required
                />
              </div>
              
              <div className="kb-form-group">
                <label htmlFor="domain">Domain*</label>
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                >
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
              
              <div className="kb-form-group">
                <label htmlFor="content">Content*</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write article content here..."
                  rows="8"
                  required
                ></textarea>
              </div>
              
              <div className="kb-form-group">
                <label htmlFor="videoUrl">Video URL (YouTube or Vimeo)</label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                />
                <small className="kb-form-help">
                  Paste regular YouTube or Vimeo URLs - they'll be automatically converted to embed format
                </small>
              </div>
              
              <div className="kb-form-group">
                <label>Images</label>
                <div className="kb-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="kb-upload-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={20} />
                    <span>{uploading 
                      ? `Uploading ${Math.round(uploadProgress)}%` 
                      : 'Upload Images'}
                    </span>
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="kb-image-preview-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="kb-image-preview">
                        <img src={image.url} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          className="kb-remove-image"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="kb-modal-actions">
                <button
                  type="button"
                  className="kb-cancel-button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedArticle(null);
                    setFormData({
                      title: '',
                      content: '',
                      domain: 'Software Engineering',
                      images: [],
                      videoUrl: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="kb-submit-button"
                  disabled={uploading}
                >
                  {showEditModal ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="kb-modal-overlay">
          <div className="kb-modal kb-delete-modal">
            <div className="kb-modal-header">
              <h2>Delete Article</h2>
              <button 
                className="kb-modal-close"
                onClick={() => {
                  setShowDeleteModal(false);
                  setArticleToDelete(null);
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="kb-modal-content">
              <p>Are you sure you want to delete this article? This action cannot be undone.</p>
              
              <div className="kb-modal-actions">
                <button
                  type="button"
                  className="kb-cancel-button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setArticleToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="kb-delete-confirm-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseArticle;
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  BookOpen, 
  Target, 
  Search,
  Filter,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
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

const InterviewPrep = () => {
  const { currentUser } = useAuth();
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSetId, setCurrentSetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [showAnswers, setShowAnswers] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState({});

  const fileInputRefs = useRef({});
  const storage = getStorage();

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    questions: [{ question: '', answer: '', imageUrl: '', referenceUrl: '', referenceTitle: '' }]
  });

  // Domain categories
  const domains = [
    'Software Engineering', 'Data Engineering', 'Web Development',
    'Mobile Development', 'DevOps', 'Cloud Computing', 'IT Support',
    'Cybersecurity', 'UX/UI Design', 'Project Management',
    'Data Science', 'Machine Learning', 'Product Management',
    'Business Analyst', 'Quality Assurance', 'Technical Writing',
    'Sales Engineer', 'Customer Success', 'Marketing',
    'Finance', 'Human Resources', 'Operations', 'Consulting', 'Other'
  ];

  // Fetch question sets from Firestore
  useEffect(() => {
    const fetchQuestionSets = async () => {
      if (!currentUser) {
        setQuestionSets([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const setsRef = collection(db, 'interviewPrep');
        const q = query(
          setsRef, 
          where('userId', '==', currentUser.uid),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedSets = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedSets.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          });
        });
        
        setQuestionSets(fetchedSets);
      } catch (error) {
        console.error('Error fetching question sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionSets();
  }, [currentUser]);

  // Filter question sets
  const filteredSets = questionSets.filter(set => {
    const matchesSearch = set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         set.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'All' || set.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  // Get unique domains for filter
  const getUniqueDomains = () => {
    const domains = [...new Set(questionSets.map(set => set.domain).filter(Boolean))];
    return domains.sort();
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle question changes
  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  // Handle file upload
  const handleImageUpload = async (questionIndex, file) => {
    if (!file || !currentUser) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [questionIndex]: true }));
      
      const timestamp = Date.now();
      const filename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storagePath = `interview-prep/${currentUser.uid}/${timestamp}_${filename}`;
      const storageRef = ref(storage, storagePath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, [questionIndex]: progress }));
        },
        (error) => {
          console.error('Upload error:', error);
          setUploading(prev => ({ ...prev, [questionIndex]: false }));
          alert('Failed to upload image');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            handleQuestionChange(questionIndex, 'imageUrl', downloadURL);
            setUploading(prev => ({ ...prev, [questionIndex]: false }));
            setUploadProgress(prev => ({ ...prev, [questionIndex]: 0 }));
          } catch (error) {
            console.error('Error getting download URL:', error);
            setUploading(prev => ({ ...prev, [questionIndex]: false }));
          }
        }
      );
    } catch (error) {
      console.error('Upload setup error:', error);
      setUploading(prev => ({ ...prev, [questionIndex]: false }));
    }
  };

  // Remove image
  const removeImage = async (questionIndex) => {
    const imageUrl = formData.questions[questionIndex].imageUrl;
    if (imageUrl) {
      try {
        // Delete from storage if it's a Firebase URL
        if (imageUrl.includes('firebasestorage.googleapis.com')) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    handleQuestionChange(questionIndex, 'imageUrl', '');
  };

  // Add new question
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answer: '', imageUrl: '', referenceUrl: '', referenceTitle: '' }]
    }));
  };

  // Remove question
  const removeQuestion = async (index) => {
    if (formData.questions.length > 1) {
      // Remove image if exists
      const question = formData.questions[index];
      if (question.imageUrl) {
        await removeImage(index);
      }
      
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  // Open modal
  const openModal = (isEdit = false, set = null) => {
    if (isEdit && set) {
      setFormData({
        title: set.title || '',
        domain: set.domain || '',
        questions: set.questions?.map(q => ({
          question: q.question || '',
          answer: q.answer || '',
          imageUrl: q.imageUrl || '',
          referenceUrl: q.referenceUrl || '',
          referenceTitle: q.referenceTitle || ''
        })) || [{ question: '', answer: '', imageUrl: '', referenceUrl: '', referenceTitle: '' }]
      });
      setCurrentSetId(set.id);
      setIsEditMode(true);
    } else {
      setFormData({
        title: '',
        domain: '',
        questions: [{ question: '', answer: '', imageUrl: '', referenceUrl: '', referenceTitle: '' }]
      });
      setCurrentSetId(null);
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentSetId(null);
    setFormData({
      title: '',
      domain: '',
      questions: [{ question: '', answer: '', imageUrl: '', referenceUrl: '', referenceTitle: '' }]
    });
    setUploading({});
    setUploadProgress({});
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be logged in to save question sets');
      return;
    }
    
    if (!formData.title || !formData.domain) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate questions
    const validQuestions = formData.questions.filter(q => q.question.trim() && q.answer.trim());
    if (validQuestions.length === 0) {
      alert('Please add at least one question with an answer');
      return;
    }
    
    try {
      const setData = {
        title: formData.title,
        domain: formData.domain,
        questions: validQuestions,
        userId: currentUser.uid,
        updatedAt: serverTimestamp()
      };
      
      if (isEditMode && currentSetId) {
        // Update existing set
        const setRef = doc(db, 'interviewPrep', currentSetId);
        await updateDoc(setRef, setData);
        
        // Update in state
        setQuestionSets(prev => prev.map(set => 
          set.id === currentSetId 
            ? { ...set, ...setData, updatedAt: new Date() } 
            : set
        ));
      } else {
        // Create new set
        setData.createdAt = serverTimestamp();
        
        const docRef = await addDoc(collection(db, 'interviewPrep'), setData);
        
        // Add to state
        const newSet = {
          ...setData,
          id: docRef.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setQuestionSets(prev => [newSet, ...prev]);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving question set:', error);
      alert('Failed to save question set. Please try again.');
    }
  };

  // Handle delete
  const confirmDelete = (id) => {
    setSetToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!currentUser || !setToDelete) return;

    try {
      // Delete associated images
      const setToDeleteObj = questionSets.find(set => set.id === setToDelete);
      if (setToDeleteObj?.questions) {
        for (const question of setToDeleteObj.questions) {
          if (question.imageUrl && question.imageUrl.includes('firebasestorage.googleapis.com')) {
            try {
              const imageRef = ref(storage, question.imageUrl);
              await deleteObject(imageRef);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'interviewPrep', setToDelete));
      
      // Remove from state
      setQuestionSets(prev => prev.filter(set => set.id !== setToDelete));
      setShowDeleteModal(false);
      setSetToDelete(null);
    } catch (error) {
      console.error('Error deleting question set:', error);
      alert('Failed to delete question set. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSetToDelete(null);
  };

  // Toggle answer visibility
  const toggleAnswer = (setId, questionIndex) => {
    const key = `${setId}-${questionIndex}`;
    setShowAnswers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
    <div className="interview-prep-container">
      {/* Header */}
      <div className="interview-prep-header">
        <div className="header-content">
          <h1 className="interview-prep-title">
            <Target size={32} color="#4a6cf7" />
            Interview Preparation
          </h1>
          <p className="interview-prep-subtitle">
            Create and manage your custom interview question sets by domain
          </p>
        </div>
        <button 
          onClick={() => openModal(false)}
          className="create-set-btn"
        >
          <Plus size={18} />
          <span className="btn-text">Create Question Set</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-filter-controls">
          {/* Search */}
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search question sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Domain Filter */}
          <div className="domain-filter">
            <Filter size={18} color="#64748b" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="domain-select"
            >
              <option value="All">All Domains</option>
              {getUniqueDomains().map(domain => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="results-summary">
          Showing {filteredSets.length} of {questionSets.length} question sets
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          Loading your question sets...
        </div>
      ) : (
        <>
          {filteredSets.length > 0 ? (
            <div className="question-sets-grid">
              {filteredSets.map(set => (
                <div key={set.id} className="question-set-card">
                  {/* Header */}
                  <div className="card-header">
                    <div className="card-title-section">
                      <h3 className="card-title">{set.title}</h3>
                      <div className="domain-tag">{set.domain}</div>
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={() => openModal(true, set)}
                        className="edit-btn"
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(set.id)}
                        className="delete-btn"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="questions-section">
                    <h4 className="questions-title">
                      Questions ({set.questions?.length || 0})
                    </h4>
                    <div className="questions-list">
                      {set.questions?.map((q, index) => (
                        <div key={index} className="question-item">
                          <div className="question-header">
                            <p className="question-text">
                              <span className="question-number">Q{index + 1}:</span> {q.question}
                            </p>
                            <button
                              onClick={() => toggleAnswer(set.id, index)}
                              className="toggle-answer-btn"
                              aria-label="Toggle answer"
                            >
                              {showAnswers[`${set.id}-${index}`] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {showAnswers[`${set.id}-${index}`] && (
                            <div className="answer-container">
                              <p className="answer-text">
                                <span className="answer-label">A:</span> {q.answer}
                              </p>
                              {q.imageUrl && (
                                <div className="answer-image">
                                  <img src={q.imageUrl} alt="Answer illustration" />
                                </div>
                              )}
                              {q.referenceUrl && (
                                <div className="reference-link">
                                  <LinkIcon size={12} />
                                  <a 
                                    href={q.referenceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    {q.referenceTitle || 'Reference Link'}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="card-footer">
                    Updated {formatDate(set.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BookOpen size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">
                {questionSets.length === 0 ? 'No question sets yet' : 'No matching question sets'}
              </h3>
              <p className="empty-state-text">
                {questionSets.length === 0 
                  ? 'Create your first interview question set to get started'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {questionSets.length === 0 && (
                <button 
                  onClick={() => openModal(false)}
                  className="empty-state-btn"
                >
                  <Plus size={18} />
                  Create Your First Question Set
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditMode ? 'Edit Question Set' : 'Create Question Set'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript Fundamentals"
                    required
                    className="form-input"
                  />
                </div>

                {/* Domain */}
                <div className="form-group">
                  <label className="form-label">Domain *</label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Domain</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Questions */}
                <div className="questions-form-section">
                  <div className="questions-form-header">
                    <label className="form-label">Questions & Answers *</label>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="add-question-btn"
                    >
                      <Plus size={14} />
                      <span className="btn-text">Add Question</span>
                    </button>
                  </div>

                  <div className="questions-form-list">
                    {formData.questions.map((q, index) => (
                      <div key={index} className="question-form-item">
                        <div className="question-form-header">
                          <span className="question-badge">
                            Question {index + 1}
                          </span>
                          {formData.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="remove-question-btn"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Question</label>
                          <textarea
                            value={q.question}
                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                            placeholder="Enter your interview question..."
                            rows="2"
                            className="form-textarea question-textarea"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Answer</label>
                          <textarea
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                            placeholder="Enter the answer or key points..."
                            rows="3"
                            className="form-textarea answer-textarea"
                          />
                        </div>

                        {/* Image Upload */}
                        <div className="form-group">
                          <label className="form-label">
                            <ImageIcon size={16} />
                            Image (Optional)
                          </label>
                          {q.imageUrl ? (
                            <div className="image-preview">
                              <img src={q.imageUrl} alt="Answer illustration" />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="remove-image-btn"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="image-upload-container">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) handleImageUpload(index, file);
                                }}
                                className="image-upload-input"
                                ref={el => fileInputRefs.current[index] = el}
                              />
                              <div className="image-upload-label">
                                <Upload size={20} />
                                <span>Click to upload image</span>
                                <small>Max 5MB • JPG, PNG, GIF</small>
                              </div>
                              {uploading[index] && (
                                <div className="upload-progress">
                                  <div 
                                    className="upload-progress-bar"
                                    style={{ width: `${uploadProgress[index] || 0}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Reference URL */}
                        <div className="reference-section">
                          <div className="form-group">
                            <label className="form-label">
                              <LinkIcon size={16} />
                              Reference URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={q.referenceUrl}
                              onChange={(e) => handleQuestionChange(index, 'referenceUrl', e.target.value)}
                              placeholder="https://example.com"
                              className="form-input"
                            />
                          </div>
                          {q.referenceUrl && (
                            <div className="form-group">
                              <label className="form-label">Reference Title</label>
                              <input
                                type="text"
                                value={q.referenceTitle}
                                onChange={(e) => handleQuestionChange(index, 'referenceTitle', e.target.value)}
                                placeholder="Title for the reference link"
                                className="form-input"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button type="button" onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit} className="submit-btn">
                {isEditMode ? 'Update Question Set' : 'Create Question Set'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-body">
              <div className="delete-icon-container">
                <Trash2 size={24} color="#ef4444" />
              </div>
              <h3 className="delete-modal-title">Delete Question Set?</h3>
              <p className="delete-modal-text">
                This action cannot be undone. This will permanently delete your question set and all its questions.
              </p>
              <div className="delete-modal-actions">
                <button onClick={cancelDelete} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleDelete} className="delete-confirm-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Enhanced Responsive Styles for Interview Prep */
        .interview-prep-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          min-height: calc(100vh - 180px);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Header Section - Fully Responsive */
        .interview-prep-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-content {
          flex: 1;
          min-width: 300px;
        }

        .interview-prep-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .interview-prep-subtitle {
          color: #64748b;
          font-size: clamp(0.875rem, 2.5vw, 1rem);
          margin: 0;
          line-height: 1.5;
        }

        .create-set-btn {
          background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
          white-space: nowrap;
          min-width: fit-content;
        }

        .create-set-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74, 108, 247, 0.4);
        }

        /* Search and Filter - Enhanced Responsive */
        .search-filter-section {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
        }

        .search-filter-controls {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #4a6cf7;
          background: white;
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: #fee2e2;
          border: none;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: #ef4444;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          background: #fecaca;
        }

        .domain-filter {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 200px;
        }

        .domain-select {
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          color: #1e293b;
          font-weight: 500;
          min-width: 180px;
        }

        .results-summary {
          margin-top: 16px;
          padding: 8px 16px;
          background: #f1f5f9;
          border-radius: 8px;
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        /* Question Sets Grid - Responsive */
        .question-sets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        /* Question Set Card - Enhanced */
        .question-set-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .question-set-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .card-title-section {
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .domain-tag {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #e0e7ff, #f0f5ff);
          color: #4338ca;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #c7d2fe;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .edit-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-btn {
          color: #4a6cf7;
        }

        .edit-btn:hover {
          background: #f0f5ff;
        }

        .delete-btn {
          color: #ef4444;
        }

        .delete-btn:hover {
          background: #fef2f2;
        }

        /* Questions Section */
        .questions-section {
          flex: 1;
          margin-bottom: 16px;
        }

        .questions-title {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .questions-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .question-item {
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid #e2e8f0;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          gap: 8px;
        }

        .question-text {
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
          margin: 0;
          flex: 1;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .question-number {
          color: #4a6cf7;
          font-weight: 600;
        }

        .toggle-answer-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .toggle-answer-btn:hover {
          background: #e2e8f0;
        }

        .answer-container {
          padding: 12px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-top: 8px;
        }

        .answer-text {
          font-size: 13px;
          color: #475569;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }

        .answer-label {
          color: #059669;
          font-weight: 600;
        }

        .answer-image {
          margin: 12px 0;
        }

        .answer-image img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .reference-link {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 12px;
        }

        .reference-link a {
          color: #4a6cf7;
          text-decoration: none;
          font-weight: 500;
        }

        .reference-link a:hover {
          text-decoration: underline;
        }

        .card-footer {
          font-size: 12px;
          color: #94a3b8;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        /* Modal Styles - Enhanced Responsive */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          padding: 16px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: min(800px, 95vw);
          max-height: min(90vh, 800px);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .modal-close-btn:hover {
          background: #f1f5f9;
          color: #ef4444;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #334155;
          font-size: 14px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #4a6cf7;
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
        }

        .form-select {
          background: white;
          cursor: pointer;
        }

        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #4a6cf7;
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
        }

        .question-textarea {
          min-height: 80px;
        }

        .answer-textarea {
          min-height: 100px;
        }

        /* Questions Form Section */
        .questions-form-section {
          margin-bottom: 24px;
        }

        .questions-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .add-question-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .add-question-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .questions-form-list {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .question-form-item {
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
          position: relative;
        }

        .question-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 12px;
        }

        .question-badge {
          font-size: 12px;
          font-weight: 600;
          color: #4a6cf7;
          background: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #e0e7ff;
        }

        .remove-question-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .remove-question-btn:hover {
          background: #fef2f2;
        }

        /* Image Upload Styles */
        .image-upload-container {
          position: relative;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: #f8fafc;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .image-upload-container:hover {
          border-color: #4a6cf7;
          background: #f0f5ff;
        }

        .image-upload-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .image-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
        }

        .image-upload-label small {
          font-size: 12px;
          color: #94a3b8;
        }

        .image-preview {
          position: relative;
          display: inline-block;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .remove-image-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .remove-image-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .upload-progress {
          margin-top: 8px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .upload-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4a6cf7, #10b981);
          transition: width 0.3s ease;
        }

        /* Reference Section */
        .reference-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        /* Modal Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .cancel-btn {
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          background: white;
          color: #374151;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .submit-btn {
          padding: 12px 20px;
          background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(74, 108, 247, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.4);
        }

        /* Delete Modal */
        .delete-modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .delete-modal-body {
          padding: 24px;
          text-align: center;
        }

        .delete-icon-container {
          width: 48px;
          height: 48px;
          background: #fef2f2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .delete-modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .delete-modal-text {
          color: #64748b;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .delete-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .delete-confirm-btn {
          padding: 12px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-confirm-btn:hover {
          background: #dc2626;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .empty-state-icon {
          margin-bottom: 16px;
          color: #94a3b8;
        }

        .empty-state-title {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .empty-state-text {
          color: #64748b;
          font-size: 1rem;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .empty-state-btn {
          background: linear-gradient(135deg, #4a6cf7, #3b5ce4);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        /* Loading State */
        .loading-container {
          text-align: center;
          padding: 60px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4a6cf7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Button Text Responsive */
        .btn-text {
          display: inline;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .question-sets-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .interview-prep-container {
            padding: 16px;
          }

          .interview-prep-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .create-set-btn {
            width: 100%;
            justify-content: center;
          }

          .search-filter-controls {
            flex-direction: column;
            gap: 16px;
          }

          .search-container {
            min-width: 0;
          }

          .domain-filter {
            min-width: 0;
            width: 100%;
          }

          .domain-select {
            min-width: 0;
            width: 100%;
          }

          .question-sets-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
            gap: 10px;
          }

          .cancel-btn, .submit-btn {
            width: 100%;
          }

          .questions-form-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .add-question-btn {
            width: 100%;
            justify-content: center;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .card-actions {
            align-self: flex-end;
          }
        }

        @media (max-width: 640px) {
          .search-filter-section {
            padding: 20px;
          }

          .question-set-card {
            padding: 20px;
          }

          .modal-content {
            margin: 8px;
            max-width: calc(100vw - 16px);
          }

          .modal-header {
            padding: 16px;
          }

          .modal-body {
            padding: 16px;
          }

          .modal-footer {
            padding: 12px 16px;
          }

          .question-form-item {
            padding: 16px;
          }

          .questions-form-list {
            padding: 12px;
          }

          .btn-text {
            display: none;
          }

          .interview-prep-title {
            justify-content: center;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .interview-prep-container {
            padding: 12px;
          }

          .search-filter-section {
            padding: 16px;
          }

          .question-set-card {
            padding: 16px;
          }

          .card-title {
            font-size: 1.1rem;
          }

          .questions-list {
            max-height: 250px;
          }

          .modal-title {
            font-size: 1.25rem;
          }
        }

        /* Custom Scrollbar */
        .questions-list::-webkit-scrollbar,
        .questions-form-list::-webkit-scrollbar,
        .modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .questions-list::-webkit-scrollbar-track,
        .questions-form-list::-webkit-scrollbar-track,
        .modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .questions-list::-webkit-scrollbar-thumb,
        .questions-form-list::-webkit-scrollbar-thumb,
        .modal-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .questions-list::-webkit-scrollbar-thumb:hover,
        .questions-form-list::-webkit-scrollbar-thumb:hover,
        .modal-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Focus States for Accessibility */
        .create-set-btn:focus,
        .edit-btn:focus,
        .delete-btn:focus,
        .toggle-answer-btn:focus,
        .add-question-btn:focus,
        .remove-question-btn:focus,
        .modal-close-btn:focus,
        .cancel-btn:focus,
        .submit-btn:focus,
        .delete-confirm-btn:focus {
          outline: 2px solid #4a6cf7;
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .question-set-card {
            border-width: 2px;
          }
          
          .form-input, .form-select, .form-textarea {
            border-width: 2px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewPrep;
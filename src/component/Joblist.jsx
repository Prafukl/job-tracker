import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Building, FileText, Briefcase, CheckCircle, X, Edit, Upload, FileIcon, ExternalLink, Search, Plus } from 'lucide-react';
import '../Joblist.css';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db } from '../firebase';
import { addJoblistStyles } from './JoblistStyles';

const Application = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobSource: '',
    jobDomain: '',
    jobUrl: '',
    applicationDate: '',
    jobStatus: 'Applied',
    followUpDate: '',
    followUpCompleted: false,
    jobDescription: '',
    notes: '',
    resumeURL: '',
    resumeName: ''
  });
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfViewUrl, setPdfViewUrl] = useState('');
  const [pdfViewTitle, setPdfViewTitle] = useState('');
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();
  const storage = getStorage();

  // Domain categories for different career fields
  const domainCategories = [
    'Software Engineering',
    'Data Engineering', 
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cloud Computing',
    'IT Support',
    'Cybersecurity',
    'Network Administration',
    'Database Administration',
    'System Administration',
    'UX/UI Design',
    'Graphic Design',
    'Product Management',
    'Project Management',
    'Business Analyst',
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Engineer',
    'Quality Assurance',
    'Technical Writing',
    'Sales Engineer',
    'Customer Success',
    'Marketing',
    'Finance',
    'Human Resources',
    'Operations',
    'Consulting',
    'Other'
  ];

  // Status options including "Not Applied"
  const statusOptions = [
    'Not Applied',
    'Applied', 
    'Interview',
    'Offer',
    'Rejected'
  ];

  // Filter options for the dropdown
  const filterOptions = [
    'All',
    'Not Applied',
    'Applied',
    'Interview', 
    'Offer',
    'Rejected'
  ];

  // Load applications from Firestore on component mount and when user changes
  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) {
        setApplications([]);
        setFilteredApplications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedApplications = [];
        querySnapshot.forEach((doc) => {
          fetchedApplications.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setApplications(fetchedApplications);
        setFilteredApplications(fetchedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Add custom styles when component mounts
    const removeStyles = addJoblistStyles();
    
    // Cleanup styles when component unmounts
    return () => removeStyles();
  }, [currentUser]);

  // Filter applications based on status, domain, company, and search term
  useEffect(() => {
    let filtered = applications;

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(app => app.jobStatus === statusFilter);
    }

    // Domain filter
    if (domainFilter !== 'All') {
      filtered = filtered.filter(app => app.jobDomain === domainFilter);
    }

    // Company filter
    if (companyFilter !== 'All') {
      filtered = filtered.filter(app => app.companyName === companyFilter);
    }

    // Search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.jobTitle?.toLowerCase().includes(searchLower) ||
        app.companyName?.toLowerCase().includes(searchLower) ||
        app.jobDomain?.toLowerCase().includes(searchLower) ||
        app.notes?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, domainFilter, companyFilter, searchTerm]);

  // Get unique companies and domains for filter dropdowns
  const getUniqueCompanies = () => {
    const companies = [...new Set(applications.map(app => app.companyName).filter(Boolean))];
    return companies.sort();
  };

  const getUniqueDomains = () => {
    const domains = [...new Set(applications.map(app => app.jobDomain).filter(Boolean))];
    return domains.sort();
  };

  const openModal = (isEdit = false, application = null) => {
    if (isEdit && application) {
      // Set form data for editing
      setFormData({
        jobTitle: application.jobTitle || '',
        companyName: application.companyName || '',
        jobSource: application.jobSource || '',
        jobDomain: application.jobDomain || '',
        jobUrl: application.jobUrl || '',
        applicationDate: application.applicationDate || new Date().toISOString().split('T')[0],
        jobStatus: application.jobStatus || 'Applied',
        followUpDate: application.followUpDate || '',
        followUpCompleted: application.followUpCompleted || false,
        jobDescription: application.jobDescription || '',
        notes: application.notes || '',
        resumeURL: application.resumeURL || '',
        resumeName: application.resumeName || ''
      });
      setCurrentApplicationId(application.id);
      setIsEditMode(true);
    } else {
      // Clear form data for new application
      setFormData({
        jobTitle: '',
        companyName: '',
        jobSource: '',
        jobDomain: '',
        jobUrl: '',
        applicationDate: new Date().toISOString().split('T')[0],
        jobStatus: 'Not Applied',
        followUpDate: '',
        followUpCompleted: false,
        jobDescription: '',
        notes: '',
        resumeURL: '',
        resumeName: ''
      });
      setCurrentApplicationId(null);
      setIsEditMode(false);
    }
    // Reset file state
    setResumeFile(null);
    setUploadProgress(0);
    setUploading(false);
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentApplicationId(null);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        return;
      }
      
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      
      setResumeFile(file);
    }
  };
  
  const removeSelectedFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  const handleRemoveUploadedResume = async () => {
    if (formData.resumeURL && currentUser) {
      try {
        // Create a reference to the file to delete
        const fileRef = ref(storage, formData.resumeURL);
        await deleteObject(fileRef);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          resumeURL: '',
          resumeName: ''
        }));
        
        // If in edit mode, update the document immediately
        if (isEditMode && currentApplicationId) {
          const applicationRef = doc(db, 'applications', currentApplicationId);
          await updateDoc(applicationRef, {
            resumeURL: '',
            resumeName: ''
          });
        }
      } catch (error) {
        console.error('Error removing resume:', error);
        alert('Failed to remove resume. Please try again.');
      }
    }
  };
  
  const uploadResume = async () => {
    if (!resumeFile || !currentUser) return null;
    
    try {
      setUploading(true);
      
      // Path in storage: resumes/userId/timestamp_filename.pdf
      const timestamp = Date.now();
      const fileName = resumeFile.name;
      const storagePath = `resumes/${currentUser.uid}/${timestamp}_${fileName}`;
      const storageRef = ref(storage, storagePath);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, resumeFile);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
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
              setFormData(prev => ({
                ...prev,
                resumeURL: downloadURL,
                resumeName: fileName
              }));
              setUploading(false);
              setUploadProgress(0);
              resolve({
                url: downloadURL,
                name: fileName,
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
  
  const openPdfViewer = (url, title) => {
    setPdfViewUrl(url);
    setPdfViewTitle(title);
    setShowPdfModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be logged in to save applications');
      return;
    }
    
    if (!formData.jobTitle || !formData.companyName || !formData.applicationDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Handle resume upload if a new file is selected
      let resumeData = {
        resumeURL: formData.resumeURL,
        resumeName: formData.resumeName
      };
      
      if (resumeFile) {
        const uploadResult = await uploadResume();
        if (uploadResult) {
          resumeData = {
            resumeURL: uploadResult.url,
            resumeName: uploadResult.name
          };
        }
      }
      
      if (isEditMode && currentApplicationId) {
        // Update existing application
        const applicationRef = doc(db, 'applications', currentApplicationId);
        await updateDoc(applicationRef, {
          ...formData,
          ...resumeData,
          updatedAt: serverTimestamp()
        });
        
        // Update in state
        setApplications(prev => prev.map(app => 
          app.id === currentApplicationId 
            ? { ...app, ...formData, ...resumeData, updatedAt: new Date().toISOString() } 
            : app
        ));
      } else {
        // Save new application to Firestore
        const docRef = await addDoc(collection(db, 'applications'), {
          ...formData,
          ...resumeData,
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        
        // Update user profile to increment application count
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          applications: applications.length + 1,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        // Add to state
        const newApplication = {
          ...formData,
          ...resumeData,
          id: docRef.id,
          userId: currentUser.uid,
          createdAt: new Date().toISOString() // Use client date for immediate display
        };
        
        setApplications(prev => [...prev, newApplication]);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save application. Please try again.');
    }
  };

  const confirmDelete = (id) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const applicationToDeleteObj = applications.find(app => app.id === applicationToDelete);
      
      // Delete resume from storage if exists
      if (applicationToDeleteObj && applicationToDeleteObj.resumeURL) {
        try {
          // Create a reference to the file to delete
          const fileRef = ref(storage, applicationToDeleteObj.resumeURL);
          await deleteObject(fileRef);
        } catch (error) {
          console.error('Error deleting resume file:', error);
          // Continue with application deletion even if resume deletion fails
        }
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'applications', applicationToDelete));
      
      // Update user profile to decrement application count
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        applications: Math.max(0, applications.length - 1),
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      // Remove from state
      setApplications(prev => prev.filter(app => app.id !== applicationToDelete));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const toggleFollowUp = async (app) => {
    if (!currentUser) return;
    
    try {
      const newStatus = !app.followUpCompleted;
      
      // Update in Firestore
      const applicationRef = doc(db, 'applications', app.id);
      await updateDoc(applicationRef, {
        followUpCompleted: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Update in state
      setApplications(prev => prev.map(item => 
        item.id === app.id 
          ? { ...item, followUpCompleted: newStatus } 
          : item
      ));
    } catch (error) {
      console.error('Error updating follow-up status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Applied': return 'status-not-applied';
      case 'Applied': return 'status-applied';
      case 'Interview': return 'status-interview';
      case 'Offer': return 'status-offer';
      case 'Rejected': return 'status-rejected';
      default: return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="application-container">
      <div className="main-content">
        <div className="controls">
          <div className="filters-section">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-group">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, domains..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="filter-pills-container">
              <div className="filter-pills">
                {/* Status Filter */}
                <div className="filter-pill">
                  <div className="filter-pill-header">
                    <div className="filter-pill-icon">
                      <CheckCircle size={16} />
                    </div>
                    <span className="filter-pill-label">Status</span>
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-pill-select"
                  >
                    <option value="All">All Status</option>
                    {filterOptions.slice(1).map(option => (
                      <option key={option} value={option}>
                        {option} ({applications.filter(app => app.jobStatus === option).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Domain Filter */}
                <div className="filter-pill">
                  <div className="filter-pill-header">
                    <div className="filter-pill-icon">
                      <Briefcase size={16} />
                    </div>
                    <span className="filter-pill-label">Domain</span>
                  </div>
                  <select 
                    value={domainFilter} 
                    onChange={(e) => setDomainFilter(e.target.value)}
                    className="filter-pill-select"
                  >
                    <option value="All">All Domains</option>
                    {getUniqueDomains().map(domain => (
                      <option key={domain} value={domain}>
                        {domain} ({applications.filter(app => app.jobDomain === domain).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Filter */}
                <div className="filter-pill">
                  <div className="filter-pill-header">
                    <div className="filter-pill-icon">
                      <Building size={16} />
                    </div>
                    <span className="filter-pill-label">Company</span>
                  </div>
                  <select 
                    value={companyFilter} 
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="filter-pill-select"
                  >
                    <option value="All">All Companies</option>
                    {getUniqueCompanies().map(company => (
                      <option key={company} value={company}>
                        {company} ({applications.filter(app => app.companyName === company).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters & Clear All */}
              {(statusFilter !== 'All' || domainFilter !== 'All' || companyFilter !== 'All' || searchTerm) && (
                <div className="active-filters">
                  <span className="active-filters-label">Active filters:</span>
                  <div className="active-filter-tags">
                    {searchTerm && (
                      <div className="active-filter-tag">
                        <span>"{searchTerm}"</span>
                        <button onClick={() => setSearchTerm('')}>
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {statusFilter !== 'All' && (
                      <div className="active-filter-tag">
                        <span>Status: {statusFilter}</span>
                        <button onClick={() => setStatusFilter('All')}>
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {domainFilter !== 'All' && (
                      <div className="active-filter-tag">
                        <span>Domain: {domainFilter}</span>
                        <button onClick={() => setDomainFilter('All')}>
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {companyFilter !== 'All' && (
                      <div className="active-filter-tag">
                        <span>Company: {companyFilter}</span>
                        <button onClick={() => setCompanyFilter('All')}>
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <button 
                    className="clear-all-filters-btn"
                    onClick={() => {
                      setStatusFilter('All');
                      setDomainFilter('All');
                      setCompanyFilter('All');
                      setSearchTerm('');
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="results-summary">
              <span className="results-count">
                Showing {filteredApplications.length} of {applications.length} applications
              </span>
            </div>
          </div>
          
          <button onClick={() => openModal(false)} className="add-button">
            <Plus size={18} />
            Add Application
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading your applications...
          </div>
        ) : (
          <>
            <div className="applications-grid">
              {filteredApplications.map(app => (
                <div key={app.id} className="application-card">
                  <div className="card-top-section">
                    <div className="title-section">
                      <h3 className="job-title">{app.jobTitle}</h3>
                      <div className="company-info">
                        <Building className="icon" />
                        <span className="company-name">{app.companyName}</span>
                      </div>
                      {app.jobDomain && (
                        <div className="domain-info">
                          <span className="domain-tag">{app.jobDomain}</span>
                        </div>
                      )}
                    </div>
                    <div className={`status-badge ${getStatusColor(app.jobStatus)}`}>
                      {app.jobStatus}
                    </div>
                  </div>
                  
                  <div className="card-details">
                    <div className="detail-item">
                      <FileText className="icon" />
                      <span>Source: {app.jobSource || 'Not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar className="icon" />
                      <span>
                        {app.jobStatus === 'Not Applied' ? 'Target Date: ' : 'Applied: '}
                        {formatDate(app.applicationDate)}
                      </span>
                    </div>
                    {app.jobUrl && app.jobStatus === 'Not Applied' && (
                      <div className="detail-item">
                        <ExternalLink className="icon" size={16} />
                        <a 
                          href={app.jobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="job-url-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Job Posting
                        </a>
                      </div>
                    )}
                    {app.resumeURL && (
                      <div 
                        className="resume-indicator"
                        onClick={() => openPdfViewer(app.resumeURL, `${app.jobTitle} - ${app.companyName} Resume`)}
                      >
                        <FileIcon size={16} />
                        <span>View Resume</span>
                      </div>
                    )}
                  </div>
                  <div className="card-bottom-section">
                    {app.followUpDate && (
                      <div className="follow-up-item" onClick={() => toggleFollowUp(app)} style={{cursor: 'pointer'}}>
                        <Clock className="icon follow-up" />
                        <span className={app.followUpCompleted ? "completed" : ""}>
                          Follow-up: {formatDate(app.followUpDate)}
                        </span>
                        {app.followUpCompleted && (
                          <CheckCircle className="completed-icon" />
                        )}
                      </div>
                    )}
                    <div className="card-actions">
                      <button 
                        onClick={() => openModal(true, app)} 
                        className="edit-button"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Edit className="icon" size={18} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(app.id)} 
                        className="delete-button"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <X className="icon" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <Briefcase className="icon" />
                </div>
                <h3>
                  {applications.length === 0 
                    ? 'No applications yet' 
                    : `No applications match your filters`}
                </h3>
                <p>
                  {applications.length === 0 
                    ? 'Start tracking your job applications today'
                    : searchTerm 
                      ? `No applications found for "${searchTerm}"`
                      : 'Try adjusting your filters to see more results.'}
                </p>
                {applications.length === 0 && (
                  <button onClick={() => openModal(false)} className="add-button">
                    Add Your First Application
                  </button>
                )}
                {applications.length > 0 && (
                  <button 
                    onClick={() => {
                      setStatusFilter('All');
                      setDomainFilter('All');
                      setCompanyFilter('All');
                      setSearchTerm('');
                    }} 
                    className="clear-filters-button"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Confirm Deletion</h2>
              <button onClick={cancelDelete} className="close-button" aria-label="Close">
                <X className="icon" />
              </button>
            </div>
            <div className="modal-form">
              <p>Are you sure you want to delete this application? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleDelete} className="submit-button delete-confirm-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>{isEditMode ? 'Edit Application' : 'Add New Application'}</h2>
              <button onClick={closeModal} className="close-button" aria-label="Close">
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="jobTitle" className="form-label">
                  Job Title*
                </label>
                <input 
                  type="text" 
                  id="jobTitle" 
                  value={formData.jobTitle} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name*
                </label>
                <input 
                  type="text" 
                  id="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jobDomain" className="form-label">
                    Domain/Field*
                  </label>
                  <select 
                    id="jobDomain" 
                    value={formData.jobDomain} 
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select Domain</option>
                    {domainCategories.map(domain => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="jobSource" className="form-label">
                    Source
                  </label>
                  <select 
                    id="jobSource" 
                    value={formData.jobSource} 
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Source</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Job Board">Job Board</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {formData.jobStatus === 'Not Applied' && (
                <div className="form-group">
                  <label htmlFor="jobUrl" className="form-label">
                    Job URL
                  </label>
                  <input 
                    type="url" 
                    id="jobUrl" 
                    value={formData.jobUrl} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/job-posting"
                  />
                  <small className="form-hint">
                    Save the job posting URL so you can easily apply later
                  </small>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicationDate" className="form-label">
                    {formData.jobStatus === 'Not Applied' ? 'Target Date*' : 'Application Date*'}
                  </label>
                  <input 
                    type="date" 
                    id="applicationDate" 
                    value={formData.applicationDate} 
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="jobStatus" className="form-label">
                    Status*
                  </label>
                  <select 
                    id="jobStatus" 
                    value={formData.jobStatus} 
                    onChange={handleChange}
                    className="form-input"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="followUpDate" className="form-label">
                    Follow-up Date
                  </label>
                  <input 
                    type="date" 
                    id="followUpDate" 
                    value={formData.followUpDate} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="form-label checkbox-label">
                    <input 
                      type="checkbox" 
                      id="followUpCompleted" 
                      checked={formData.followUpCompleted} 
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    Follow-up Completed
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="jobDescription" className="form-label">
                  Job Description
                </label>
                <textarea 
                  id="jobDescription" 
                  value={formData.jobDescription} 
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Paste the job description here..."
                ></textarea>
              </div>
              
              <div className="file-upload-container">
                <label className="file-upload-label">Resume (PDF, max 10MB)</label>
                {formData.resumeURL ? (
                  <div className="file-preview">
                    <FileIcon className="file-preview-icon" size={20} />
                    <span className="file-preview-name">{formData.resumeName}</span>
                    <button 
                      type="button" 
                      className="file-preview-remove"
                      onClick={handleRemoveUploadedResume}
                      title="Remove resume"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : resumeFile ? (
                  <div className="file-preview">
                    <FileIcon className="file-preview-icon" size={20} />
                    <span className="file-preview-name">{resumeFile.name}</span>
                    <span className="file-preview-size">{formatFileSize(resumeFile.size)}</span>
                    {uploading ? (
                      <span>{Math.round(uploadProgress)}%</span>
                    ) : (
                      <button 
                        type="button" 
                        className="file-preview-remove"
                        onClick={removeSelectedFile}
                        title="Remove selected file"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="file-upload-input-container">
                    <Upload className="file-upload-icon" size={24} />
                    <span className="file-upload-text">Click to upload or drag and drop</span>
                    <span className="file-upload-hint">PDF only, max 10MB</span>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange}
                      className="file-upload-input"
                      ref={fileInputRef}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditMode ? 'Update' : 'Save'} Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdfModal && (
        <div className="pdf-modal-overlay" onClick={() => setShowPdfModal(false)}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3 className="pdf-modal-title">{pdfViewTitle}</h3>
              <button 
                className="pdf-modal-close"
                onClick={() => setShowPdfModal(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="pdf-modal-body">
              <iframe
                className="pdf-iframe"
                src={`${pdfViewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                title="Resume PDF Viewer"
                allow="fullscreen"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Application;
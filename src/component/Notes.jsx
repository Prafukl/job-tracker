import { useState, useEffect, useRef } from 'react';
import { 
  Pencil, Trash2, Plus, X, Bold, Italic, Underline, Link, Image, 
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Book, Code
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
import { addNotesStyles } from './NotesStyles';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [noteImages, setNoteImages] = useState([]);
  const [editorInitialized, setEditorInitialized] = useState(false);
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();
  const storage = getStorage();

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

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' bytes';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  // Rich Text Editor Functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      // Save the current content
      const currentHTML = editorRef.current.innerHTML;
      setContent(currentHTML);
      
      // Check if any images in the content aren't in noteImages and add them
      const contentImages = editorRef.current.querySelectorAll('img');
      const imageUrls = Array.from(contentImages).map(img => img.src);
      
      // Find images that are in the content but not tracked in noteImages
      const missingImages = imageUrls.filter(url => {
        return !noteImages.some(img => img.url === url);
      });
      
      // If we find any untracked images, add them to noteImages
      if (missingImages.length > 0) {
        const newNoteImages = [...noteImages];
        
        missingImages.forEach(url => {
          // Only add if it's a Firebase Storage URL (contains firebasestorage.googleapis.com)
          if (url.includes('firebasestorage.googleapis.com')) {
            // Try to extract path from URL
            const pathMatch = url.match(/notes-images\/[^?]+/);
            const path = pathMatch ? pathMatch[0] : '';
            
            newNoteImages.push({
              name: `image_${Date.now()}.jpg`,
              url: url,
              path: path,
              type: 'image/jpeg',
              size: 0,
              timestamp: Date.now()
            });
          }
        });
        
        setNoteImages(newNoteImages);
      }
    }
  };
  
  const insertImage = (url, altText = 'Image') => {
    if (url && editorRef.current) {
      // Create the image element with proper styling
      const imgHTML = `<img src="${url}" alt="${altText}" style="max-width: 100%; height: auto; margin: 10px 0; display: block;" />`;
      
      // Focus the editor first
      editorRef.current.focus();
      
      // Get current selection
      const selection = window.getSelection();
      
      // Insert at cursor or append to end
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Check if the selection is within the editor
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          // Delete any selected content
          range.deleteContents();
          
          // Insert the image HTML
          const fragment = document.createRange().createContextualFragment(imgHTML);
          range.insertNode(fragment);
          
          // Move cursor after the image
          range.collapse(false);
          
          // Update editor content state
          handleContentChange();
        } else {
          // If selection is outside editor, append to end
          editorRef.current.innerHTML += imgHTML;
          handleContentChange();
        }
      } else {
        // No selection, append to end
        editorRef.current.innerHTML += imgHTML;
        handleContentChange();
      }
    }
  };
  
  const handleEditorPaste = (e) => {
    // Handle paste event
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editorRef.current) {
      editorRef.current.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editorRef.current) {
      editorRef.current.classList.remove('drag-over');
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editorRef.current) {
      editorRef.current.classList.remove('drag-over');
      
      // Get dropped files
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        
        // Check if it's an image
        if (file.type.startsWith('image/')) {
          // Check file size (5MB max)
          if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit.');
            return;
          }
          
          // Set as selected image and trigger upload
          setSelectedImage(file);
          // Use setTimeout to ensure state is updated before we call upload
          setTimeout(() => {
            uploadImage();
          }, 100);
        } else {
          alert('Only image files are allowed.');
        }
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      
      setSelectedImage(file);
    }
  };
  
  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async () => {
    if (!selectedImage || !currentUser) return null;
    
    try {
      setImageUploading(true);
      
      // Path in storage: notes-images/userId/timestamp_filename.ext
      const timestamp = Date.now();
      const fileName = selectedImage.name.replace(/[^a-zA-Z0-9.]/g, '_'); // Sanitize filename
      const storagePath = `notes-images/${currentUser.uid}/${timestamp}_${fileName}`;
      const storageRef = ref(storage, storagePath);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            setImageUploading(false);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Add to note images
              const newImage = {
                name: fileName,
                url: downloadURL,
                path: storagePath,
                type: selectedImage.type,
                size: selectedImage.size,
                timestamp
              };
              
              setNoteImages(prev => [...prev, newImage]);
              setSelectedImage(null);
              setImageUploading(false);
              setUploadProgress(0);
              
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              
              // Insert image into editor
              insertImage(downloadURL, fileName);
              
              resolve(newImage);
            } catch (error) {
              console.error('Error getting download URL:', error);
              setImageUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Upload setup error:', error);
      setImageUploading(false);
      return null;
    }
  };

  const handleRemoveImage = async (imagePath) => {
    try {
      // Create a reference to the file to delete
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      
      // Update note images
      setNoteImages(prev => prev.filter(img => img.path !== imagePath));
      
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image. Please try again.');
    }
  };

  const openEditor = (isEdit = false, note = null) => {
    if (isEdit && note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCurrentNoteId(note.id);
      setIsEditMode(true);
      setNoteImages(note.images || []);
    } else {
      setTitle('');
      setContent('');
      setCurrentNoteId(null);
      setIsEditMode(false);
      setNoteImages([]);
    }
    
    setSelectedImage(null);
    setImageUploading(false);
    setUploadProgress(0);
    setEditorInitialized(false);
    
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setTitle('');
    setContent('');
    setCurrentNoteId(null);
    setIsEditMode(false);
    setSelectedImage(null);
    setImageUploading(false);
    setUploadProgress(0);
    setNoteImages([]);
    setEditorInitialized(false);
  };

  const confirmDeleteNote = (id) => {
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const handleDeleteNote = async () => {
    if (!currentUser || !noteToDelete) return;

    try {
      // Find the note to delete
      const noteToDeleteObj = notes.find(note => note.id === noteToDelete);
      
      // Delete any images associated with the note
      if (noteToDeleteObj?.images && noteToDeleteObj.images.length > 0) {
        for (const image of noteToDeleteObj.images) {
          try {
            const imageRef = ref(storage, image.path);
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue with note deletion even if image deletion fails
          }
        }
      }
      
      // Delete the note from Firestore
      await deleteDoc(doc(db, 'notes', noteToDelete));
      
      // Update state
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be logged in to save notes');
      return;
    }
    
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }
    
    try {
      // Get content from the editor
      const currentContent = editorRef.current ? editorRef.current.innerHTML : content;
      
      const noteData = {
        title,
        content: currentContent,
        userId: currentUser.uid,
        images: noteImages,
        updatedAt: serverTimestamp()
      };
      
      if (isEditMode && currentNoteId) {
        // Update existing note
        const noteRef = doc(db, 'notes', currentNoteId);
        await updateDoc(noteRef, noteData);
        
        // Update in state
        setNotes(prev => prev.map(note => 
          note.id === currentNoteId 
            ? { 
                ...note, 
                ...noteData, 
                updatedAt: new Date() 
              } 
            : note
        ));
      } else {
        // Create new note
        noteData.createdAt = serverTimestamp();
        
        const docRef = await addDoc(collection(db, 'notes'), noteData);
        
        // Add to state
        const newNote = {
          ...noteData,
          id: docRef.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setNotes(prev => [newNote, ...prev]);
      }
      
      closeEditor();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  // Load notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      if (!currentUser) {
        setNotes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const notesRef = collection(db, 'notes');
        const q = query(
          notesRef, 
          where('userId', '==', currentUser.uid),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedNotes = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedNotes.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          });
        });
        
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
    
    // Add custom styles
    const removeStyles = addNotesStyles();
    
    // Cleanup
    return () => removeStyles();
  }, [currentUser]);

  // Initialize editor content when editor opens
  useEffect(() => {
    if (isEditorOpen && editorRef.current && !editorInitialized) {
      if (content) {
        editorRef.current.innerHTML = content;
      }
      setEditorInitialized(true);
    }
  }, [isEditorOpen, content, editorInitialized]);

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1 className="notes-title">My Notes</h1>
        <div className="notes-actions">
          <button 
            className="create-note-btn"
            onClick={() => openEditor(false)}
          >
            <Plus size={18} />
            <span>Create Note</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading your notes...
        </div>
      ) : (
        <>
          {notes.length > 0 ? (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <div>
                      <h3 className="note-title">{note.title}</h3>
                      <div className="note-date">
                        {formatDate(note.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="note-content">
                    <div 
                      className="note-content-preview"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>
                  <div className="note-footer">
                    <button 
                      className="note-action-btn edit-btn"
                      onClick={() => openEditor(true, note)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="note-action-btn delete-btn"
                      onClick={() => confirmDeleteNote(note.id)}
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-notes">
              <div className="empty-notes-icon">
                <Book size={50} />
              </div>
              <h3>No Notes Yet</h3>
              <p>Create your first note to get started!</p>
              <button 
                className="create-note-btn"
                onClick={() => openEditor(false)}
              >
                <Plus size={18} />
                <span>Create Note</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-top">
              <h2>Confirm Deletion</h2>
              <button onClick={cancelDelete} className="close-button" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="modal-form">
              <p>Are you sure you want to delete this note? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleDeleteNote} className="submit-button delete-confirm-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <div className="note-editor-overlay" onClick={closeEditor}>
          <div className="note-editor" onClick={(e) => e.stopPropagation()}>
            <div className="editor-header">
              <h2 className="editor-title">
                {isEditMode ? 'Edit Note' : 'Create Note'}
              </h2>
              <button 
                className="editor-close"
                onClick={closeEditor}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="editor-body">
              <form className="editor-form" onSubmit={handleSaveNote}>
                <div className="editor-input-group">
                  <label htmlFor="note-title" className="editor-label">Title</label>
                  <input
                    type="text"
                    id="note-title"
                    className="editor-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                    required
                  />
                </div>
                
                <div className="editor-input-group">
                  <label className="editor-label">Content</label>
                  <div className="rich-editor-container">
                    <div className="rich-editor-toolbar">
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('bold')}
                        title="Bold"
                      >
                        <Bold size={16} />
                      </button>
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('italic')}
                        title="Italic"
                      >
                        <Italic size={16} />
                      </button>
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('underline')}
                        title="Underline"
                      >
                        <Underline size={16} />
                      </button>
                      
                      <div className="toolbar-divider"></div>
                      
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('insertUnorderedList')}
                        title="Bullet List"
                      >
                        <List size={16} />
                      </button>
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('insertOrderedList')}
                        title="Numbered List"
                      >
                        <ListOrdered size={16} />
                      </button>
                      
                      <div className="toolbar-divider"></div>
                      
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('justifyLeft')}
                        title="Align Left"
                      >
                        <AlignLeft size={16} />
                      </button>
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('justifyCenter')}
                        title="Align Center"
                      >
                        <AlignCenter size={16} />
                      </button>
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('justifyRight')}
                        title="Align Right"
                      >
                        <AlignRight size={16} />
                      </button>
                      
                      <div className="toolbar-divider"></div>
                      
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={insertLink}
                        title="Insert Link"
                      >
                        <Link size={16} />
                      </button>
                      
                      <button 
                        type="button"
                        className="toolbar-btn"
                        onClick={() => execCommand('formatBlock', '<pre>')}
                        title="Code Block"
                      >
                        <Code size={16} />
                      </button>
                      
                      {selectedImage ? (
                        <button 
                          type="button"
                          className="toolbar-btn"
                          onClick={uploadImage}
                          disabled={imageUploading}
                          title="Upload Selected Image"
                        >
                          {imageUploading ? (
                            `${Math.round(uploadProgress)}%`
                          ) : (
                            <>
                              <Image size={16} />
                              <span>Upload</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <label className="toolbar-btn">
                          <Image size={16} />
                          <span>Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                          />
                        </label>
                      )}
                    </div>
                    
                    <div
                      className="rich-editor-content"
                      contentEditable
                      ref={editorRef}
                      onInput={handleContentChange}
                      onPaste={handleEditorPaste}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={{ direction: 'ltr', textAlign: 'left' }}
                    ></div>
                  </div>
                </div>
                
                {selectedImage && !imageUploading && (
                  <div className="image-preview">
                    <div>
                      <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Preview" 
                        className="preview-image" 
                      />
                    </div>
                    <div>
                      <p>{selectedImage.name}</p>
                      <p>{formatFileSize(selectedImage.size)}</p>
                    </div>
                    <button 
                      type="button" 
                      className="file-preview-remove"
                      onClick={removeSelectedImage}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                <div className="editor-footer">
                  <button 
                    type="button"
                    className="editor-btn cancel-btn"
                    onClick={closeEditor}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="editor-btn save-btn"
                  >
                    {isEditMode ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
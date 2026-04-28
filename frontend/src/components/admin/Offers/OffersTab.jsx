import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, X, ChevronLeft, ChevronRight, Monitor, Calendar, Tag } from 'lucide-react';
import { PremiumAdPanel } from '../../AdPanels';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api/admin`;

// Premium Color Constants
const COLORS = {
  MAROON: '#4A0404',
  GOLD: '#C5A059',
  OBSIDIAN: '#1A1A1A',
  PEARL: '#F4F4F4'
};

export default function OffersTab() {
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setOffersLoading(true);
      const response = await axios.get(`${API}/offers`);
      let offersData = response.data.data || response.data;
      
      // If no offers exist, create a persistent demo one for carousel testing
      if (!offersData || offersData.length === 0) {
        const demoOffer = {
          _id: 'demo-carousel-offer',  // Consistent ID for persistence
          title: 'Featured Campaign',
          type: 'Discount',
          discount_value: 20,
          discount_type: 'percentage',
          active: true,
          carousel_images: [],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        offersData = [demoOffer];
      }
      
      setOffers(offersData);
      
      // Load carousel images from the first offer (if it exists)
      if (offersData && offersData.length > 0) {
        const firstOffer = offersData[0];
        let existingImages = Array.isArray(firstOffer.carousel_images) && firstOffer.carousel_images.length > 0 
          ? firstOffer.carousel_images 
          : [];
        
        // Convert relative URLs to absolute URLs
        existingImages = existingImages.map(url => 
          url.startsWith('http') || url.startsWith('blob:') 
            ? url 
            : `${BACKEND_URL}${url}`
        );
        
        setCarouselImages(existingImages);
      }
      
      setOffersLoading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Create persistent demo offer on error
      const demoOffer = {
        _id: 'demo-carousel-offer',  // Consistent ID for persistence
        title: 'Featured Campaign',
        type: 'Discount',
        discount_value: 20,
        discount_type: 'percentage',
        active: true,
        carousel_images: [],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      setOffers([demoOffer]);
      setCarouselImages([]); // Empty carousel for demo offer
      setOffersLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (window.confirm('Confirm Deletion? This action is irreversible.')) {
      try {
        await axios.delete(`${API}/offers/${offerId}`);
        setOffers(offers.filter(offer => offer._id !== offerId));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // ... (Keep existing logic for openImageModal, handleImageUpload, removeCarouselImage, nextImage, prevImage)
  const openImageModal = async (offer) => {
    setSelectedOffer(offer);
    // Fetch fresh offer data from backend to get latest carousel images
    try {
      const response = await axios.get(`${API}/offers/${offer._id}`);
      const freshOffer = response.data.data || response.data;
      let existingImages = Array.isArray(freshOffer.carousel_images) && freshOffer.carousel_images.length > 0 
        ? freshOffer.carousel_images 
        : [];
      
      // Convert relative URLs to absolute URLs
      existingImages = existingImages.map(url => 
        url.startsWith('http') || url.startsWith('blob:') 
          ? url 
          : `${BACKEND_URL}${url}`
      );
      
      setCarouselImages(existingImages);
    } catch (error) {
      console.warn('Could not fetch fresh offer data, using local data:', error);
      // Fallback to local offer data
      let existingImages = Array.isArray(offer.carousel_images) && offer.carousel_images.length > 0 
        ? offer.carousel_images 
        : [];
      
      // Convert relative URLs to absolute URLs
      existingImages = existingImages.map(url => 
        url.startsWith('http') || url.startsWith('blob:') 
          ? url 
          : `${BACKEND_URL}${url}`
      );
      
      setCarouselImages(existingImages);
    }
    setCurrentImageIndex(0);
    setShowImageModal(true);
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || !selectedOffer) return;

    setUploadingImage(true);
    try {
      for (let file of files) {
        // Create a local blob URL immediately for preview
        const blobUrl = URL.createObjectURL(file);
        setCarouselImages(prev => [...prev, blobUrl]);
        
        // Try to upload to backend if available
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post(`${API}/offers/${selectedOffer._id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          if (response.data.image_url) {
            // Convert relative URL to absolute URL with backend domain
            const absoluteImageUrl = response.data.image_url.startsWith('http') 
              ? response.data.image_url 
              : `${BACKEND_URL}${response.data.image_url}`;
            
            // Replace blob URL with server URL if upload succeeded
            setCarouselImages(prev => 
              prev.map(img => img === blobUrl ? absoluteImageUrl : img)
            );
            
            // Refresh offers to sync database state
            const offersResponse = await axios.get(`${API}/offers`);
            let offersData = offersResponse.data.data || offersResponse.data;
            setOffers(offersData);
          }
        } catch (uploadError) {
          console.warn('Backend upload failed:', uploadError.message);
          // Keep the blob URL for local preview
        }
      }
    } catch (error) {
      console.error('Error preparing image:', error);
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (event.target) event.target.value = '';
    }
  };

  const removeCarouselImage = async (index) => {
    try {
      const imageUrl = carouselImages[index];
      
      // Try to delete from backend if it's a server URL (not a blob URL)
      if (!imageUrl.startsWith('blob:')) {
        // Extract just the relative path for the backend (in case it's an absolute URL)
        let urlToSend = imageUrl;
        if (imageUrl.startsWith('http://localhost:8000')) {
          urlToSend = imageUrl.replace('http://localhost:8000', '');
        } else if (imageUrl.startsWith('http://localhost:3000')) {
          urlToSend = imageUrl.replace('http://localhost:3000', '');
        }
        
        await axios.delete(`${API}/offers/${selectedOffer._id}/images`, {
          data: { image_url: urlToSend }
        });
      } else {
        // For blob URLs, just revoke them
        URL.revokeObjectURL(imageUrl);
      }

      const updatedImages = carouselImages.filter((_, i) => i !== index);
      setCarouselImages(updatedImages);
      
      // Adjust current image index if needed
      if (currentImageIndex >= updatedImages.length && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from UI even if backend fails
      const updatedImages = carouselImages.filter((_, i) => i !== index);
      setCarouselImages(updatedImages);
      if (currentImageIndex >= updatedImages.length && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const filteredOffers = offers.filter(offer =>
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 bg-[#FBFBFB] min-h-screen p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. EXECUTIVE HEADER */}
      <div className="flex justify-between items-end border-b-2 border-[#1A1A1A] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">Marketing Intelligence</span>
          <h2 className="text-5xl font-serif text-[#1A1A1A] mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Promotional Offers
          </h2>
        </div>
        <button 
          onClick={() => {
            if (offers.length === 0) {
              alert('No offers available. Please create an offer first.');
              return;
            }
            openImageModal(offers[0]);
          }}
          className="px-8 py-4 bg-[#4A0404] text-white border border-[#C5A059] hover:bg-[#C5A059] transition-all duration-500 flex items-center space-x-3 group"
        >
          <Plus size={18} className="text-[#C5A059] group-hover:text-white" />
          <span className="uppercase text-xs font-bold tracking-[0.2em]">Manage Carousel</span>
        </button>
      </div>

      {/* 2. KITCHEN DISPLAY PREVIEW (THE TV FRAME) */}
      <div className="relative group">
        <div className="absolute -top-4 left-6 bg-[#C5A059] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest z-10">
          Live Digital Signage Preview
        </div>
        <div className="bg-[#1A1A1A] p-2 border-[12px] border-[#2A2A2A] shadow-2xl overflow-hidden">
          <div className="bg-black aspect-[21/9] flex items-center justify-center overflow-hidden">
            <PremiumAdPanel carouselImages={carouselImages} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-gray-400">
          <Monitor size={14} />
          <p className="text-[11px] italic">Display Resolution: 1920x1080 (Synchronized)</p>
        </div>
      </div>



      {/* 5. IMAGE MODAL (ARCHITECTURAL & DARK) */}
      {showImageModal && (
        <div className="fixed inset-0 bg-[#1A1A1A]/95 backdrop-blur-md flex items-center justify-center z-[100] p-10">
          <div className="bg-white w-full max-w-5xl flex flex-col border border-[#C5A059]">
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-[#FBFBFB]">
              <div>
                <h3 className="text-2xl font-serif text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Visual Asset Management
                </h3>
                <p className="text-[10px] uppercase font-bold text-[#C5A059] tracking-[0.3em]">Campaign: {selectedOffer?.title}</p>
              </div>
              <button onClick={() => setShowImageModal(false)} className="p-2 hover:bg-[#4A0404] hover:text-white transition-all">
                <X size={32} />
              </button>
            </div>

            <div className="grid grid-cols-12 h-[60vh]">
              {/* Asset Preview */}
              <div className="col-span-8 bg-black flex items-center justify-center relative group">
                {carouselImages.length > 0 ? (
                  <>
                    <img src={carouselImages[currentImageIndex]} className="w-full h-full object-contain" alt={`Carousel ${currentImageIndex + 1}`} />
                    
                    {/* Remove Button - Always Visible */}
                    <button 
                      onClick={() => removeCarouselImage(currentImageIndex)} 
                      className="absolute top-6 right-6 bg-red-600 text-white p-3 hover:bg-red-700 transition-all shadow-lg flex items-center gap-2"
                      title="Delete this image"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm font-bold">Remove</span>
                    </button>
                    
                    {/* Navigation Arrows */}
                    {carouselImages.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#C5A059] text-white p-3 hover:bg-[#4A0404] transition-all opacity-0 group-hover:opacity-100"
                          title="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#C5A059] text-white p-3 hover:bg-[#4A0404] transition-all opacity-0 group-hover:opacity-100"
                          title="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 rounded text-sm font-bold">
                      {currentImageIndex + 1} / {carouselImages.length}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-600 uppercase text-[10px] tracking-[0.5em] font-bold text-center">
                    <p>No Assets Uploaded</p>
                    <p className="mt-2 text-[9px]">Add images using the gallery on the right →</p>
                  </div>
                )}
              </div>

              {/* Thumbnails & Controls */}
              <div className="col-span-4 p-8 bg-[#F4F4F4] overflow-y-auto border-l border-gray-200 flex flex-col">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b border-gray-300 pb-2 text-[#4A0404]">Gallery Stream</h4>
                <div className="grid grid-cols-2 gap-4 mb-6 flex-1 overflow-y-auto">
                  {carouselImages.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-square border-2 transition-all p-1 relative group ${idx === currentImageIndex ? 'border-[#C5A059] shadow-lg' : 'border-gray-200 hover:border-[#1A1A1A]'}`}
                      title={`View image ${idx + 1}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                      {idx === currentImageIndex && (
                        <div className="absolute inset-0 bg-[#C5A059] opacity-30 pointer-events-none"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Add Asset Button */}
                <label className="aspect-video border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#C5A059] transition-all bg-gray-100">
                  <Plus size={32} className="text-gray-400 mb-2" />
                  <span className="text-[9px] font-bold text-gray-600 uppercase text-center px-2">Click to Add Images</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={uploadingImage}
                  />
                </label>
                
                {uploadingImage && (
                  <div className="mt-4 p-3 bg-[#C5A059] text-white rounded text-center text-xs font-bold">
                    Uploading...
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-[#1A1A1A] flex justify-end">
                <button onClick={() => setShowImageModal(false)} className="px-10 py-3 border border-[#C5A059] text-[#C5A059] uppercase text-[10px] font-bold tracking-widest hover:bg-[#C5A059] hover:text-white transition-all">
                  Finalize Assets
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// js/script.js

// DOM Elements
const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closeBtn');
const shopeeLink = document.getElementById('shopeeLink');
const linkCards = document.querySelectorAll('.link-card');
const socialBtns = document.querySelectorAll('.social-btn');

// Track if popup is open
let isPopupOpen = false;

// Initialize the popup
function initPopup() {
  // Show popup with animation after slight delay
  setTimeout(() => {
    popupOverlay.classList.add('show');
    isPopupOpen = true;
    disableBodyScroll();
    addEventListeners();
  }, 100);
}

// Add all event listeners
function addEventListeners() {
  // Close popup when clicking outside content
  popupOverlay.addEventListener('click', handleOutsideClick, { passive: true });
  
  // Close button functionality
  closeBtn.addEventListener('click', closePopup, { passive: true });
  
  // Add ripple effect to all links
  linkCards.forEach(link => {
    link.addEventListener('click', createRippleEffect, { passive: false });
  });
  
  // Add hover effect to social buttons
  socialBtns.forEach(btn => {
    btn.addEventListener('mouseenter', addHoverEffect, { passive: true });
    btn.addEventListener('mouseleave', removeHoverEffect, { passive: true });
  });
  
  // Track affiliate clicks if link exists
  if (shopeeLink) {
    shopeeLink.addEventListener('click', trackAffiliateClick, { passive: false });
  }
  
  // Handle escape key press
  document.addEventListener('keydown', handleKeyDown, { passive: true });
}

// Remove all event listeners when popup closes
function removeEventListeners() {
  popupOverlay.removeEventListener('click', handleOutsideClick);
  closeBtn.removeEventListener('click', closePopup);
  
  linkCards.forEach(link => {
    link.removeEventListener('click', createRippleEffect);
  });
  
  socialBtns.forEach(btn => {
    btn.removeEventListener('mouseenter', addHoverEffect);
    btn.removeEventListener('mouseleave', removeHoverEffect);
  });
  
  if (shopeeLink) {
    shopeeLink.removeEventListener('click', trackAffiliateClick);
  }
  
  document.removeEventListener('keydown', handleKeyDown);
}

// Handle clicks outside popup content
function handleOutsideClick(e) {
  if (e.target === popupOverlay) {
    closePopup();
  }
}

// Close popup function
function closePopup() {
  if (!isPopupOpen) return;
  
  popupOverlay.style.opacity = '0';
  popupOverlay.querySelector('.popup-content').style.transform = 'translateY(20px)';
  isPopupOpen = false;
  enableBodyScroll();
  removeEventListeners();
  
  setTimeout(() => {
    if (isStandalone()) {
      window.history.back();
    } else {
      window.location.href = 'https://instagram.com/yourprofile';
    }
  }, 300);
}

// Create ripple effect on click
function createRippleEffect(e) {
  // For Shopee link, let trackAffiliateClick handle it
  if (this === shopeeLink) return;
  
  e.preventDefault();
  const link = this;
  const href = link.getAttribute('href');
  
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  // Position ripple
  const rect = link.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  // Add to DOM
  link.appendChild(ripple);
  
  // Remove after animation
  setTimeout(() => {
    ripple.remove();
    window.open(href, '_blank');
  }, 600);
}

// Track affiliate clicks
function trackAffiliateClick(e) {
  e.preventDefault();
  const url = this.getAttribute('href');
  
  // Track click
  const shopeeClicks = localStorage.getItem('shopeeClicks') || 0;
  localStorage.setItem('shopeeClicks', parseInt(shopeeClicks) + 1);
  
  // Create ripple effect
  createRippleEffect.call(this, e);
  
  // Open in new tab after slight delay
  setTimeout(() => {
    window.open(url, '_blank');
  }, 400);
}

// Social button hover effects
function addHoverEffect() {
  this.style.transform = 'scale(1.1) translateY(-3px)';
}

function removeHoverEffect() {
  this.style.transform = '';
}

// Handle keyboard events
function handleKeyDown(e) {
  if (e.key === 'Escape' && isPopupOpen) {
    closePopup();
  }
}

// Check if PWA/standalone mode
function isStandalone() {
  return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
}

// Disable body scroll when popup is open
function disableBodyScroll() {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

// Enable body scroll when popup closes
function enableBodyScroll() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}
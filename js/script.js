// DOM Elements
const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closeBtn');
const shopeeLink = document.querySelector('.link-card.shopee');
const linkCards = document.querySelectorAll('.link-card');
const socialBtns = document.querySelectorAll('.social-btn');

// Track if popup is open
let isPopupOpen = false;

// Initialize the popup
function initPopup() {
  setTimeout(() => {
    popupOverlay.classList.add('show');
    isPopupOpen = true;
    disableBodyScroll();
    addEventListeners();
  }, 100);
}

// Add all event listeners
function addEventListeners() {
  popupOverlay.addEventListener('click', handleOutsideClick);
  closeBtn.addEventListener('click', closePopup);
  
  linkCards.forEach(link => {
    link.addEventListener('click', createRippleEffect);
  });
  
  socialBtns.forEach(btn => {
    btn.addEventListener('mouseenter', addHoverEffect);
    btn.addEventListener('mouseleave', removeHoverEffect);
  });
  
  if (shopeeLink) {
    shopeeLink.addEventListener('click', trackAffiliateClick);
  }
  
  document.addEventListener('keydown', handleKeyDown);
}

// Remove all event listeners
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
  if (this === shopeeLink) return;
  
  e.preventDefault();
  const link = this;
  const href = link.getAttribute('href');
  
  if (!href || href === "#") {
    console.error("Invalid link:", href);
    return;
  }

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  const rect = link.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  link.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
    try {
      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    } catch (error) {
      console.error("Failed to open link:", error);
      if (isStandalone()) {
        window.open(href, '_blank');
      }
    }
  }, 600);
}

// Track affiliate clicks
function trackAffiliateClick(e) {
  e.preventDefault();
  const url = this.getAttribute('href');
  
  const shopeeClicks = localStorage.getItem('shopeeClicks') || 0;
  localStorage.setItem('shopeeClicks', parseInt(shopeeClicks) + 1);
  
  createRippleEffect.call(this, e);
  
  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
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

// Disable body scroll
function disableBodyScroll() {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

// Enable body scroll
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

window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  const popupOverlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('closeBtn');

  if (!popupOverlay || !closeBtn) return;

  // Rest of your popup initialization code...
  function initPopup() {
      // Your existing popup code
  }
  
  initPopup();
});

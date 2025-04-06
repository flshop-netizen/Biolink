// Strict mode for better error handling
'use strict';

// DOM Elements with null checks
const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closeBtn');

// Validate essential elements exist
if (!popupOverlay || !closeBtn) {
  console.error('Essential elements not found in DOM');
  document.body.classList.add('loaded'); // Ensure content is visible
  // Removed the top-level return statement that was causing the error
  // All code that was after this point should be inside functions
}


// Constants
const SHOPEE_CLICKS_KEY = 'shopeeClicks';
const DEFAULT_REDIRECT_URL = 'https://instagram.com/fl.shop_id';
const SECURITY_DELAY = 100; // ms delay for security actions

// Track if popup is open
let isPopupOpen = false;

// Sanitize URL function to prevent XSS
function sanitizeUrl(url) {
    if (!url) return '';
    
    try {
        const parsed = new URL(url);
        const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'sms:'];
        
        if (!allowedProtocols.includes(parsed.protocol)) {
            return '';
        }
        
        return parsed.toString();
    } catch (e) {
        console.error('Invalid URL:', url);
        return '';
    }
}

// Initialize the popup with security delay
function initPopup() {
    setTimeout(() => {
        if (isPopupOpen) return;
        
        popupOverlay.classList.add('show');
        isPopupOpen = true;
        disableBodyScroll();
        addEventListeners();
    }, SECURITY_DELAY);
}

// Secure event listener adder
function addEventListeners() {
    try {
        popupOverlay.addEventListener('click', handleOutsideClick);
        closeBtn.addEventListener('click', closePopup);
        
        document.querySelectorAll('.link-card').forEach(link => {
            link.addEventListener('click', createRippleEffect);
        });
        
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('mouseenter', addHoverEffect);
            btn.addEventListener('mouseleave', removeHoverEffect);
        });
        
        const shopeeLink = document.querySelector('.link-card.shopee');
        if (shopeeLink) {
            shopeeLink.addEventListener('click', trackAffiliateClick);
        }
        
        document.addEventListener('keydown', handleKeyDown);
    } catch (e) {
        console.error('Error adding event listeners:', e);
    }
}

// Remove event listeners safely
function removeEventListeners() {
    try {
        popupOverlay.removeEventListener('click', handleOutsideClick);
        closeBtn.removeEventListener('click', closePopup);
        
        document.querySelectorAll('.link-card').forEach(link => {
            link.removeEventListener('click', createRippleEffect);
        });
        
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.removeEventListener('mouseenter', addHoverEffect);
            btn.removeEventListener('mouseleave', removeHoverEffect);
        });
        
        const shopeeLink = document.querySelector('.link-card.shopee');
        if (shopeeLink) {
            shopeeLink.removeEventListener('click', trackAffiliateClick);
        }
        
        document.removeEventListener('keydown', handleKeyDown);
    } catch (e) {
        console.error('Error removing event listeners:', e);
    }
}

// Handle outside clicks securely
function handleOutsideClick(e) {
    if (e.target === popupOverlay) {
        closePopup();
    }
}

// Close popup with security checks
function closePopup() {
    if (!isPopupOpen) return;
    
    try {
        popupOverlay.style.opacity = '0';
        const popupContent = popupOverlay.querySelector('.popup-content');
        if (popupContent) {
            popupContent.style.transform = 'translateY(20px)';
        }
        
        isPopupOpen = false;
        enableBodyScroll();
        removeEventListeners();
        
        setTimeout(() => {
            const redirectUrl = isStandalone() ? DEFAULT_REDIRECT_URL : sanitizeUrl(DEFAULT_REDIRECT_URL);
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 300);
    } catch (e) {
        console.error('Error closing popup:', e);
    }
}

// Secure ripple effect creator
function createRippleEffect(e) {
    if (!e || !this) return;
    
    e.preventDefault();
    const link = this;
    const href = sanitizeUrl(link.getAttribute('href'));
    
    if (!href || href === "#") {
        console.error("Invalid link:", href);
        return;
    }

    try {
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
    } catch (e) {
        console.error('Error creating ripple effect:', e);
    }
}

// Secure affiliate click tracker
function trackAffiliateClick(e) {
    if (!e || !this) return;
    
    e.preventDefault();
    const url = sanitizeUrl(this.getAttribute('href'));
    
    if (!url) return;
    
    try {
        // Secure localStorage access
        let shopeeClicks = 0;
        try {
            const storedClicks = localStorage.getItem(SHOPEE_CLICKS_KEY);
            shopeeClicks = storedClicks ? parseInt(storedClicks) : 0;
        } catch (storageError) {
            console.error('Error accessing localStorage:', storageError);
        }
        
        try {
            localStorage.setItem(SHOPEE_CLICKS_KEY, shopeeClicks + 1);
        } catch (storageError) {
            console.error('Error storing to localStorage:', storageError);
        }
        
        createRippleEffect.call(this, e);
        
        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 400);
    } catch (e) {
        console.error('Error tracking affiliate click:', e);
    }
}

// Social button effects (unchanged but with try-catch)
function addHoverEffect() {
    try {
        this.style.transform = 'scale(1.1) translateY(-3px)';
    } catch (e) {
        console.error('Error adding hover effect:', e);
    }
}

function removeHoverEffect() {
    try {
        this.style.transform = '';
    } catch (e) {
        console.error('Error removing hover effect:', e);
    }
}

// Secure keydown handler
function handleKeyDown(e) {
    try {
        if (e.key === 'Escape' && isPopupOpen) {
            closePopup();
        }
    } catch (e) {
        console.error('Error handling keydown:', e);
    }
}

// Secure standalone check
function isStandalone() {
    try {
        return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    } catch (e) {
        console.error('Error checking standalone mode:', e);
        return false;
    }
}

// Scroll control functions with error handling
function disableBodyScroll() {
    try {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } catch (e) {
        console.error('Error disabling body scroll:', e);
    }
}

function enableBodyScroll() {
    try {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    } catch (e) {
        console.error('Error enabling body scroll:', e);
    }
}

// Initialize when DOM is loaded with error handling
function safeInit() {
  try {
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initPopup);
      } else {
          initPopup();
      }
  } catch (e) {
      console.error('Initialization error:', e);
      document.body.classList.add('loaded');
  }
}

// Load event with error handling
window.addEventListener('load', function() {
  try {
      document.body.classList.add('loaded');
      safeInit();
  } catch (e) {
      console.error('Load event error:', e);
      document.body.classList.add('loaded');
  }
});

// Fallback in case load event doesn't fire
setTimeout(() => {
  document.body.classList.add('loaded');
}, 1000);

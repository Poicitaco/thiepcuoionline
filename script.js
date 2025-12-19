// ============================================
// PERSONALIZED GREETING FROM URL PARAMETERS
// ============================================
function initPersonalizedGreeting() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('name');
    const guestTitle = urlParams.get('title');
    
    const greetingDiv = document.getElementById('personalized-greeting');
    const guestNameSpan = document.getElementById('guest-name');
    const guestTitleSpan = document.getElementById('guest-title');
    
    if (guestName && guestTitle && greetingDiv && guestNameSpan && guestTitleSpan) {
        guestNameSpan.textContent = guestName;
        guestTitleSpan.textContent = guestTitle;
        greetingDiv.classList.remove('hidden');
    }
}

// ============================================
// LOAD CUSTOMIZED CONTENT FROM LOCALSTORAGE
// ============================================
function loadCustomizedContent() {
    const customData = JSON.parse(localStorage.getItem('wedding_custom_data') || '{}');
    
    // Load couple names
    if (customData.groomName) {
        const groomNameElements = document.querySelectorAll('#groom-name');
        groomNameElements.forEach(el => el.textContent = customData.groomName);
    }
    if (customData.brideName) {
        const brideNameElements = document.querySelectorAll('#bride-name');
        brideNameElements.forEach(el => el.textContent = customData.brideName);
    }
    
    // Load hero background image
    if (customData.heroBgImage) {
        const heroSection = document.querySelector('.hero-section .absolute.inset-0');
        if (heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${customData.heroBgImage}')`;
        }
    }
    
    // Load gallery images
    if (customData.galleryImages) {
        customData.galleryImages.forEach((imgUrl, index) => {
            if (imgUrl) {
                const galleryLinks = document.querySelectorAll('.glightbox');
                if (galleryLinks[index]) {
                    galleryLinks[index].href = imgUrl;
                    const img = galleryLinks[index].querySelector('img');
                    if (img) img.src = imgUrl;
                }
            }
        });
    }
}

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500); // Show loading for 1.5 seconds
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
}

// ============================================
// DARK MODE TOGGLE
// ============================================
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
            
            // Confetti effect on theme change
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { x: 0.95, y: 0.1 }
                });
            }
        });
    }
}

function updateThemeIcon(isDark) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }
}

// ============================================
// FALLING PETALS EFFECT
// ============================================
function initFallingPetals() {
    const petalsContainer = document.getElementById('petals-container');
    if (!petalsContainer) return;
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 3) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        petal.style.opacity = Math.random() * 0.5 + 0.3;
        
        petalsContainer.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, 8000);
    }
    
    // Create petals periodically
    setInterval(createPetal, 500);
}

// ============================================
// CURSOR TRAIL EFFECT (Hearts)
// ============================================
function initCursorTrail() {
    const cursorTrail = document.getElementById('cursor-trail');
    if (!cursorTrail) return;
    
    let lastTime = 0;
    const throttleDelay = 100; // Create heart every 100ms
    
    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastTime < throttleDelay) return;
        lastTime = currentTime;
        
        const heart = document.createElement('div');
        heart.className = 'heart-trail';
        heart.textContent = '❤️';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        
        cursorTrail.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    });
}

// ============================================
// SHARE MODAL & QR CODE
// ============================================
function initShareModal() {
    const shareToggle = document.getElementById('share-toggle');
    const shareModal = document.getElementById('share-modal');
    const closeShare = document.getElementById('close-share');
    const qrcodeDiv = document.getElementById('qrcode');
    
    if (shareToggle && shareModal) {
        shareToggle.addEventListener('click', () => {
            shareModal.classList.remove('hidden');
            
            // Generate QR code if not already generated
            if (qrcodeDiv && qrcodeDiv.children.length === 0 && typeof QRCode !== 'undefined') {
                new QRCode(qrcodeDiv, {
                    text: window.location.href,
                    width: 200,
                    height: 200,
                    colorDark: '#137fec',
                    colorLight: '#ffffff',
                });
            }
        });
    }
    
    if (closeShare && shareModal) {
        closeShare.addEventListener('click', () => {
            shareModal.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.add('hidden');
            }
        });
    }
}

// Share to Facebook
window.shareToFacebook = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
};

// Copy Link
window.copyLink = function() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Đã sao chép link! 🎉');
        
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    });
};

// ============================================
// ADD TO CALENDAR
// ============================================
window.addToCalendar = function() {
    const event = {
        title: 'Lễ Thành Hôn - Đình Thi & Thanh Thảo',
        description: 'Trân trọng kính mời quý khách đến dự tiệc cưới của chúng tôi',
        location: 'Trung tâm hội nghị tiệc cưới Luxury Palace, TP. Hồ Chí Minh',
        start: '2025-12-21T11:00:00',
        end: '2025-12-21T14:00:00'
    };
    
    // Create Google Calendar link
    const startDate = event.start.replace(/[-:]/g, '').replace('.000', '');
    const endDate = event.end.replace(/[-:]/g, '').replace('.000', '');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
};

// ============================================
// LIGHTBOX GALLERY
// ============================================
function initLightbox() {
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: true,
            closeButton: true,
            zoomable: true,
            draggable: true,
        });
    }
}

// ============================================
// MUSIC PLAYER (Enhanced)
// ============================================
function initMusicPlayer() {
    const musicButton = document.querySelector('.music-toggle');
    const audio = document.getElementById('background-music');
    let isPlaying = false;
    
    if (musicButton && audio) {
        musicButton.addEventListener('click', () => {
            isPlaying = !isPlaying;
            const icon = musicButton.querySelector('.material-symbols-outlined');
            
            if (isPlaying) {
                audio.play().catch(err => console.log('Audio play failed:', err));
                icon.textContent = 'pause';
                icon.classList.remove('animate-pulse');
                
                // Confetti effect
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { x: 0.95, y: 0.15 }
                    });
                }
            } else {
                audio.pause();
                icon.textContent = 'music_note';
                icon.classList.add('animate-pulse');
            }
        });
    }
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
    const weddingDate = new Date('2025-12-21T11:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Wedding day has passed - show confetti!
            document.querySelectorAll('.countdown-value').forEach(el => {
                el.textContent = '00';
            });
            
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const countdownValues = document.querySelectorAll('.countdown-value');
        if (countdownValues.length >= 4) {
            countdownValues[0].textContent = String(days).padStart(2, '0');
            countdownValues[1].textContent = String(hours).padStart(2, '0');
            countdownValues[2].textContent = String(minutes).padStart(2, '0');
            countdownValues[3].textContent = String(seconds).padStart(2, '0');
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// RSVP FORM HANDLER (Enhanced with Confetti)
// ============================================
function initRSVPForm() {
    const form = document.querySelector('.rsvp-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const attending = document.querySelector('input[name="attending"]:checked');
            const guests = document.getElementById('guests').value;
            
            if (!name || !attending) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            // Confetti effect on success
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
                
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 }
                    });
                }, 250);
                
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 }
                    });
                }, 400);
            }
            
            alert('Cảm ơn bạn đã xác nhận! Chúng tôi sẽ sớm liên hệ lại. 💖');
            form.reset();
        });
    }
}

// ============================================
// MESSAGE/WISHES HANDLER (Enhanced)
// ============================================
function initMessageHandler() {
    const sendBtn = document.getElementById('send-wish-btn');
    const nameInput = document.getElementById('wish-name');
    const messageInput = document.getElementById('wish-message');
    
    if (sendBtn && nameInput && messageInput) {
        // Load existing wishes on page load
        loadWishes();
        
        sendBtn.addEventListener('click', function() {
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            
            if (!name) {
                alert('Vui lòng nhập tên của bạn!');
                return;
            }
            
            if (!message) {
                alert('Vui lòng nhập lời chúc của bạn!');
                return;
            }
            
            // Create wish object
            const wish = {
                id: Date.now(),
                name: name,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Get existing wishes from localStorage
            const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
            wishes.unshift(wish); // Add new wish at the beginning
            
            // Save to localStorage
            localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
            
            // Clear inputs
            nameInput.value = '';
            messageInput.value = '';
            
            // Reload wishes display
            loadWishes();
            
            // Confetti effect
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
            
            alert('Cảm ơn lời chúc của bạn! 💕');
        });
    }
}

// Load and display wishes from localStorage
function loadWishes() {
    const wishesDisplay = document.getElementById('wishes-display');
    if (!wishesDisplay) return;
    
    const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    
    if (wishes.length === 0) {
        wishesDisplay.innerHTML = `
            <div class="text-gray-400 dark:text-gray-500 py-8">
                <span class="material-symbols-outlined text-4xl mb-2">mail</span>
                <p class="text-sm">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
            </div>
        `;
        return;
    }
    
    wishesDisplay.innerHTML = wishes.map(wish => {
        const date = new Date(wish.timestamp);
        const dateStr = date.toLocaleDateString('vi-VN');
        const initial = wish.name.charAt(0).toUpperCase();
        
        return `
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        ${initial}
                    </div>
                    <div class="flex-1">
                        <span class="font-bold text-sm text-gray-800 dark:text-white">${escapeHtml(wish.name)}</span>
                        <p class="text-xs text-gray-400">${dateStr}</p>
                    </div>
                </div>
                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"${escapeHtml(wish.message)}"</p>
            </div>
        `;
    }).join('');
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// HEART BUTTON HANDLER (Enhanced with Animation)
// ============================================
function initHeartButton() {
    const heartBtn = document.querySelector('.heart-btn');
    const heartCount = heartBtn?.querySelector('.heart-count');
    let count = parseInt(localStorage.getItem('heartCount') || '0');
    
    if (heartCount) {
        heartCount.textContent = count;
    }
    
    if (heartBtn) {
        heartBtn.addEventListener('click', () => {
            count++;
            if (heartCount) {
                heartCount.textContent = count;
            }
            localStorage.setItem('heartCount', count);
            
            // Animation effect
            heartBtn.classList.add('scale-110');
            setTimeout(() => {
                heartBtn.classList.remove('scale-110');
            }, 200);
            
            // Mini confetti effect
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { 
                        x: heartBtn.getBoundingClientRect().left / window.innerWidth,
                        y: heartBtn.getBoundingClientRect().top / window.innerHeight
                    }
                });
            }
        });
    }
}

// ============================================
// MAP BUTTON HANDLERS
// ============================================
function initMapButtons() {
    const mapButtons = document.querySelectorAll('button[class*="map"]');
    
    mapButtons.forEach(button => {
        // Skip if button is calendar button
        if (button.textContent.includes('Lưu lịch') || button.onclick) return;
        
        button.addEventListener('click', () => {
            // Replace with actual Google Maps link
            const mapUrl = 'https://maps.google.com/?q=Luxury+Palace+Ho+Chi+Minh';
            window.open(mapUrl, '_blank');
        });
    });
}

// ============================================
// COPY TO CLIPBOARD FOR BANK ACCOUNTS
// ============================================
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Đã sao chép số tài khoản! 📋');
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 }
                });
            }
        }).catch(() => {
            alert('Không thể sao chép. Vui lòng sao chép thủ công.');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Đã sao chép số tài khoản! 📋');
        } catch (err) {
            alert('Không thể sao chép. Vui lòng sao chép thủ công.');
        }
        document.body.removeChild(textArea);
    }
}

// ============================================
// BANK QR CODE GENERATION (Optional)
// ============================================
function initBankQR() {
    // Generate QR codes for bank accounts
    // Note: Replace with actual bank QR images or use QRCode library
    const groomQR = document.getElementById('qr-groom');
    const brideQR = document.getElementById('qr-bride');
    
    if (groomQR && typeof QRCode !== 'undefined') {
        groomQR.innerHTML = '';
        new QRCode(groomQR, {
            text: 'Chuyển khoản đến: NGUYEN DINH THI - STK: 1234567890 - Vietcombank',
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
        });
    }
    
    if (brideQR && typeof QRCode !== 'undefined') {
        brideQR.innerHTML = '';
        new QRCode(brideQR, {
            text: 'Chuyển khoản đến: NGUYEN THANH THAO - STK: 0987654321 - MBBank',
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
        });
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-alt]');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initPersonalizedGreeting();
    loadCustomizedContent();
    initLoadingScreen();
    initScrollProgress();
    initDarkMode();
    initFallingPetals();
    initCursorTrail();
    initShareModal();
    initLightbox();
    initMusicPlayer();
    initCountdown();
    initRSVPForm();
    initMessageHandler();
    initHeartButton();
    initMapButtons();
    initBankQR();
    initParallax();
    initSmoothScroll();
    initIntersectionObserver();
    
    console.log('🎉 Wedding website fully loaded!');
    console.log('💖 All features initialized successfully!');
});

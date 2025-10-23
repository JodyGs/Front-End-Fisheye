class Lightbox {
    constructor() {
        this.currentIndex = 0;
        this.media = [];
        this.isOpen = false;
        this.previousFocusedElement = null;
        this.lightboxElement = null;
        
        this.init();
    }

    init() {
        this.createLightboxHTML();
        this.bindEvents();
        this.setupTriggers();
    }

    createLightboxHTML() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox" aria-hidden="true" role="dialog" aria-labelledby="lightbox-title">
                <div class="lightbox-overlay" aria-label="Fermer la lightbox"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Fermer la lightbox" type="button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <button class="lightbox-prev" aria-label="M\u00e9dia pr\u00e9c\u00e9dent" type="button">
                        <span aria-hidden="true">&#8249;</span>
                    </button>
                    <button class="lightbox-next" aria-label="M\u00e9dia suivant" type="button">
                        <span aria-hidden="true">&#8250;</span>
                    </button>
                    <div class="lightbox-media-container">
                        <img class="lightbox-image" alt="" />
                        <video class="lightbox-video" controls>
                            <source type="video/mp4">
                            Votre navigateur ne supporte pas la lecture vid\u00e9o.
                        </video>
                    </div>
                    <div class="lightbox-info">
                        <h2 id="lightbox-title" class="lightbox-title"></h2>
                        <div class="lightbox-counter" aria-live="polite"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightboxElement = document.getElementById('lightbox');
    }

    setupTriggers() {
        document.addEventListener('click', (e) => {
            const mediaLink = e.target.closest('.media-link');
            if (mediaLink) {
                e.preventDefault();
                this.collectAllMedia();
                const clickedMedia = this.getMediaFromElement(e.target);
                const index = this.media.findIndex(item => item.src === clickedMedia.src);
                this.open(index >= 0 ? index : 0);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const mediaElement = e.target;
                if (mediaElement.classList.contains('media-image') || 
                    mediaElement.classList.contains('media-video')) {
                    e.preventDefault();
                    this.collectAllMedia();
                    const clickedMedia = this.getMediaFromElement(mediaElement);
                    const index = this.media.findIndex(item => item.src === clickedMedia.src);
                    this.open(index >= 0 ? index : 0);
                }
            }
        });
    }

    getMediaFromElement(element) {
        const mediaElement = element.classList.contains('media-image') || 
                            element.classList.contains('media-video') ? 
                            element : element.querySelector('.media-image, .media-video');
        
        if (!mediaElement) return null;

        const isVideo = mediaElement.classList.contains('media-video');
        const article = mediaElement.closest('article');
        const title = article?.querySelector('.media-title')?.textContent || '';

        return {
            src: mediaElement.src,
            title: title,
            type: isVideo ? 'video' : 'image'
        };
    }

    collectAllMedia() {
        this.media = [];
        const mediaElements = document.querySelectorAll('.media-image, .media-video');
        
        mediaElements.forEach(mediaElement => {
            const mediaData = this.getMediaFromElement(mediaElement);
            if (mediaData) {
                this.media.push(mediaData);
            }
        });
    }

    open(index = 0) {
        if (this.media.length === 0) return;
        
        this.currentIndex = index;
        this.isOpen = true;
        this.previousFocusedElement = document.activeElement;
        
        this.lightboxElement.style.display = 'flex';
        this.lightboxElement.setAttribute('aria-hidden', 'false');
        
        this.showMedia();
        this.updateNavigation();
        this.trapFocus();
        
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.lightboxElement.querySelector('.lightbox-close').focus();
        }, 100);
    }

    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.lightboxElement.style.display = 'none';
        this.lightboxElement.setAttribute('aria-hidden', 'true');
        
        document.body.style.overflow = '';
        
        if (this.previousFocusedElement) {
            this.previousFocusedElement.focus();
        }
    }

    showMedia() {
        const currentMedia = this.media[this.currentIndex];
        if (!currentMedia) return;

        const imageEl = this.lightboxElement.querySelector('.lightbox-image');
        const videoEl = this.lightboxElement.querySelector('.lightbox-video');
        const titleEl = this.lightboxElement.querySelector('.lightbox-title');
        const counterEl = this.lightboxElement.querySelector('.lightbox-counter');

        titleEl.textContent = currentMedia.title;
        counterEl.textContent = `${this.currentIndex + 1} / ${this.media.length}`;

        if (currentMedia.type === 'video') {
            imageEl.style.display = 'none';
            videoEl.style.display = 'block';
            videoEl.src = currentMedia.src;
            videoEl.setAttribute('aria-label', currentMedia.title || 'Vid\u00e9o');
        } else {
            videoEl.style.display = 'none';
            imageEl.style.display = 'block';
            imageEl.src = currentMedia.src;
            imageEl.alt = currentMedia.title || 'Image';
        }
        
        // Align title with media after a short delay to ensure media is loaded
        setTimeout(() => this.alignTitleWithMedia(), 100);
    }

    prev() {
        if (this.media.length <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.media.length) % this.media.length;
        this.showMedia();
        this.updateNavigation();
    }

    next() {
        if (this.media.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.media.length;
        this.showMedia();
        this.updateNavigation();
    }

    updateNavigation() {
        const prevBtn = this.lightboxElement.querySelector('.lightbox-prev');
        const nextBtn = this.lightboxElement.querySelector('.lightbox-next');
        
        if (this.media.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case 'Tab':
                    this.handleTabKey(e);
                    break;
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.isOpen) return;
            
            if (e.target.classList.contains('lightbox-overlay')) {
                this.close();
            } else if (e.target.classList.contains('lightbox-close') || 
                       e.target.closest('.lightbox-close')) {
                this.close();
            } else if (e.target.classList.contains('lightbox-prev') || 
                       e.target.closest('.lightbox-prev')) {
                this.prev();
            } else if (e.target.classList.contains('lightbox-next') || 
                       e.target.closest('.lightbox-next')) {
                this.next();
            }
        });
    }

    trapFocus() {
        const focusableElements = this.lightboxElement.querySelectorAll(
            'button, video, [tabindex]:not([tabindex="-1"])'
        );
        this.focusableElements = Array.from(focusableElements);
    }

    handleTabKey(e) {
        if (this.focusableElements.length === 0) return;

        const currentFocusIndex = this.focusableElements.indexOf(document.activeElement);
        
        if (e.shiftKey) {
            if (currentFocusIndex === 0) {
                e.preventDefault();
                this.focusableElements[this.focusableElements.length - 1].focus();
            }
        } else {
            if (currentFocusIndex === this.focusableElements.length - 1) {
                e.preventDefault();
                this.focusableElements[0].focus();
            }
        }
    }

    alignTitleWithMedia() {
        const infoEl = this.lightboxElement.querySelector('.lightbox-info');
        const mediaContainer = this.lightboxElement.querySelector('.lightbox-media-container');
        const activeMedia = this.lightboxElement.querySelector('.lightbox-image[style*="block"], .lightbox-video[style*="block"]');
        
        if (!activeMedia || !infoEl) return;
        
        const containerRect = mediaContainer.getBoundingClientRect();
        const mediaRect = activeMedia.getBoundingClientRect();
        const leftOffset = mediaRect.left - containerRect.left;
        
        infoEl.style.left = `${leftOffset}px`;
    }
}

const lightboxCSS = `
.lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 10000;
}

.lightbox-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.lightbox-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-close {
    position: absolute;
    top: 30px;
    right: 30px;
    background: none;
    border: none;
    color: #901C1C;
    font-size: 42px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10001;
    line-height: 1;
}

.lightbox-close:hover,
.lightbox-close:focus {
    color: #ff4444;
    outline: none;
}

.lightbox-prev,
.lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    color: #901C1C;
    border: none;
    font-size: 30px;
    cursor: pointer;
    z-index: 10001;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-prev {
    left: 30px;
}

.lightbox-next {
    right: 30px;
}

.lightbox-prev:hover,
.lightbox-prev:focus,
.lightbox-next:hover,
.lightbox-next:focus {
    color: #ff4444;
    outline: none;
}

.lightbox-media-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 100px;
    box-sizing: border-box;
    position: relative;
}

.lightbox-image,
.lightbox-video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.lightbox-video {
    display: none;
}

.lightbox-info {
    position: absolute;
    bottom: 30px;
    left: 100px;
}

.lightbox-title {
    margin: 0;
    font-size: 24px;
    color: #901C1C;
    font-weight: normal;
}

.lightbox-counter {
    display: none;
}

@media (max-width: 768px) {
    .lightbox-close {
        top: 20px;
        right: 20px;
        font-size: 32px;
    }
    
    .lightbox-prev,
    .lightbox-next {
        font-size: 24px;
        width: 40px;
        height: 40px;
    }
    
    .lightbox-prev {
        left: 20px;
    }
    
    .lightbox-next {
        right: 20px;
    }
    
    .lightbox-info {
        bottom: 20px;
        left: 60px;
    }
    
    .lightbox-title {
        font-size: 18px;
    }
    
    .lightbox-media-container {
        padding: 60px 20px;
    }
}

.lightbox[aria-hidden="true"] {
    display: none !important;
}
`;

function initLightbox() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = lightboxCSS;
    document.head.appendChild(styleSheet);
    
    return new Lightbox();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
} else {
    initLightbox();
}
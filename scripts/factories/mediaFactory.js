function mediaTemplate(data, photographerId) {
    const { id, title, likes, date, price, image, video } = data;

    function createMediaElement() {
        if (image) {
            const img = document.createElement('img');
            img.src = `assets/images/${photographerId}/${image}`;
            img.alt = title;
            img.className = 'media-image';
            img.setAttribute('tabindex', '0');
            return img;
        } else if (video) {
            const videoElement = document.createElement('video');
            videoElement.src = `assets/images/${photographerId}/${video}`;
            videoElement.className = 'media-video';
            videoElement.setAttribute('tabindex', '0');
            videoElement.setAttribute('aria-label', `Vidéo: ${title}`);
            videoElement.controls = false;
            return videoElement;
        } else {
            throw new Error("Type de média non reconnu");
        }
    }

    function getMediaCardDOM() {
        const article = document.createElement('article');
        article.className = 'media-card';
        
        const mediaLink = document.createElement('a');
        mediaLink.setAttribute('href', '#');
        mediaLink.setAttribute('aria-label', `${title}, closeup view`);
        mediaLink.className = 'media-link';
        
        const mediaElement = createMediaElement();
        
        const mediaInfo = document.createElement('div');
        mediaInfo.className = 'media-info';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.className = 'media-title';
        
        const likesContainer = document.createElement('div');
        likesContainer.className = 'media-likes';
        
        const likesCount = document.createElement('span');
        likesCount.textContent = likes;
        likesCount.setAttribute('aria-label', `${likes} likes`);
        
        const heartIcon = document.createElement('button');
        heartIcon.innerHTML = '♥';
        heartIcon.className = 'heart-icon';
        heartIcon.setAttribute('aria-label', `Aimer ${title}`);
        heartIcon.setAttribute('tabindex', '0');
        
        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);
        
        mediaInfo.appendChild(titleElement);
        mediaInfo.appendChild(likesContainer);
        
        mediaLink.appendChild(mediaElement);
        article.appendChild(mediaLink);
        article.appendChild(mediaInfo);
        
        return article;
    }

    return { id, title, likes, date, price, image, video, getMediaCardDOM };
}

class MediaFactory {
    static createMedia(data, photographerId) {
        return mediaTemplate(data, photographerId);
    }
}
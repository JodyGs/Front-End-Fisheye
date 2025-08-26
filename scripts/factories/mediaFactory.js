class Media {
    constructor(data, photographerId) {
        this.id = data.id;
        this.photographerId = photographerId;
        this.title = data.title;
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
    }

    createMediaElement() {
        throw new Error("createMediaElement must be implemented by subclass");
    }

    createMediaDOM() {
        const article = document.createElement('article');
        article.className = 'media-card';
        
        const mediaLink = document.createElement('a');
        mediaLink.setAttribute('href', '#');
        mediaLink.setAttribute('aria-label', `${this.title}, closeup view`);
        mediaLink.className = 'media-link';
        
        const mediaElement = this.createMediaElement();
        
        const mediaInfo = document.createElement('div');
        mediaInfo.className = 'media-info';
        
        const title = document.createElement('h3');
        title.textContent = this.title;
        title.className = 'media-title';
        
        const likesContainer = document.createElement('div');
        likesContainer.className = 'media-likes';
        
        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.setAttribute('aria-label', `${this.likes} likes`);
        
        const heartIcon = document.createElement('button');
        heartIcon.innerHTML = '♥';
        heartIcon.className = 'heart-icon';
        heartIcon.setAttribute('aria-label', `Aimer ${this.title}`);
        heartIcon.setAttribute('tabindex', '0');
        
        likesContainer.appendChild(likesCount);
        likesContainer.appendChild(heartIcon);
        
        mediaInfo.appendChild(title);
        mediaInfo.appendChild(likesContainer);
        
        mediaLink.appendChild(mediaElement);
        article.appendChild(mediaLink);
        article.appendChild(mediaInfo);
        
        return article;
    }
}

class ImageMedia extends Media {
    constructor(data, photographerId) {
        super(data, photographerId);
        this.image = data.image;
    }

    createMediaElement() {
        const img = document.createElement('img');
        img.src = `assets/images/${this.photographerId}/${this.image}`;
        img.alt = this.title;
        img.className = 'media-image';
        img.setAttribute('tabindex', '0');
        return img;
    }
}

class VideoMedia extends Media {
    constructor(data, photographerId) {
        super(data, photographerId);
        this.video = data.video;
    }

    createMediaElement() {
        const video = document.createElement('video');
        video.src = `assets/images/${this.photographerId}/${this.video}`;
        video.className = 'media-video';
        video.setAttribute('tabindex', '0');
        video.setAttribute('aria-label', `Vidéo: ${this.title}`);
        video.controls = false;
        return video;
    }
}

class MediaFactory {
    static createMedia(data, photographerId) {
        if (data.image) {
            return new ImageMedia(data, photographerId);
        } else if (data.video) {
            return new VideoMedia(data, photographerId);
        } else {
            throw new Error("Type de média non reconnu");
        }
    }
}
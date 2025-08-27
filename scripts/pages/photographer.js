async function getPhotographerData() {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data;
}

function getPhotographerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

async function displayPhotographerInfo() {
    const data = await getPhotographerData();
    const photographerId = getPhotographerIdFromUrl();
    const photographer = data.photographers.find(p => p.id === photographerId);
    
    if (photographer) {
        const photographHeader = document.querySelector('.photograph-header');
        const photographerTemplateInstance = photographerTemplate(photographer);
        const headerElements = photographerTemplateInstance.getPhotographerHeaderDOM();
        
        photographHeader.insertBefore(headerElements.photographerInfo, photographHeader.firstChild);
        photographHeader.appendChild(headerElements.photographerImage);
        
        const modalPhotographerName = document.getElementById('photographer-name-modal');
        if (modalPhotographerName) {
            modalPhotographerName.textContent = photographer.name;
        }
        
        displayPhotographerMedia(data.media, photographer);
    }
}

async function displayPhotographerMedia(allMedia, photographer) {
    const photographerMedia = allMedia.filter(media => media.photographerId === photographer.id);
    
    const main = document.getElementById('main');
    
    const sortingSection = document.createElement('div');
    sortingSection.className = 'sorting-section';
    
    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Trier par';
    sortLabel.setAttribute('for', 'sort-select');
    
    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort-select';
    sortSelect.setAttribute('tabindex', '0');
    sortSelect.setAttribute('aria-label', 'Trier par');
    
    const options = [
        { value: 'popularity', text: 'Popularité' },
        { value: 'date', text: 'Date' },
        { value: 'title', text: 'Titre' }
    ];
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        sortSelect.appendChild(optionElement);
    });
    
    sortingSection.appendChild(sortLabel);
    sortingSection.appendChild(sortSelect);
    
    const mediaGallery = document.createElement('div');
    mediaGallery.className = 'media-gallery';
    mediaGallery.setAttribute('role', 'main');
    mediaGallery.setAttribute('aria-label', `Galerie de ${photographer.name}`);
    
    main.appendChild(sortingSection);
    main.appendChild(mediaGallery);
    
    const sortedMedia = sortMedia(photographerMedia, 'popularity');
    renderMedia(sortedMedia, photographer, mediaGallery);
    
    sortSelect.addEventListener('change', () => {
        const sortedMedia = sortMedia(photographerMedia, sortSelect.value);
        renderMedia(sortedMedia, photographer, mediaGallery);
    });
}

function sortMedia(media, sortBy) {
    const sortedMedia = [...media];
    
    switch(sortBy) {
        case 'popularity':
            return sortedMedia.sort((a, b) => b.likes - a.likes);
        case 'date':
            return sortedMedia.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            return sortedMedia.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sortedMedia;
    }
}

function renderMedia(mediaList, photographer, container) {
    container.innerHTML = '';
    
    mediaList.forEach(mediaData => {
        try {
            const media = MediaFactory.createMedia(mediaData, photographer.id);
            const mediaElement = media.getMediaCardDOM();
            container.appendChild(mediaElement);
        } catch (error) {
            console.error('Erreur lors de la création du média:', error);
        }
    });
    
    updatePhotographerStats(mediaList, photographer);
}

function updatePhotographerStats(mediaList, photographer) {
    const totalLikes = mediaList.reduce((sum, media) => sum + media.likes, 0);
    
    let statsContainer = document.querySelector('.photographer-stats');
    if (statsContainer) {
        statsContainer.remove();
    }
    
    const photographerTemplateInstance = photographerTemplate(photographer);
    const statsElement = photographerTemplateInstance.getPhotographerStatsDOM(totalLikes);
    
    document.body.appendChild(statsElement);
}

document.addEventListener('DOMContentLoaded', displayPhotographerInfo);
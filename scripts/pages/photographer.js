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
        
        const photographerInfo = document.createElement('div');
        photographerInfo.className = 'photographer-info';
        
        const photographerDetails = document.createElement('div');
        photographerDetails.className = 'photographer-details';
        
        const name = document.createElement('h1');
        name.textContent = photographer.name;
        name.className = 'photographer-name';
        name.setAttribute('tabindex', '0');
        name.setAttribute('aria-label', `Photographe ${photographer.name}`);
        
        const location = document.createElement('p');
        location.textContent = `${photographer.city}, ${photographer.country}`;
        location.className = 'photographer-location';
        location.setAttribute('tabindex', '0');
        location.setAttribute('aria-label', `Localisation: ${photographer.city}, ${photographer.country}`);
        
        const tagline = document.createElement('p');
        tagline.textContent = photographer.tagline;
        tagline.className = 'photographer-tagline';
        tagline.setAttribute('tabindex', '0');
        tagline.setAttribute('aria-label', `Devise du photographe: ${photographer.tagline}`);
        
        photographerDetails.appendChild(name);
        photographerDetails.appendChild(location);
        photographerDetails.appendChild(tagline);
        
        const photographerImage = document.createElement('img');
        photographerImage.src = `assets/photographers/${photographer.portrait}`;
        photographerImage.alt = `Portrait de ${photographer.name}`;
        photographerImage.className = 'photographer-portrait';
        photographerImage.setAttribute('tabindex', '0');
        photographerImage.setAttribute('aria-label', `Photo de profil de ${photographer.name}, photographe`);
        
        photographerInfo.appendChild(photographerDetails);
        photographHeader.insertBefore(photographerInfo, photographHeader.firstChild);
        photographHeader.appendChild(photographerImage);
        
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
            const mediaElement = media.createMediaDOM();
            container.appendChild(mediaElement);
        } catch (error) {
            console.error('Erreur lors de la création du média:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', displayPhotographerInfo);
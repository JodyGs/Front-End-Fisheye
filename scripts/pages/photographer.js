async function getPhotographerData() {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data.photographers;
}

function getPhotographerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

async function displayPhotographerInfo() {
    const photographers = await getPhotographerData();
    const photographerId = getPhotographerIdFromUrl();
    const photographer = photographers.find(p => p.id === photographerId);
    
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
    }
}

document.addEventListener('DOMContentLoaded', displayPhotographerInfo);
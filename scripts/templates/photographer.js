function photographerTemplate(data) {
    const { name, portrait, id, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        article.className = 'photographer-card';
        
        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.className = 'photographer-link';
        
        const img = document.createElement('img');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `Portrait de ${name}, photographe`);
        img.className = 'photographer-portrait';
        
        const h2 = document.createElement('h2');
        h2.textContent = name;
        h2.className = 'photographer-name';
        
        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        location.className = 'photographer-location';
        
        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        taglineElement.className = 'photographer-tagline';
        
        const pricing = document.createElement('p');
        pricing.textContent = `${price}€/jour`;
        pricing.className = 'photographer-price';
        
        link.setAttribute('aria-label', `Voir le profil de ${name}, photographe à ${city}`);
        
        link.appendChild(img);
        link.appendChild(h2);
        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(taglineElement);
        article.appendChild(pricing);
        
        return article;
    }

    function getPhotographerHeaderDOM() {
        const photographerInfo = document.createElement('div');
        photographerInfo.className = 'photographer-info';
        
        const photographerDetails = document.createElement('div');
        photographerDetails.className = 'photographer-details';
        
        const nameElement = document.createElement('h1');
        nameElement.textContent = name;
        nameElement.className = 'photographer-name';
        nameElement.setAttribute('tabindex', '0');
        nameElement.setAttribute('aria-label', `Photographe ${name}`);
        
        const locationElement = document.createElement('p');
        locationElement.textContent = `${city}, ${country}`;
        locationElement.className = 'photographer-location';
        locationElement.setAttribute('tabindex', '0');
        locationElement.setAttribute('aria-label', `Localisation: ${city}, ${country}`);
        
        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        taglineElement.className = 'photographer-tagline';
        taglineElement.setAttribute('tabindex', '0');
        taglineElement.setAttribute('aria-label', `Devise du photographe: ${tagline}`);
        
        photographerDetails.appendChild(nameElement);
        photographerDetails.appendChild(locationElement);
        photographerDetails.appendChild(taglineElement);
        
        const photographerImage = document.createElement('img');
        photographerImage.src = picture;
        photographerImage.alt = `Portrait de ${name}`;
        photographerImage.className = 'photographer-portrait';
        photographerImage.setAttribute('tabindex', '0');
        photographerImage.setAttribute('aria-label', `Photo de profil de ${name}, photographe`);
        
        photographerInfo.appendChild(photographerDetails);
        
        return { photographerInfo, photographerImage };
    }
    
    return { name, picture, getUserCardDOM, getPhotographerHeaderDOM }
}
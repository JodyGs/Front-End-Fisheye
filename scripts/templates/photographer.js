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
    return { name, picture, getUserCardDOM }
}
async function getPhotographers() {
    try {
        const res = await fetch("/data/photographers.json");     
        if (!res.ok) {
            throw new Error("Erreur lors du chargement du JSON : " + res.status);
        }
        
        const data = await res.json(); 
        return data;
    } catch (error) {
        console.error("Erreur dans getPhotographers :", error);
        return [];
    }
}


async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const {photographers} = await getPhotographers();
    displayData(photographers);
}

init();


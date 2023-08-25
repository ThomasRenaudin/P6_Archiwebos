// filtres.js

// Écouteur d'événement pour le chargement initial de la page
window.addEventListener('load', async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        
        if (categories.length > 0) {
            generateFilterButtons(categories);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
    }
});

// Fonction pour générer les boutons de filtre dynamiquement
function generateFilterButtons(categories) {
    const filterButtonsContainer = document.querySelector('.filter-buttons');

    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', showAllWorks);
    filterButtonsContainer.appendChild(allButton);
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', () => filterWorksByCategory(category.id));
        filterButtonsContainer.appendChild(button);
    });
    
    
}

// Fonction pour filtrer les œuvres par catégorie
function filterWorksByCategory(categoryId) {
    const galleryContainer = document.getElementById('gallery-container');
    const allFigures = galleryContainer.querySelectorAll('figure');
    
    allFigures.forEach(figure => {
        const categoryInfo = figure.querySelector('p');
        if (categoryInfo.textContent.includes(`(ID : ${categoryId})`)) {
            figure.style.display = 'block';
        } else {
            figure.style.display = 'none';
        }
    });
}

// Fonction pour afficher toutes les œuvres
function showAllWorks() {
    const galleryContainer = document.getElementById('gallery-container');
    const allFigures = galleryContainer.querySelectorAll('figure');
    
    allFigures.forEach(figure => {
        figure.style.display = 'block';
    });
}
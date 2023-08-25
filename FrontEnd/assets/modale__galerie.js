
// FONCTIONS DE GESTION DES LIENS ENTRE API ET FENETRE MODALE : GALERIE

const modalGalerie = document.querySelector('.modale__galerie');
const successDeleteMessage = document.getElementById('successDeleteMessage');

async function fetchImages() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();

        if (response.status === 200) {
            data.forEach(image => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-container';

                const imgElement = document.createElement('img');
                imgElement.src = image.imageUrl;
                imgElement.width = '78.123';
                imgElement.height = '104.08';
                imgElement.style.flexShrink = '0';

                const deleteIcon = document.createElement('img');
                deleteIcon.src = 'assets/icons/delete.png';
                deleteIcon.className = 'delete-icon';
                deleteIcon.addEventListener('click', async () => {
                    console.log(image);
                    await deleteImage(image.id);
                    clearGallery();
                    fetchImages(); // Actualiser les images après la suppression
                    successDeleteMessage.classList.add('show'); // Affiche le message
                    setTimeout(() => {
                        successDeleteMessage.classList.remove('show'); // Cache le message après trois secondes
                    }, 3000); // Cache le message après 3 secondes
                });

                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(deleteIcon);
                modalGalerie.appendChild(imgContainer);
            });
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

async function deleteImage(imageId) {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch("http://localhost:5678/api/works/"+imageId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer '+token,
            },
        });

        if (response.status === 200) {
            console.log('Image deleted successfully.');
        }

        if (response.status === 400) {
            console.log('pas autorisé');
        }

        if (response.status === 501) {
            console.log('erreur inconnue.');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

function clearGallery() {
    while (modalGalerie.firstChild) {
        modalGalerie.removeChild(modalGalerie.firstChild);
    }
}

fetchImages();


// FONCTIONS DE GESTION DES LIENS ENTRE API ET INDEX.HTML

// Fonction pour ajouter les travaux à la galerie
function addWorksToGallery(works) {
    const galleryContainer = document.getElementById('gallery-container');

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
    
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;
    
        const categoryInfo = document.createElement('p');
        categoryInfo.textContent = `Catégorie : ${work.category.name} (ID : ${work.category.id})`;
        categoryInfo.classList.add('category-info'); // Ajout de la classe CSS 
    
        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.appendChild(categoryInfo);
    
        galleryContainer.appendChild(figure);
    });
}

// Fonction pour récupérer les données des travaux dans l'API.
async function fetchData() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        addWorksToGallery(data);
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}

fetchData();

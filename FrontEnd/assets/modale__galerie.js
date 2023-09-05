
// FONCTIONS DE GESTION DES LIENS ENTRE API ET FENETRE MODALE : GALERIE DE SUPPRESSION

const modalGalerie = document.querySelector('.modale__galerie');
const successDeleteMessage = document.getElementById('successDeleteMessage');

// Fonction pour récupérer les données des travaux dans l'API.


let imageData = [];

async function fetchData() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        imageData = await response.json(); // Stocke les données dans la variable
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}

// Appel de la fonction fetchData pour obtenir les données
fetchData().then(() => {
    // Une fois les données récupérées, appel des fonctions d'affichage a partir de ces données
    addWorksToGallery(imageData);
    addWorksToDeleteGallery(imageData);
});


// FONCTION DE GESTION DE LA GALLERIE DE LA MODALE


function addWorksToDeleteGallery(works) {
    works.forEach(image => {

        // Création de la galerie dans la modale
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

        // Gestion de l'appel à la suppression dans la modale
        deleteIcon.addEventListener('click', async () => {
            console.log(image);
            await deleteImage(image.id);
            clearGalleries();
            // Actualisation des travaux à supprimer avec les nouvelles données
            addWorksToDeleteGallery(imageData);
            addWorksToGallery(imageData);
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


// FONCTION DE SUPPRESSION D UNE OEUVRE 

async function deleteImage(imageId) {
    try {     
        // Supprimer l'élément correspondant du tableau imageData
        imageData = imageData.filter(image => image.id !== imageId);
        const token = localStorage.getItem('jwt_token');
        const response = await fetch("http://localhost:5678/api/works/"+imageId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer '+token,
            },
            
        });

        if (response.status === 200) {
            console.log('Image deleted successfully.');
            // Supprimer l'élément correspondant du tableau imageData
        
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

function clearGalleries() {
    // Vider la galerie de la page principale
    const galleryContainer = document.getElementById('gallery-container');
    while (galleryContainer.firstChild) {
        galleryContainer.removeChild(galleryContainer.firstChild);
    }

    // Vider la galerie de la modale
    while (modalGalerie.firstChild) {
        modalGalerie.removeChild(modalGalerie.firstChild);
    }
}


// FONCTIONS DE GESTION DES LIENS ENTRE API ET INDEX.HTML



// Fonction pour ajouter les travaux à la galerie QUI N EST PAS CELLE DE LA MODALE !!!
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



// SCRIPTS DE GESTION DU FORMULAIRE D AJOUT D OEUVRES



const baseIllustration = document.querySelector('.illustration');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');

let imgMiniatureContainer; // Variable pour stocker la référence au conteneur de la miniature

// Gère les évènements lorsuqu'un fichier est chargé dans le form
fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
        baseIllustration.style.display = 'none';
        displayUploadedImage(selectedFile);
    } else {
        clearUploadedImages();
        baseIllustration.style.display = 'block';
    }
});

// Gestion de l'affichage de la miniature de l'image chargée

function displayUploadedImage(file) {
    clearUploadedImages(); // Supprimer les miniatures précédentes
    
    imgMiniatureContainer = document.createElement('div');
    imgMiniatureContainer.className = 'miniature';
    imgMiniatureContainer.style.position = 'relative';

    const imgMiniature = document.createElement('img');
    imgMiniature.src = URL.createObjectURL(file);
    imgMiniature.width = 78;
    imgMiniature.height = 58;
    
    imgMiniatureContainer.appendChild(imgMiniature);

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icons/delete.png';
    deleteIcon.className = 'delete-icon';
    // Gestion de la suppression de l'image au clic sur l'icones
    deleteIcon.addEventListener('click', () => {
        clearUploadedImages();
        baseIllustration.style.display = 'block';
    });

    imgMiniatureContainer.appendChild(deleteIcon);
    uploadButton.parentNode.insertBefore(imgMiniatureContainer, uploadButton);
}

// Fonction de suppression de l'image chargée 

function clearUploadedImages() {
    if (imgMiniatureContainer) {
        imgMiniatureContainer.parentNode.removeChild(imgMiniatureContainer);
        imgMiniatureContainer = null;
    }
}

// Fonction de gestion de l'envoi du formulaire

const photoForm = document.getElementById('photoForm');
const successMessage = document.getElementById('succesMessage');

photoForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    
    const formData = new FormData();
    formData.append('image', fileInput.files[0]); 
    formData.append('title', document.getElementById('photoTitle').value);
    formData.append('category', parseInt(document.getElementById('photoCategory').value));
    

    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+token,
            },
            body: formData,
        });

        if (response.status === 201) {
                    // Appel de la fonction fetchData pour obtenir les données
            fetchData().then(() => {
                // Une fois les données récupérées, appel des fonctions d'affichage a partir de ces données
                clearGalleries();
                addWorksToGallery(imageData);
                addWorksToDeleteGallery(imageData);
            });
            successMessage.classList.add('show'); // Affiche le message
            setTimeout(() => {
                successMessage.classList.remove('show'); // Cache le message après quelques secondes
            }, 3000); // Cache le message après 3 secondes
            
            // Réinitialise les éléments du formulaire
            clearUploadedImages();
            document.getElementById('fileInput').value = '';
            document.getElementById('photoTitle').value = '';
            document.getElementById('photoCategory').selectedIndex = 0;
            submitFormButton.style.backgroundColor = ''; // Réinitialise la couleur de fond
             submitFormButton.disabled = true;            
        } else {
            console.error('Erreur lors de l\'ajout de l\'image');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite:', error);
    }
});


// FONCTION DE MISE EN EVIDENCE DU BOUTON DE SOUMISSION SI LE FORMULAIRE EST VALIDE 

const photoTitle = document.getElementById('photoTitle');
const photoCategory = document.getElementById('photoCategory');
const submitFormButton = document.getElementById('submitFormButton');

photoForm.addEventListener('input', () => {
    const isFormValid = photoTitle.checkValidity() && photoCategory.checkValidity();
    
    if (isFormValid) {
        submitFormButton.style.backgroundColor = 'green';
        submitFormButton.style.cursor = 'pointer';
        submitFormButton.disabled = false;
    } else {
        submitFormButton.style.backgroundColor = ''; // Réinitialise la couleur de fond
        submitFormButton.disabled = true;
    }
});


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


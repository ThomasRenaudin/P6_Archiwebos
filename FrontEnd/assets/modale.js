    const openModalLink = document.getElementById('openModal');
    const closeModalIcon = document.getElementById('closeModalIcon');
    const closeModalIcon2 = document.getElementById('closeModalIcon2');
    const overlay = document.getElementById('overlay');
    const modal1 = document.getElementById('modal');
    const modal2 = document.getElementById('modal2');
    const addPhotoButton = document.getElementById('addPhotoButton');
    const backButton = document.getElementById('backButton');

    // Ouvrir la modale 1
    openModalLink.addEventListener('click', () => {
        overlay.style.display = 'block';
        modal1.style.display = 'block';
    });

    // Fermer les modales
    closeModalIcon.addEventListener('click', closeModals);
    closeModalIcon2.addEventListener('click', closeModals);
    overlay.addEventListener('click', closeModals);

    // Ouvrir la modale 2 en cliquant sur "ajouter une photo"
    addPhotoButton.addEventListener('click', () => {
        modal1.style.display = 'none';
        modal2.style.display = 'block';
    });

    // Revenir à la modale 1 en cliquant sur "retour.png"
    backButton.addEventListener('click', () => {
        modal2.style.display = 'none';
        modal1.style.display = 'block';
    });

    // Fonction pour fermer toutes les modales
    function closeModals() {
        overlay.style.display = 'none';
        modal1.style.display = 'none';
        modal2.style.display = 'none';
        //location.reload();
    }

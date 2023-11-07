    // Vérification si un token JWT est déjà stocké dans le stockage local
    const jwtToken = localStorage.getItem('jwt_token');

    // Déclaration des liens
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const modaleSection = document.getElementById('modale');
    //const filtres = document.getElementById('filter-buttons')

    // Si un token est présent, l'utilisateur est connecté
    if (jwtToken) {
        loginLink.style.display = 'none'; // Cache le lien de connexion
        logoutLink.style.display = 'block'; // Affiche le lien de déconnexion
        modaleSection.style.display = 'flex'; // Affiche la section
       // filtres.style.display='none'; // Cache les filtres
    } else {
        loginLink.style.display = 'block'; // Affiche le lien de connexion
        logoutLink.style.display = 'none'; // Cache le lien de déconnexion
        modaleSection.style.display = 'none'; // Cache la section
        // filtres.style.display='flex'; // Affiche les filtres
    }

    // Ggestionnaire de clic pour le lien de déconnexion
    logoutLink.querySelector('a').addEventListener('click', function(event) {
        event.preventDefault(); // Sinon ca marche pas

        // Supprime le token JWT du stockage local
        localStorage.removeItem('jwt_token');

        // Redirige vers login.html
        window.location.href = 'login.html';
    });

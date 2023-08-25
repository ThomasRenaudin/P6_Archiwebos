
const form = document.getElementById('login-form'); 
const messageElement = document.getElementById('message');


//Verification de si l'utilisateur est déja connecté
    const jwtToken = localStorage.getItem('jwt_token');
    if (jwtToken) {
        // Redirection
        window.location.href = 'index.html';
    }



// Fonction qui sera appelée lors de la soumission du formulaire
async function submitForm(event) {
    event.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (response.status === 200) {
        messageElement.textContent = 'Connexion réussie, vous allez être redirigé vers la page d\'accueil.';
        messageElement.style.display = 'block';
        console.log('Token JWT:', data.token);

        localStorage.setItem('jwt_token', data.token);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else if (response.status === 401) {
        messageElement.textContent = 'Mot de passe incorrect';
        messageElement.style.display = 'block';
    } else if (response.status === 404) {
        messageElement.textContent = 'Utilisateur inconnu';
        messageElement.style.display = 'block';
    } else {
        messageElement.textContent = 'Erreur: ' + data.message;
        messageElement.style.display = 'block';
    }

    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
    }, 2000);
}

// Ajoute un event listener pour la soumission du formulaire
form.addEventListener('submit', submitForm);

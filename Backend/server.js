// Importer le module 'http', qui permet de gérer les requêtes HTTP (demandes) et les réponses.
const http = require('http');
// Importer le module 'app', qui contient la configuration de l'application.
const app = require('./app');

// Fonction pour normaliser le port en un nombre entier.
const normalizePort = val => {
	// Convertir la valeur du port en un nombre entier.
	const port = parseInt(val, 10);

	// Vérifier si le port n'est pas un nombre.
	if (isNaN(port)) {
		return val; // Si ce n'est pas un nombre, retourner la valeur telle quelle.
	}

	// Vérifier si le port est positif ou nul.
	if (port >= 0) {
		return port; // Si le port est valide, retourner le port.
	}

	return false; // Retourner 'false' si le port est invalide.
};

// Récupérer le port à partir de l'environnement ou utiliser le port 5678 par défaut.
const port = normalizePort(process.env.PORT || '5678');
// Configurer l'application pour écouter sur le port déterminé.
app.set('port', port);

// Fonction pour gérer les erreurs liées à l'écoute sur le port.
const errorHandler = error => {
	if (error.syscall !== 'listen') {
		throw error; // Si l'erreur n'est pas liée à l'écoute, la jeter.
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1); // Quitter le processus si les privilèges nécessaires sont manquants.
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1); // Quitter le processus si le port est déjà utilisé.
			break;
		default:
			throw error; // Lancer une erreur pour tout autre problème.
	}
};

// Créer le serveur en utilisant l'application configurée.
const server = http.createServer(app);

// Gérer les erreurs sur le serveur en utilisant la fonction 'errorHandler'.
server.on('error', errorHandler);

// Action à effectuer lorsque le serveur commence à écouter.
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind); // Afficher un message lorsque le serveur écoute.
});

// Démarrer le serveur pour qu'il écoute les demandes entrantes.
server.listen(port);

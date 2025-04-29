// Authentication functions using firebaseAuth (initialized globally in firebase-init.js)

// Check if user is authenticated
function checkAuthState(callback) {
    firebaseAuth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            if (callback && typeof callback === 'function') {
                callback(user);
            }
        } else {
            // User is signed out
            if (!window.location.pathname.includes('area-do-paciente.html')) {
                window.location.href = 'area-do-paciente.html';
            }
        }
    });
}

// Login with email and password
function loginWithEmail(email, password, rememberMe) {
    const persistence = rememberMe 
        ? firebase.auth.Auth.Persistence.LOCAL 
        : firebase.auth.Auth.Persistence.SESSION;

    return firebaseAuth.setPersistence(persistence)
        .then(() => {
            return firebaseAuth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const userData = {
                        firstName: userCredential.user.displayName?.split(' ')[0] || '',
                        lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
                        email: userCredential.user.email
                    };
                    localStorage.setItem('userData', JSON.stringify(userData));
                    return userCredential.user;
                });
        });
}

// Register with email and password
function registerWithEmail(firstName, lastName, email, password) {
    return firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: `${firstName} ${lastName}`
            }).then(() => {
                const userData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                return userCredential.user;
            });
        });
}

// Logout
function logout() {
    return firebaseAuth.signOut();
}

// Get current user
function getCurrentUser() {
    return firebaseAuth.currentUser;
}

// Get error message based on error code
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'Usuário não encontrado. Verifique seu email.';
        case 'auth/wrong-password':
            return 'Senha incorreta. Tente novamente.';
        case 'auth/invalid-email':
            return 'Email inválido. Verifique o formato.';
        case 'auth/user-disabled':
            return 'Esta conta foi desativada. Entre em contato com o suporte.';
        case 'auth/email-already-in-use':
            return 'Este email já está em uso. Tente fazer login.';
        case 'auth/operation-not-allowed':
            return 'Cadastro por email está desativado. Entre em contato com o suporte.';
        case 'auth/weak-password':
            return 'Senha muito fraca. Use uma senha mais forte.';
        default:
            return 'Erro ao processar sua solicitação. Tente novamente mais tarde.';
    }
}

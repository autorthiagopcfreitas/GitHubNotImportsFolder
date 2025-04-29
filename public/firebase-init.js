// firebase-init.js

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCi8pNc-zt4gSWlrA-0NCIgV0F14nnxClk",
  authDomain: "kerem-kesia.firebaseapp.com",
  projectId: "kerem-kesia",
  storageBucket: "kerem-kesia.firebasestorage.app",
  messagingSenderId: "277928810829",
  appId: "1:277928810829:web:917f5d4658e3b8ce363f04",
  measurementId: "G-5MK89B0LNT"
};


// Initialize Firebase app only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Auth & Google Provider
window.firebaseAuth = firebase.auth();
window.firebaseProvider = new firebase.auth.GoogleAuthProvider();

// Initialize Firestore
window.firestore = firebase.firestore();

// Funções para sincronização com Firestore
window.syncTestResults = async function() {
  try {
    // Verificar se o usuário está logado
    const user = window.firebaseAuth.currentUser;
    if (!user) {
      console.log('Usuário não está logado. Não é possível sincronizar com Firestore.');
      return false;
    }

    // Obter resultados dos testes do localStorage
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    if (testHistory.length === 0) {
      console.log('Nenhum resultado de teste para sincronizar.');
      return true;
    }

    // Referência para a coleção de testes do usuário
    const userTestsRef = window.firestore.collection('users').doc(user.uid).collection('tests');
    
    // Verificar quais testes já estão no Firestore
    const existingTests = await userTestsRef.get();
    const existingTestIds = new Set();
    existingTests.forEach(doc => {
      if (doc.data().testId) {
        existingTestIds.add(doc.data().testId);
      }
    });
    
    // Adicionar um ID único para cada teste se não existir
    const testsToSync = testHistory.map(test => {
      if (!test.testId) {
        test.testId = `${test.test}_${test.date}_${Math.random().toString(36).substring(2, 10)}`;
      }
      return test;
    });
    
    // Filtrar apenas os testes que ainda não estão no Firestore
    const newTests = testsToSync.filter(test => !existingTestIds.has(test.testId));
    
    // Sincronizar novos testes com o Firestore
    const batch = window.firestore.batch();
    newTests.forEach(test => {
      const testDoc = userTestsRef.doc(test.testId);
      batch.set(testDoc, {
        ...test,
        userId: user.uid,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    
    if (newTests.length > 0) {
      await batch.commit();
      console.log(`${newTests.length} testes sincronizados com o Firestore.`);
      
      // Atualizar o localStorage com os IDs dos testes
      localStorage.setItem('testHistory', JSON.stringify(testsToSync));
    } else {
      console.log('Todos os testes já estão sincronizados.');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar resultados dos testes:', error);
    return false;
  }
};

window.loadTestsFromFirestore = async function() {
  try {
    // Verificar se o usuário está logado
    const user = window.firebaseAuth.currentUser;
    if (!user) {
      console.log('Usuário não está logado. Não é possível carregar do Firestore.');
      return false;
    }
    
    // Referência para a coleção de testes do usuário
    const userTestsRef = window.firestore.collection('users').doc(user.uid).collection('tests');
    
    // Obter todos os testes do Firestore
    const testsSnapshot = await userTestsRef.orderBy('date', 'asc').get();
    
    if (testsSnapshot.empty) {
      console.log('Nenhum teste encontrado no Firestore.');
      return true;
    }
    
    // Converter os documentos em objetos
    const firestoreTests = [];
    testsSnapshot.forEach(doc => {
      const testData = doc.data();
      // Remover campos específicos do Firestore
      delete testData.syncedAt;
      firestoreTests.push(testData);
    });
    
    // Obter testes do localStorage
    const localTests = JSON.parse(localStorage.getItem('testHistory') || '[]');
    
    // Mesclar testes do Firestore com testes locais
    const mergedTests = [...localTests];
    
    // Adicionar apenas testes do Firestore que não existem localmente
    const localTestIds = new Set(localTests.map(test => test.testId).filter(Boolean));
    
    firestoreTests.forEach(firestoreTest => {
      if (!localTestIds.has(firestoreTest.testId)) {
        mergedTests.push(firestoreTest);
      }
    });
    
    // Ordenar por data
    mergedTests.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Atualizar o localStorage
    localStorage.setItem('testHistory', JSON.stringify(mergedTests));
    
    console.log(`${firestoreTests.length} testes carregados do Firestore.`);
    return true;
  } catch (error) {
    console.error('Erro ao carregar testes do Firestore:', error);
    return false;
  }
};

window.syncSessionData = async function() {
  try {
    // Verificar se o usuário está logado
    const user = window.firebaseAuth.currentUser;
    if (!user) {
      console.log('Usuário não está logado. Não é possível sincronizar dados de sessão.');
      return false;
    }
    
    // Registrar o login do usuário
    const userRef = window.firestore.collection('users').doc(user.uid);
    
    // Atualizar dados do usuário
    await userRef.set({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      loginCount: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
    
    console.log('Dados de sessão sincronizados com o Firestore.');
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar dados de sessão:', error);
    return false;
  }
};

// Attach login function globally
window.loginWithGoogle = async function () {
  if (!window.firebaseAuth || !window.firebaseProvider) {
    console.error("Firebase não está pronto. Tentando recarregar a página.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    return;
  }
  try {
    // Optional: add loading indicator logic if you have setLoading()
    if (typeof setLoading === 'function') setLoading(true);

    const result = await window.firebaseAuth.signInWithPopup(window.firebaseProvider);
    console.log("Login Google OK:", result.user);
    
    // Sincronizar dados de sessão
    await window.syncSessionData();
    
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error("Erro no Google login:", error);
    const el = document.getElementById('loginError');
    if (el) {
      el.textContent = error.message;
      el.style.display = 'block';
    }
  } finally {
    if (typeof setLoading === 'function') setLoading(false);
  }
};

# Site da Psicóloga Kerem Kesia

Este é o site da Psicóloga Kerem Kesia, desenvolvido com HTML, CSS e JavaScript.

## Estrutura do Projeto

- `index.html` - Página inicial do site
- `area-do-paciente.html` - Página de login e registro
- `dashboard.html` - Dashboard do paciente após login
- `agendamento.html` - Página de agendamento de sessões
- `blog.html` - Blog com artigos sobre psicologia
- `sobre.html` - Página sobre a psicóloga
- `styles.css` - Estilos CSS do site
- `script.js` - Scripts JavaScript gerais
- `firebase-config.js` - Configuração do Firebase
- `auth.js` - Funções de autenticação

## Configuração do Firebase

O site utiliza o Firebase para autenticação e análise. Para configurar o Firebase:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o serviço de Authentication e configure os provedores de autenticação (email/senha)
3. Ative o Firebase Analytics para rastrear o uso do site
4. As credenciais já estão configuradas no arquivo `firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBmAWdcYPLvUBz_LJv6spNlLZjo-_VK_IA",
    authDomain: "db-para-site-kerem-kesia-pro.firebaseapp.com",
    projectId: "db-para-site-kerem-kesia-pro",
    messagingSenderId: "825267060358",
    appId: "1:825267060358:web:2fdc16e49af48d48949b07",
    measurementId: "G-2JQ91FBNQX"
};
```

## Funcionalidades de Autenticação

O site oferece as seguintes funcionalidades de autenticação:

- Login com email e senha
- Registro de novos usuários
- Opção "Lembrar-me" para manter o usuário logado
- Redirecionamento automático para o dashboard após login
- Proteção de rotas (área do paciente)
- Logout

## Firebase Analytics

O site utiliza o Firebase Analytics para rastrear o uso e comportamento dos usuários. Isso permite:

- Monitorar o número de visitantes
- Analisar o comportamento dos usuários
- Identificar as páginas mais populares
- Acompanhar conversões e eventos importantes

## Desenvolvimento

Para desenvolver localmente:

1. Clone este repositório
2. Abra o arquivo `index.html` em seu navegador

## Implantação

Para implantar o site:

1. Instale o Firebase CLI globalmente: `npm install -g firebase-tools`
2. Faça login no Firebase: `firebase login`
3. Inicialize o projeto: `firebase init`
4. Implante o site: `firebase deploy`

O site estará disponível em: https://keremkesia.web.app

## Contato

Para mais informações, entre em contato com keremkesia@proton.me

# Integração com Firebase Firestore

Este documento descreve a implementação da integração com o Firebase Firestore para armazenar os resultados dos testes de ansiedade e estresse na nuvem.

## Estrutura de Dados

### Coleção `users`

- Cada documento representa um usuário e tem o ID igual ao UID do Firebase Auth
- Campos:
  - `email`: Email do usuário
  - `displayName`: Nome de exibição do usuário
  - `photoURL`: URL da foto do perfil
  - `lastLogin`: Timestamp do último login
  - `loginCount`: Contador de logins

### Subcoleção `tests`

- Cada documento representa um teste realizado pelo usuário
- Campos:
  - `testId`: ID único do teste
  - `test`: Tipo de teste ('anxiety' ou 'stress')
  - `date`: Data e hora do teste
  - `score`: Pontuação obtida
  - `maxScore`: Pontuação máxima possível
  - `level`: Nível de resultado ('minimal', 'moderate', 'severe' para ansiedade; 'low', 'moderate', 'high' para estresse)
  - `userId`: UID do usuário
  - `syncedAt`: Timestamp da sincronização com o Firestore

## Fluxo de Sincronização

1. **Login do Usuário**:
   - Ao fazer login, os dados da sessão são registrados no Firestore
   - Os testes armazenados no Firestore são carregados e mesclados com os testes locais

2. **Realização de Testes**:
   - Os resultados são salvos no localStorage
   - Se o usuário estiver logado, os resultados são sincronizados com o Firestore

3. **Sincronização Manual**:
   - O usuário pode sincronizar manualmente clicando no botão de sincronização no dashboard
   - Isso carrega os testes do Firestore e envia os testes locais para o Firestore

4. **Logout**:
   - Antes de fazer logout, os dados são sincronizados automaticamente com o Firestore

## Funções de Sincronização

- `syncSessionData()`: Registra dados da sessão do usuário
- `syncTestResults()`: Sincroniza resultados de testes locais com o Firestore
- `loadTestsFromFirestore()`: Carrega testes do Firestore e mescla com testes locais

## Regras de Segurança

As regras de segurança do Firestore garantem que:

1. Apenas usuários autenticados podem acessar dados
2. Cada usuário só pode acessar seus próprios dados
3. Nenhum usuário pode acessar dados de outros usuários

## Implementação

Para implementar esta integração:

1. Certifique-se de que o Firebase está configurado corretamente no projeto
2. Implante as regras de segurança do Firestore usando o arquivo `firestore.rules`
3. Verifique se os scripts do Firebase estão incluídos em todas as páginas relevantes
4. Teste o fluxo de sincronização fazendo login, realizando testes e verificando o Firestore

## Solução de Problemas

Se os dados não estiverem sincronizando corretamente:

1. Verifique se o usuário está autenticado
2. Verifique os logs do console para erros
3. Certifique-se de que as regras de segurança estão configuradas corretamente
4. Tente a sincronização manual clicando no botão de sincronização no dashboard
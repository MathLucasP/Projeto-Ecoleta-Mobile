import React from 'react';
import { IonPage, IonContent, IonButton, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // 1. Importar o Hook

const LoginPage: React.FC = () => {
  // 2. Chamar o Hook para ter acesso ao objeto de navegação
  const history = useHistory(); 

  const handleLogin = () => {
    // Lógica de autenticação viria aqui...
    
    // Se o login for bem-sucedido:
    
    // 3. Usar 'replace' para navegar para a Home e SUBSTITUIR a tela de Login no histórico.
    // Isso impede que o usuário volte para o Login pelo botão 'voltar' do celular.
    history.replace('/app/home'); 
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Entrar na Plataforma</h2>
        <IonInput label="E-mail" type="email" fill="outline" style={{ marginBottom: '15px' }} />
        <IonInput label="Senha" type="password" fill="outline" style={{ marginBottom: '25px' }} />
        
        <IonButton expand="block" onClick={handleLogin}>
          Acessar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonIcon, IonTabBar, IonTabButton, IonTabs, IonLabel } from '@ionic/react';
import {
  peopleOutline, // Usaremos este para Perfil
  homeOutline,
  mapOutline,
  cubeOutline
} from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';

// Importa os estilos principais do Ionic
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Importa o componente das páginas
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import PerfilPage from './pages/PerfilPage'; // Vou assumir Tab2 como a rota '/coleta'
import ColetorProfilePage from './pages/ColetorProfilePage'; // Página de perfil

// Define a configuração inicial do Ionic para React
setupIonicReact();

// --- Componente principal do Aplicativo (Roteamento) ---
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      
      {/* 1. Rotas que NÃO FAZEM parte das abas (ex: Login, Cadastro, Detalhes Dinâmicos) */}
      {/* 🟢 ROTA DINÂMICA CORRIGIDA: /app/coletor/:id */}
      {/* Esta rota deve ficar FORA do IonTabs para garantir que o IonTabs desapareça em telas de detalhe */}
      
      {/* 2. O wrapper IonTabs para a navegação principal (as abas de navegação inferior) */}
      <IonTabs>
        
        {/* Onde as páginas das abas são renderizadas */}
        <IonRouterOutlet>
          
          {/* Rotas das abas (sem parâmetros dinâmicos) */}
          <Route path="/app/home" component={HomePage} exact={true} /> 
          <Route path="/app/mapa" component={MapPage} exact={true} /> 
          <Route path="/app/perfil" component={PerfilPage} exact={true} /> 
          <Route path="/app/coletor/:id" component={ColetorProfilePage} exact={true} /> 
          
          {/* Rota genérica para Perfil (caso o usuário clique no botão da tab bar) */}
          <Route path="/app/coletor" exact={true}>
          </Route>

          {/* Rota de redirecionamento para garantir que ao acessar /app, vá para a Home */}
          <Route exact path="/app">
            <Redirect to="/app/home" />
          </Route>
          
        </IonRouterOutlet>

        {/* 3. A Tab Bar (Toolbar de baixo) que faz a navegação entre as abas */}
        <IonTabBar slot="bottom" style={{ '--background': '#fff', '--border-top': '1px solid #eee' }}>
          
          {/* 💡 Novo Botão Perfil Genérico (Substitui o botão "Coletor" estático) */}
          <IonTabButton tab="perfil" href="/app/perfil">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>

          <IonTabButton tab="home" href="/app/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Início</IonLabel>
          </IonTabButton>

          <IonTabButton tab="mapa" href="/app/mapa">
            <IonIcon icon={mapOutline} />
            <IonLabel>Mapa</IonLabel>
          </IonTabButton>

          <IonTabButton tab="coleta" href="/app/coleta">
            <IonIcon icon={cubeOutline} />
            <IonLabel>Coleta</IonLabel>
          </IonTabButton>

          
        </IonTabBar>
      </IonTabs>
      
      {/* 4. Redirecionamento Inicial: Leva o usuário para a página principal das abas */}
      <Route exact path="/">
        <Redirect to="/app/home" />
      </Route>

    </IonReactRouter>
  </IonApp>
);

export default App;

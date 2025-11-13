import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonIcon, IonTabBar, IonTabButton, IonTabs, IonLabel } from '@ionic/react';
import {
  peopleOutline,
  homeOutline,
  mapOutline,
  cubeOutline,
  personAddOutline
} from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';

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
import PerfilPage from './pages/PerfilPage';
import ColetorProfilePage from './pages/ColetorProfilePage';
import AgendamentoPage from './pages/AgendamentoPage';
import SignUpPage from './pages/SignUpPage';
import SignUpPersonalInfo from './pages/SignUpPersonalInfo';
import SignUpAddress from './pages/SignUpAddress';
import SignUpSuccess from './pages/SignUpSuccess';

// Importar páginas do dashboard do gerador
import GeradorHomePage from './pages/GeradorHomePage';
import GeradorHistoricoPage from './pages/GeradorHistoricoPage';
import GeradorPerfilPage from './pages/GeradorPerfilPage';
import GeradorConfiguracoesPage from './pages/GeradorConfiguracoesPage';
import GeradorSolicitarColetaPage from './pages/GeradorSolicitarColetaPage';

setupIonicReact();

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Verifica se está em uma página do gerador
  const isGeradorPage = location.pathname.startsWith('/app/gerador-');
  
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Rotas das abas principais */}
        <Route path="/app/home" component={HomePage} exact={true} /> 
        <Route path="/app/mapa" component={MapPage} exact={true} /> 
        <Route path="/app/perfil" component={PerfilPage} exact={true} /> 
        <Route path="/app/agendamento" component={AgendamentoPage} exact={true} /> 
        
        {/* Rotas de SignUp - CORRIGIDAS com / no início */}
        <Route path="/app/signup" component={SignUpPage} exact={true}/>
        <Route path="/app/personal-info" component={SignUpPersonalInfo} exact={true} />
        <Route path="/app/address" component={SignUpAddress} exact={true} />
        <Route path="/app/success" component={SignUpSuccess} exact={true} />
        
        {/* Rota de perfil do coletor com parâmetro dinâmico */}
        <Route path="/app/coletor/:id" component={ColetorProfilePage} exact={true} />
        
        {/* === ROTAS DO DASHBOARD DO GERADOR === */}
        <Route path="/app/gerador-home" component={GeradorHomePage} exact={true} />
        <Route path="/app/gerador-historico" component={GeradorHistoricoPage} exact={true} />
        <Route path="/app/gerador-perfil" component={GeradorPerfilPage} exact={true} />
        <Route path="/app/gerador-configuracoes" component={GeradorConfiguracoesPage} exact={true} />
        <Route path="/app/gerador-solicitar" component={GeradorSolicitarColetaPage} exact={true} />
        
        {/* Redirecionamento padrão */}
        <Route exact path="/app">
          <Redirect to="/app/home" />
        </Route>
      </IonRouterOutlet>

      {/* Tab Bar - Só aparece se NÃO estiver em página do gerador */}
      {!isGeradorPage && (
        <IonTabBar slot="bottom" style={{ '--background': '#fff', '--border-top': '1px solid #eee' }}>
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

          <IonTabButton tab="agendamento" href="/app/agendamento">
            <IonIcon icon={cubeOutline} />
            <IonLabel>Agendamento</IonLabel>
          </IonTabButton>

          {/* Botão de SignUp removido da tab bar - geralmente só aparece no modal/link */}
        </IonTabBar>
      )}
    </IonTabs>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppContent />
      
      <Route exact path="/">
        <Redirect to="/app/home" />
      </Route>
    </IonReactRouter>
  </IonApp>
);

export default App;
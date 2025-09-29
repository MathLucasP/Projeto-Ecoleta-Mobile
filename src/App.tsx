import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
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

/* Theme variables */
// import './theme/variables.css';

// Importa o componente da página inicial
import HomePage from './pages/HomePage';

// Define a configuração inicial do Ionic para React
setupIonicReact();

// --- Componente principal do Aplicativo (Roteamento) ---
const App: React.FC = () => {
  // Nota: Este App.tsx é o roteador base e deve ser o ponto de entrada
  // da sua aplicação (Root Component).

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Define a rota principal para a HomePage */}
          <Route exact path="/home">
            <HomePage />
          </Route>

          {/* Rotas de placeholder para os botões da TabBar */}
          <Route exact path="/perfil">
            <Redirect to="/home" /> {/* Redireciona para Home por enquanto */}
          </Route>
          <Route exact path="/mapa">
            <Redirect to="/home" /> {/* Redireciona para Home por enquanto */}
          </Route>
          <Route exact path="/coleta">
            <Redirect to="/home" /> {/* Redireciona para Home por enquanto */}
          </Route>

          {/* Rota raiz (redireciona para /home) */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

// src/components/AuthGuard.tsx
import React, { useContext } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext'; // Vamos simular o contexto de autenticação

// Interface para garantir que as Props da rota original sejam passadas
interface GuardedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

// Simulação de autenticação (trocar pelo AuthContext real depois)
const useAuth = () => {
  // Em um app real, aqui verificaríamos o token ou o estado do Firebase/Context
  const isAuthenticated = true; // Por enquanto, vamos assumir que está sempre logado para testar
  return { isAuthenticated };
};

const AuthGuard: React.FC<GuardedRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Pega o estado de autenticação
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          // 🟢 Usuário logado: Renderiza o componente solicitado
          <Component {...props} />
        ) : (
          // 🔴 Usuário deslogado: Redireciona para a página de Login
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default AuthGuard;

// --- Como usar no App.tsx (EXEMPLO) ---
/*
// ... dentro do IonRouterOutlet
<AuthGuard path="/app" component={TabsLayout} /> 
*/

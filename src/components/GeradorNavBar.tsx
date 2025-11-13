import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  timeOutline,
  personOutline,
  settingsOutline
} from 'ionicons/icons';

interface GeradorNavBarProps {
  style?: React.CSSProperties;
}

const GeradorNavBar: React.FC<GeradorNavBarProps> = ({ style }) => {
  const history = useHistory();
  const location = useLocation();

  const primaryGreen = '#387E5E';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Dashboard', path: '/app/gerador-home', icon: homeOutline },
    { label: 'Histórico', path: '/app/gerador-historico', icon: timeOutline },
    { label: 'Perfil', path: '/app/gerador-perfil', icon: personOutline },
    { label: 'Configurações', path: '/app/gerador-configuracoes', icon: settingsOutline },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 0',
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => history.push(item.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isActive(item.path) ? primaryGreen : '#999',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
        >
          <IonIcon
            icon={item.icon}
            style={{
              fontSize: '1.5rem',
              marginBottom: '4px',
            }}
          />
          <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GeradorNavBar;

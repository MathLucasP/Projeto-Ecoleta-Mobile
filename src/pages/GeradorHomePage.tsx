import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonBadge,
  IonSpinner,
  setupIonicReact
} from '@ionic/react';
import {
  menu,
  notificationsOutline,
  egg,
  addCircleOutline,
  hourglassOutline,
  checkmarkCircleOutline,
  timeOutline,
  homeOutline
} from 'ionicons/icons';
import GeradorNavBar from '../components/GeradorNavBar';

setupIonicReact();

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
  dangerRed: '#E74C3C',
  successGreen: '#27AE60',
};

interface ColetaRecente {
  id: number;
  quantidade: string;
  status: 'concluida' | 'pendente' | 'cancelada';
  data: string;
  coletor?: string;
}

const GeradorHomePage: React.FC = () => {
  const history = useHistory();
  const [usuario, setUsuario] = useState<any>(null);
  const [coletas, setColetas] = useState<ColetaRecente[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacoes, setNotificacoes] = useState(2);

  useEffect(() => {
    // Carrega dados do usuário
    const usuarioStorage = localStorage.getItem('usuario');
    /*if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage));
    } else {
      history.replace('/app/home');
    }*/

    // Simula carregamento de coletas recentes
    setColetas([
      {
        id: 1,
        quantidade: '15L',
        status: 'concluida',
        data: '15/11/2024',
        coletor: 'João - Coleta Express'
      },
      {
        id: 2,
        quantidade: '10L',
        status: 'pendente',
        data: '16/11/2024',
        coletor: 'Maria Recicla'
      },
      {
        id: 3,
        quantidade: '8L',
        status: 'concluida',
        data: '14/11/2024',
        coletor: 'Pedro Ambiental'
      }
    ]);

    setLoading(false);
  }, [history]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return styles.successGreen;
      case 'pendente':
        return styles.secondaryYellow;
      case 'cancelada':
        return styles.dangerRed;
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return checkmarkCircleOutline;
      case 'pendente':
        return timeOutline;
      case 'cancelada':
        return hourglassOutline;
      default:
        return timeOutline;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen, '--padding': '8px 16px', '--min-height': '56px' }}>
          <IonButtons slot="start">
            <IonMenuButton>
              <IonIcon icon={menu} style={{ color: '#fff' }} />
            </IonMenuButton>
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
            Dashboard
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => history.push('/app/home')}
              title="Voltar para Home"
              style={{ '--min-height': '40px' }}
            >
              <IonIcon icon={homeOutline} style={{ color: '#fff', fontSize: '1.3rem' }} />
            </IonButton>
            <IonButton
              style={{ position: 'relative', '--min-height': '40px' }}
            >
              <IonIcon icon={notificationsOutline} style={{ color: '#fff', fontSize: '1.3rem' }} />
              {notificacoes > 0 && (
                <IonBadge
                  color="danger"
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    fontSize: '0.7rem'
                  }}
                >
                  {notificacoes}
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <IonSpinner name="circles" color={styles.primaryGreen} />
          </div>
        ) : (
          <div style={{ paddingBottom: '80px' }}>
            {/* Saudação */}
            <div style={{ marginBottom: '25px' }}>
              <h1 style={{ color: styles.primaryGreen, fontSize: '1.8rem', marginBottom: '5px' }}>
                Olá, {usuario?.nome?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>
                Gerencie suas solicitações de coleta
              </p>
            </div>

            {/* Card de Estatísticas */}
            <IonCard
              style={{
                borderRadius: '15px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <IonIcon
                    icon={egg}
                    style={{
                      fontSize: '2rem',
                      color: styles.primaryGreen,
                      marginRight: '15px'
                    }}
                  />
                  <div>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.85rem' }}>
                      Óleo Reciclado
                    </p>
                    <h3 style={{ margin: '5px 0 0 0', color: styles.primaryGreen, fontSize: '1.5rem' }}>
                      25L
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#f0f8f0',
                    padding: '15px',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${styles.primaryGreen}`
                  }}
                >
                  <p style={{ margin: '0', color: '#666', fontSize: '0.85rem' }}>
                    ✨ Você ajudou a evitar a poluição de aproximadamente <strong>500.000L</strong> de água!
                  </p>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Cards de Ações Rápidas */}
            <IonGrid style={{ padding: '0', marginBottom: '20px' }}>
              <IonRow style={{ gap: '10px' }}>
                <IonCol size="6">
                  <IonCard
                    style={{
                      margin: '0',
                      borderRadius: '15px',
                      background: styles.primaryGreen,
                      cursor: 'pointer'
                    }}
                    onClick={() => history.push('/app/gerador-solicitar')}
                  >
                    <IonCardContent style={{ padding: '15px', textAlign: 'center', color: '#fff' }}>
                      <IonIcon
                        icon={addCircleOutline}
                        style={{ fontSize: '2.5rem', marginBottom: '10px' }}
                      />
                      <h3 style={{ margin: '0', fontSize: '0.95rem', fontWeight: 'bold' }}>
                        Nova Coleta
                      </h3>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard
                    style={{
                      margin: '0',
                      borderRadius: '15px',
                      background: styles.secondaryYellow,
                      cursor: 'pointer'
                    }}
                    onClick={() => history.push('/app/gerador-historico')}
                  >
                    <IonCardContent style={{ padding: '15px', textAlign: 'center', color: '#fff' }}>
                      <IonIcon
                        icon={hourglassOutline}
                        style={{ fontSize: '2.5rem', marginBottom: '10px' }}
                      />
                      <h3 style={{ margin: '0', fontSize: '0.95rem', fontWeight: 'bold' }}>
                        Histórico
                      </h3>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            {/* Status da Coleta Atual */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>
                Coleta Atual
              </h2>
              <IonCard
                style={{
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderLeft: `6px solid ${styles.primaryGreen}`
                }}
              >
                <IonCardContent style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}
                    >
                      <p style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>
                        João - Coleta Express
                      </p>
                      <IonBadge style={{ background: styles.successGreen }}>
                        Confirmado
                      </IonBadge>
                    </div>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                      10L de óleo • 16/11/2024 • 14:30
                    </p>
                  </div>

                  {/* Timeline de Status */}
                  <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: styles.successGreen,
                          marginRight: '10px'
                        }}
                      />
                      <p style={{ margin: '0', color: '#333', fontSize: '0.9rem' }}>
                        ✓ Coleta Solicitada
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: styles.successGreen,
                          marginRight: '10px'
                        }}
                      />
                      <p style={{ margin: '0', color: '#333', fontSize: '0.9rem' }}>
                        ✓ Coletor Confirmado
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: styles.secondaryYellow,
                          marginRight: '10px',
                          animation: 'pulse 2s infinite'
                        }}
                      />
                      <p style={{ margin: '0', color: '#333', fontSize: '0.9rem' }}>
                        ⏳ Aguardando Coleta
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Histórico Recente */}
            <div style={{ marginBottom: '30px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
              >
                <h2 style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold', margin: '0' }}>
                  Histórico Recente
                </h2>
                <IonButton
                  size="small"
                  fill="clear"
                  onClick={() => history.push('/app/gerador-historico')}
                  style={{ '--color': styles.primaryGreen }}
                >
                  Ver Todos
                </IonButton>
              </div>

              {coletas.map((coleta) => (
                <IonCard
                  key={coleta.id}
                  style={{
                    borderRadius: '12px',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <IonCardContent style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                          {coleta.quantidade}
                        </p>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.85rem' }}>
                          {coleta.data} • {coleta.coletor}
                        </p>
                      </div>
                      <IonIcon
                        icon={getStatusIcon(coleta.status)}
                        style={{
                          fontSize: '1.5rem',
                          color: getStatusColor(coleta.status)
                        }}
                      />
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </div>
        )}

        {/* CSS para animação de pulse */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </IonContent>
      <GeradorNavBar />
    </IonPage>
  );
};

export default GeradorHomePage;

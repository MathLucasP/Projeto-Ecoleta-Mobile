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
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonBadge,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  setupIonicReact
} from '@ionic/react';
import {
  arrowBack,
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
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

interface Coleta {
  id: number;
  quantidade: string;
  status: 'concluida' | 'pendente' | 'cancelada';
  data: string;
  coletor: string;
  horario: string;
  localizacao: string;
}

const GeradorHistoricoPage: React.FC = () => {
  const history = useHistory();
  const [filtro, setFiltro] = useState<'todas' | 'concluida' | 'pendente' | 'cancelada'>('todas');
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de histórico
    const todasColetas: Coleta[] = [
      {
        id: 1,
        quantidade: '15L',
        status: 'concluida',
        data: '15/11/2024',
        coletor: 'João - Coleta Express',
        horario: '14:30',
        localizacao: 'Rua das Flores, 123'
      },
      {
        id: 2,
        quantidade: '10L',
        status: 'pendente',
        data: '16/11/2024',
        coletor: 'Maria Recicla',
        horario: '10:00',
        localizacao: 'Avenida Brasil, 456'
      },
      {
        id: 3,
        quantidade: '8L',
        status: 'concluida',
        data: '14/11/2024',
        coletor: 'Pedro Ambiental',
        horario: '16:45',
        localizacao: 'Rua da Paz, 789'
      },
      {
        id: 4,
        quantidade: '12L',
        status: 'cancelada',
        data: '13/11/2024',
        coletor: 'Carlos Sustentável',
        horario: '11:00',
        localizacao: 'Rua do Comércio, 321'
      },
      {
        id: 5,
        quantidade: '20L',
        status: 'concluida',
        data: '12/11/2024',
        coletor: 'João - Coleta Express',
        horario: '13:00',
        localizacao: 'Rua das Flores, 123'
      },
      {
        id: 6,
        quantidade: '5L',
        status: 'concluida',
        data: '11/11/2024',
        coletor: 'Maria Recicla',
        horario: '15:30',
        localizacao: 'Avenida Brasil, 456'
      }
    ];

    setColetas(todasColetas);
    setLoading(false);
  }, []);

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
        return closeCircleOutline;
      default:
        return timeOutline;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'pendente':
        return 'Pendente';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const coletasFiltradas =
    filtro === 'todas'
      ? coletas
      : coletas.filter((c) => c.status === filtro);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen, '--padding': '8px 16px', '--min-height': '56px' }}>
          <IonButtons slot="start">
            <IonButton
              onClick={() => history.goBack()}
              title="Voltar"
              style={{ '--min-height': '40px' }}
            >
              <IonIcon icon={arrowBack} style={{ color: '#fff' }} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
            Histórico
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => history.push('/app/home')}
              title="Voltar para Home"
              style={{ '--min-height': '40px' }}
            >
              <IonIcon icon={homeOutline} style={{ color: '#fff', fontSize: '1.3rem' }} />
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
            {/* Filtro por Status */}
            <IonSegment
              value={filtro}
              onIonChange={(e) => setFiltro(e.detail.value as any)}
              style={{ marginBottom: '20px' }}
            >
              <IonSegmentButton value="todas">
                <IonLabel>Todas</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="concluida">
                <IonLabel>Concluídas</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="pendente">
                <IonLabel>Pendentes</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="cancelada">
                <IonLabel>Canceladas</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {coletasFiltradas.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999'
                }}
              >
                <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                  Nenhuma coleta encontrada
                </p>
                <p style={{ fontSize: '0.9rem' }}>
                  {filtro === 'todas'
                    ? 'Você ainda não tem histórico de coletas'
                    : `Você não tem coletas ${getStatusLabel(filtro).toLowerCase()}`}
                </p>
              </div>
            ) : (
              coletasFiltradas.map((coleta) => (
                <IonCard
                  key={coleta.id}
                  style={{
                    borderRadius: '15px',
                    marginBottom: '15px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderLeft: `6px solid ${getStatusColor(coleta.status)}`
                  }}
                >
                  <IonCardContent style={{ padding: '20px' }}>
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: '0',
                            color: styles.primaryGreen,
                            fontSize: '1.3rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {coleta.quantidade}
                        </h3>
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.85rem' }}>
                          {coleta.data} • {coleta.horario}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <IonIcon
                          icon={getStatusIcon(coleta.status)}
                          style={{
                            fontSize: '2rem',
                            color: getStatusColor(coleta.status),
                            marginBottom: '8px',
                            display: 'block'
                          }}
                        />
                        <IonBadge
                          style={{
                            background: getStatusColor(coleta.status),
                            fontSize: '0.75rem',
                            padding: '4px 8px'
                          }}
                        >
                          {getStatusLabel(coleta.status)}
                        </IonBadge>
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div
                      style={{
                        paddingTop: '15px',
                        borderTop: '1px solid #eee'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ margin: '0', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          Coletor
                        </p>
                        <p style={{ margin: '5px 0 0 0', color: '#333', fontWeight: 'bold' }}>
                          {coleta.coletor}
                        </p>
                      </div>

                      <div>
                        <p style={{ margin: '0', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          Local
                        </p>
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                          📍 {coleta.localizacao}
                        </p>
                      </div>
                    </div>

                    {/* Botão Detalhes */}
                    {coleta.status === 'concluida' && (
                      <button
                        style={{
                          marginTop: '15px',
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: `1px solid ${styles.primaryGreen}`,
                          background: '#fff',
                          color: styles.primaryGreen,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Ver Comprovante
                      </button>
                    )}
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>
        )}
      </IonContent>
      <GeradorNavBar />
    </IonPage>
  );
};

export default GeradorHistoricoPage;

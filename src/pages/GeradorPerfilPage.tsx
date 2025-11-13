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
  IonCard,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonSpinner,
  setupIonicReact
} from '@ionic/react';
import {
  arrowBack,
  mailOutline,
  callOutline,
  idCardOutline,
  locationOutline,
  waterOutline,
  starOutline,
  homeOutline
} from 'ionicons/icons';
import GeradorNavBar from '../components/GeradorNavBar';

setupIonicReact();

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

interface Gerador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  foto?: string;
}

const GeradorPerfilPage: React.FC = () => {
  const history = useHistory();
  const [gerador, setGerador] = useState<Gerador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega dados do usuário
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage);
      setGerador({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || '(11) 9 9999-9999',
        cpf: '123.456.789-00',
        endereco: 'Rua das Flores, 123, São Paulo - SP',
        foto: 'https://i.pravatar.cc/150?img=1'
      });
    } /*else {
      history.replace('/app/home');
    }*/
    setLoading(false);
  }, [history]);

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <IonSpinner name="circles" color={styles.primaryGreen} />
          </div>
        </IonContent>
      </IonPage>
    );
  }

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
            Meu Perfil
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
        {gerador && (
          <div style={{ paddingBottom: '80px' }}>
            {/* Seção de Foto e Nome */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '30px 20px',
                backgroundColor: '#fff',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <IonAvatar
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 20px',
                  border: `4px solid ${styles.primaryGreen}`
                }}
              >
                <img src={gerador.foto} alt={gerador.nome} />
              </IonAvatar>
              <h1
                style={{
                  margin: '0 0 5px 0',
                  color: styles.primaryGreen,
                  fontSize: '1.6rem',
                  fontWeight: 'bold'
                }}
              >
                {gerador.nome}
              </h1>
              <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                Gerador de Óleo
              </p>
            </div>

            {/* Informações Pessoais */}
            <div style={{ marginBottom: '20px' }}>
              <h2
                style={{
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  marginLeft: '5px'
                }}
              >
                Informações Pessoais
              </h2>

              <IonCard
                style={{
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  margin: '0'
                }}
              >
                <IonCardContent style={{ padding: '20px' }}>
                  {/* Email */}
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <IonIcon
                      icon={mailOutline}
                      style={{
                        fontSize: '1.5rem',
                        color: styles.primaryGreen,
                        marginTop: '2px'
                      }}
                    />
                    <div>
                      <p style={{ margin: '0', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        E-mail
                      </p>
                      <p style={{ margin: '5px 0 0 0', color: '#333', fontWeight: 'bold' }}>
                        {gerador.email}
                      </p>
                    </div>
                  </div>

                  {/* Telefone */}
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <IonIcon
                      icon={callOutline}
                      style={{
                        fontSize: '1.5rem',
                        color: styles.primaryGreen,
                        marginTop: '2px'
                      }}
                    />
                    <div>
                      <p style={{ margin: '0', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Telefone
                      </p>
                      <p style={{ margin: '5px 0 0 0', color: '#333', fontWeight: 'bold' }}>
                        {gerador.telefone}
                      </p>
                    </div>
                  </div>

                  {/* CPF */}
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <IonIcon
                      icon={idCardOutline}
                      style={{
                        fontSize: '1.5rem',
                        color: styles.primaryGreen,
                        marginTop: '2px'
                      }}
                    />
                    <div>
                      <p style={{ margin: '0', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        CPF
                      </p>
                      <p style={{ margin: '5px 0 0 0', color: '#333', fontWeight: 'bold' }}>
                        {gerador.cpf}
                      </p>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <IonIcon
                      icon={locationOutline}
                      style={{
                        fontSize: '1.5rem',
                        color: styles.primaryGreen,
                        marginTop: '2px'
                      }}
                    />
                    <div>
                      <p style={{ margin: '0', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Endereço
                      </p>
                      <p style={{ margin: '5px 0 0 0', color: '#333', fontWeight: 'bold' }}>
                        {gerador.endereco}
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Estatísticas */}
            <div style={{ marginBottom: '20px' }}>
              <h2
                style={{
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  marginLeft: '5px'
                }}
              >
                Suas Estatísticas
              </h2>

              <IonGrid style={{ padding: '0' }}>
                <IonRow style={{ gap: '10px' }}>
                  {/* Total de Coletas */}
                  <IonCol size="6">
                    <IonCard
                      style={{
                        margin: '0',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: styles.primaryGreen,
                            marginBottom: '5px'
                          }}
                        >
                          12
                        </div>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          Coletas
                        </p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  {/* Total de Óleo */}
                  <IonCol size="6">
                    <IonCard
                      style={{
                        margin: '0',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            marginBottom: '5px'
                          }}
                        >
                          <IonIcon
                            icon={waterOutline}
                            style={{ fontSize: '1.5rem', color: styles.primaryGreen }}
                          />
                          <div
                            style={{
                              fontSize: '2rem',
                              fontWeight: 'bold',
                              color: styles.primaryGreen
                            }}
                          >
                            25L
                          </div>
                        </div>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          Óleo Reciclado
                        </p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>

                <IonRow style={{ gap: '10px', marginTop: '10px' }}>
                  {/* Avaliação */}
                  <IonCol size="6">
                    <IonCard
                      style={{
                        margin: '0',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            marginBottom: '5px'
                          }}
                        >
                          <IonIcon
                            icon={starOutline}
                            style={{ fontSize: '1.5rem', color: styles.secondaryYellow }}
                          />
                          <div
                            style={{
                              fontSize: '2rem',
                              fontWeight: 'bold',
                              color: styles.primaryGreen
                            }}
                          >
                            4.8
                          </div>
                        </div>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          Avaliação
                        </p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>

                  {/* Impacto Ambiental */}
                  <IonCol size="6">
                    <IonCard
                      style={{
                        margin: '0',
                        borderRadius: '15px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <IonCardContent style={{ padding: '20px', textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: styles.primaryGreen,
                            marginBottom: '5px'
                          }}
                        >
                          500K
                        </div>
                        <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                          L de água poupada
                        </p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <IonButton
                expand="block"
                style={{
                  '--background': styles.primaryGreen,
                  '--border-radius': '10px',
                  flex: '1'
                }}
              >
                Editar Perfil
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                style={{
                  '--border-color': '#E74C3C',
                  '--color': '#E74C3C',
                  '--border-radius': '10px',
                  flex: '1'
                }}
                onClick={() => {
                  localStorage.removeItem('usuario');
                  localStorage.removeItem('isLoggedIn');
                  history.replace('/app/home');
                }}
              >
                Sair
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
      <GeradorNavBar />
    </IonPage>
  );
};

export default GeradorPerfilPage;

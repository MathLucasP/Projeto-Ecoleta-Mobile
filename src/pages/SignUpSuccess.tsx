import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonIcon
} from '@ionic/react';
import { checkmarkCircle, homeOutline } from 'ionicons/icons';

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

const SignupSuccess: React.FC = () => {
  const history = useHistory();

  const handleGoHome = () => {
    // Aqui você pode fazer login automático ou redirecionar para a home
    history.replace('/app/home');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        <div style={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          textAlign: 'center'
        }}>
          
          {/* Ícone de Sucesso */}
          <div style={{
            marginBottom: '30px',
            animation: 'scaleIn 0.5s ease-out'
          }}>
            <IonIcon 
              icon={checkmarkCircle} 
              style={{ 
                fontSize: '120px', 
                color: styles.primaryGreen 
              }} 
            />
          </div>

          {/* Título */}
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: styles.primaryGreen,
            marginBottom: '15px' 
          }}>
            Cadastro Realizado!
          </h1>

          {/* Mensagem */}
          <IonText style={{ 
            fontSize: '1.1rem', 
            color: '#666',
            marginBottom: '10px',
            lineHeight: '1.6',
            maxWidth: '400px'
          }}>
            Bem-vindo à Ecoleta! Seu cadastro como gerador foi concluído com sucesso.
          </IonText>

          <IonText style={{ 
            fontSize: '0.95rem', 
            color: '#888',
            marginBottom: '40px',
            lineHeight: '1.5',
            maxWidth: '380px'
          }}>
            Agora você pode começar a agendar coletas de óleo usado e contribuir para um meio ambiente mais sustentável.
          </IonText>

          {/* Benefícios */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: styles.primaryGreen,
              marginBottom: '15px'
            }}>
              O que você pode fazer agora:
            </h3>
            
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                marginBottom: '12px',
                gap: '10px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: styles.secondaryYellow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</span>
                </div>
                <IonText style={{ fontSize: '0.9rem', color: '#555' }}>
                  Agendar coletas de óleo usado
                </IonText>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                marginBottom: '12px',
                gap: '10px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: styles.secondaryYellow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</span>
                </div>
                <IonText style={{ fontSize: '0.9rem', color: '#555' }}>
                  Encontrar coletores próximos a você
                </IonText>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                marginBottom: '12px',
                gap: '10px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: styles.secondaryYellow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</span>
                </div>
                <IonText style={{ fontSize: '0.9rem', color: '#555' }}>
                  Localizar ecopontos na sua região
                </IonText>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: styles.secondaryYellow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>✓</span>
                </div>
                <IonText style={{ fontSize: '0.9rem', color: '#555' }}>
                  Acompanhar seu histórico de coletas
                </IonText>
              </div>
            </div>
          </div>

          {/* Botão Principal */}
          <IonButton
            expand="block"
            onClick={handleGoHome}
            style={{
              '--background': styles.primaryGreen,
              '--border-radius': '12px',
              'fontWeight': 'bold',
              'textTransform': 'none',
              'fontSize': '1.05rem',
              'maxWidth': '400px',
              'width': '100%',
              'height': '50px'
            }}
          >
            <IonIcon icon={homeOutline} slot="start" />
            Ir para a Página Inicial
          </IonButton>

          {/* Texto de Ajuda */}
          <IonText style={{ 
            fontSize: '0.85rem', 
            color: '#999',
            marginTop: '25px',
            maxWidth: '350px'
          }}>
            Dúvidas? Acesse nossa central de ajuda ou entre em contato com nosso suporte.
          </IonText>
        </div>

        {/* Animação CSS */}
        <style>{`
          @keyframes scaleIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </IonContent>
    </IonPage>
  );
};

export default SignupSuccess;
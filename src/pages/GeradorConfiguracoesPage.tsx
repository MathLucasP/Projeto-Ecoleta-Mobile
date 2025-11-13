import React, { useState } from 'react';
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
  IonToggle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  setupIonicReact
} from '@ionic/react';
import {
  arrowBack,
  notificationsOutline,
  settingsOutline,
  shieldOutline,
  informationCircleOutline,
  homeOutline
} from 'ionicons/icons';
import GeradorNavBar from '../components/GeradorNavBar';

setupIonicReact();

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

interface Configuracoes {
  notificacoesEmail: boolean;
  notificacoesPush: boolean;
  notificacoesColeta: boolean;
  notificacoesMensagens: boolean;
  verificacao2fa: boolean;
  visibilidadePerfil: string;
  horarioPreferencial: string;
  quantidadeMedia: string;
}

const GeradorConfiguracoesPage: React.FC = () => {
  const history = useHistory();
  const [configs, setConfigs] = useState<Configuracoes>({
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesColeta: true,
    notificacoesMensagens: false,
    verificacao2fa: false,
    visibilidadePerfil: 'publica',
    horarioPreferencial: 'manha',
    quantidadeMedia: 'medio'
  });

  const [alteracoesSalvas, setAlteracoesSalvas] = useState(false);

  const handleToggle = (chave: keyof Configuracoes, valor: boolean) => {
    setConfigs({ ...configs, [chave]: valor });
    setAlteracoesSalvas(false);
  };

  const handleSelectChange = (chave: keyof Configuracoes, valor: string) => {
    setConfigs({ ...configs, [chave]: valor });
    setAlteracoesSalvas(false);
  };

  const salvarAlteracoes = () => {
    // Aqui você faria a chamada à API para salvar as configurações
    console.log('Configurações salvas:', configs);
    setAlteracoesSalvas(true);
    setTimeout(() => setAlteracoesSalvas(false), 3000);
  };

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
            Configurações
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
        <div style={{ paddingBottom: '80px' }}>
          {/* Notificações */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px',
                marginLeft: '5px'
              }}
            >
              <IonIcon
                icon={notificationsOutline}
                style={{ fontSize: '1.3rem', color: styles.primaryGreen }}
              />
              <h2
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Notificações
              </h2>
            </div>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '0' }}>
                {/* Email */}
                <IonItem lines="inset">
                  <IonLabel>Notificações por E-mail</IonLabel>
                  <IonToggle
                    checked={configs.notificacoesEmail}
                    onIonChange={(e) => handleToggle('notificacoesEmail', e.detail.checked)}
                    slot="end"
                  />
                </IonItem>

                {/* Push */}
                <IonItem lines="inset">
                  <IonLabel>Notificações Push</IonLabel>
                  <IonToggle
                    checked={configs.notificacoesPush}
                    onIonChange={(e) => handleToggle('notificacoesPush', e.detail.checked)}
                    slot="end"
                  />
                </IonItem>

                {/* Coletas */}
                <IonItem lines="inset">
                  <IonLabel>Alertas de Coleta</IonLabel>
                  <IonToggle
                    checked={configs.notificacoesColeta}
                    onIonChange={(e) => handleToggle('notificacoesColeta', e.detail.checked)}
                    slot="end"
                  />
                </IonItem>

                {/* Mensagens */}
                <IonItem>
                  <IonLabel>Notificações de Mensagens</IonLabel>
                  <IonToggle
                    checked={configs.notificacoesMensagens}
                    onIonChange={(e) => handleToggle('notificacoesMensagens', e.detail.checked)}
                    slot="end"
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Privacidade */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px',
                marginLeft: '5px'
              }}
            >
              <IonIcon
                icon={shieldOutline}
                style={{ fontSize: '1.3rem', color: styles.primaryGreen }}
              />
              <h2
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Privacidade e Segurança
              </h2>
            </div>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                {/* Verificação 2FA */}
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <IonText style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
                        Autenticação em Dois Fatores
                      </IonText>
                      <IonText style={{ fontSize: '0.85rem', color: '#666' }}>
                        Proteja sua conta com 2FA
                      </IonText>
                    </div>
                    <IonToggle
                      checked={configs.verificacao2fa}
                      onIonChange={(e) => handleToggle('verificacao2fa', e.detail.checked)}
                    />
                  </div>
                </div>

                {/* Visibilidade do Perfil */}
                <div style={{ marginBottom: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>
                    Visibilidade do Perfil
                  </label>
                  <select
                    value={configs.visibilidadePerfil}
                    onChange={(e) => handleSelectChange('visibilidadePerfil', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid #ddd`,
                      fontSize: '0.95rem',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="publica">Pública</option>
                    <option value="amigos">Apenas Coletores</option>
                    <option value="privada">Privada</option>
                  </select>
                </div>

                {/* Alterar Senha */}
                <IonButton
                  expand="block"
                  fill="outline"
                  style={{
                    '--border-color': styles.primaryGreen,
                    '--color': styles.primaryGreen,
                    '--border-radius': '10px',
                    marginTop: '15px'
                  }}
                >
                  Alterar Senha
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Preferências de Coleta */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px',
                marginLeft: '5px'
              }}
            >
              <IonIcon
                icon={settingsOutline}
                style={{ fontSize: '1.3rem', color: styles.primaryGreen }}
              />
              <h2
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Preferências de Coleta
              </h2>
            </div>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                {/* Horário Preferencial */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>
                    Horário Preferencial para Coleta
                  </label>
                  <select
                    value={configs.horarioPreferencial}
                    onChange={(e) => handleSelectChange('horarioPreferencial', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid #ddd`,
                      fontSize: '0.95rem',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="manha">Manhã (08:00 - 12:00)</option>
                    <option value="tarde">Tarde (12:00 - 18:00)</option>
                    <option value="noite">Noite (18:00 - 22:00)</option>
                    <option value="qualquer">Qualquer Hora</option>
                  </select>
                </div>

                {/* Quantidade Média */}
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>
                    Quantidade Média de Óleo por Coleta
                  </label>
                  <select
                    value={configs.quantidadeMedia}
                    onChange={(e) => handleSelectChange('quantidadeMedia', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: `1px solid #ddd`,
                      fontSize: '0.95rem',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="pequeno">Pequeno (5-10L)</option>
                    <option value="medio">Médio (10-20L)</option>
                    <option value="grande">Grande (20-50L)</option>
                    <option value="muito_grande">Muito Grande (50L+)</option>
                  </select>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Sobre */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px',
                marginLeft: '5px'
              }}
            >
              <IonIcon
                icon={informationCircleOutline}
                style={{ fontSize: '1.3rem', color: styles.primaryGreen }}
              />
              <h2
                style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Sobre o Aplicativo
              </h2>
            </div>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0', color: '#999', fontSize: '0.85rem' }}>
                    Versão
                  </p>
                  <p style={{ margin: '5px 0 0 0', color: '#333', fontWeight: 'bold' }}>
                    1.0.0
                  </p>
                </div>
                <IonButton
                  expand="block"
                  fill="outline"
                  style={{
                    '--border-color': styles.primaryGreen,
                    '--color': styles.primaryGreen,
                    '--border-radius': '10px',
                    fontSize: '0.9rem'
                  }}
                >
                  Política de Privacidade
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  style={{
                    '--border-color': styles.primaryGreen,
                    '--color': styles.primaryGreen,
                    '--border-radius': '10px',
                    fontSize: '0.9rem',
                    marginTop: '10px'
                  }}
                >
                  Termos de Serviço
                </IonButton>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Botões de Ação */}
          {alteracoesSalvas && (
            <div
              style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}
            >
              ✓ Alterações salvas com sucesso!
            </div>
          )}

          <IonButton
            expand="block"
            style={{
              '--background': styles.primaryGreen,
              '--border-radius': '10px',
              marginBottom: '10px'
            }}
            onClick={salvarAlteracoes}
          >
            Salvar Alterações
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            style={{
              '--border-color': '#999',
              '--color': '#999',
              '--border-radius': '10px'
            }}
            onClick={() => history.goBack()}
          >
            Cancelar
          </IonButton>
        </div>
      </IonContent>
      <GeradorNavBar />
    </IonPage>
  );
};

export default GeradorConfiguracoesPage;

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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonToast,
  setupIonicReact
} from '@ionic/react';
import { arrowBack, homeOutline } from 'ionicons/icons';
import GeradorNavBar from '../components/GeradorNavBar';

setupIonicReact();

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

interface FormData {
  volume: string;
  tipo: string;
  data: string;
  horario: string;
  endereco: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  bairro: string;
  observacoes: string;
}

const GeradorSolicitarColetaPage: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState<FormData>({
    volume: '',
    tipo: 'automatico',
    data: '',
    horario: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    bairro: '',
    observacoes: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (campo: keyof FormData, valor: string) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const validarFormulario = (): boolean => {
    if (!formData.volume) {
      setToastMessage('Por favor, informe o volume de óleo');
      setToastColor('danger');
      setShowToast(true);
      return false;
    }

    if (!formData.data) {
      setToastMessage('Por favor, selecione uma data');
      setToastColor('danger');
      setShowToast(true);
      return false;
    }

    if (!formData.horario) {
      setToastMessage('Por favor, selecione um horário');
      setToastColor('danger');
      setShowToast(true);
      return false;
    }

    if (!formData.endereco || !formData.numero || !formData.cidade || !formData.estado) {
      setToastMessage('Por favor, preencha todos os campos de endereço');
      setToastColor('danger');
      setShowToast(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // Simula envio da solicitação
      await new Promise(resolve => setTimeout(resolve, 1500));

      setToastMessage('Solicitação de coleta enviada com sucesso!');
      setToastColor('success');
      setShowToast(true);

      setTimeout(() => {
        history.replace('/app/gerador-home');
      }, 2000);
    } catch (error) {
      setToastMessage('Erro ao enviar solicitação. Tente novamente.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
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
            Solicitar Coleta
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
        <div style={{ paddingBottom: '100px' }}>
          {/* Volume de Óleo */}
          <div style={{ marginBottom: '25px' }}>
            <h2
              style={{
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              Quantidade de Óleo
            </h2>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Volume de óleo (litros) *
                  </IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Ex: 15"
                    value={formData.volume}
                    onIonInput={(e) => handleInputChange('volume', e.detail.value!)}
                    style={{
                      '--background': '#f5f5f5',
                      '--padding-start': '15px',
                      '--padding-end': '15px',
                      'borderRadius': '8px',
                      'marginTop': '5px'
                    }}
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Data e Horário */}
          <div style={{ marginBottom: '25px' }}>
            <h2
              style={{
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              Preferência de Coleta
            </h2>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <IonItem lines="none" style={{ '--padding-start': '0' }}>
                    <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      Data preferencial *
                    </IonLabel>
                    <IonInput
                      type="date"
                      value={formData.data}
                      onIonInput={(e) => handleInputChange('data', e.detail.value!)}
                      style={{
                        '--background': '#f5f5f5',
                        '--padding-start': '15px',
                        '--padding-end': '15px',
                        'borderRadius': '8px',
                        'marginTop': '5px'
                      }}
                    />
                  </IonItem>
                </div>

                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Horário preferencial *
                  </IonLabel>
                  <select
                    value={formData.horario}
                    onChange={(e) => handleInputChange('horario', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#f5f5f5',
                      fontSize: '1rem',
                      marginTop: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Selecione um horário</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Endereço */}
          <div style={{ marginBottom: '25px' }}>
            <h2
              style={{
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              Local de Coleta
            </h2>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <IonItem lines="none" style={{ '--padding-start': '0' }}>
                    <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      Rua/Avenida *
                    </IonLabel>
                    <IonInput
                      type="text"
                      placeholder="Ex: Rua das Flores"
                      value={formData.endereco}
                      onIonInput={(e) => handleInputChange('endereco', e.detail.value!)}
                      style={{
                        '--background': '#f5f5f5',
                        '--padding-start': '15px',
                        '--padding-end': '15px',
                        'borderRadius': '8px',
                        'marginTop': '5px'
                      }}
                    />
                  </IonItem>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: '1' }}>
                    <IonItem lines="none" style={{ '--padding-start': '0' }}>
                      <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Nº *
                      </IonLabel>
                      <IonInput
                        type="text"
                        placeholder="123"
                        value={formData.numero}
                        onIonInput={(e) => handleInputChange('numero', e.detail.value!)}
                        style={{
                          '--background': '#f5f5f5',
                          '--padding-start': '15px',
                          '--padding-end': '15px',
                          'borderRadius': '8px',
                          'marginTop': '5px'
                        }}
                      />
                    </IonItem>
                  </div>

                  <div style={{ flex: '1' }}>
                    <IonItem lines="none" style={{ '--padding-start': '0' }}>
                      <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Complemento
                      </IonLabel>
                      <IonInput
                        type="text"
                        placeholder="Apto 45"
                        value={formData.complemento}
                        onIonInput={(e) => handleInputChange('complemento', e.detail.value!)}
                        style={{
                          '--background': '#f5f5f5',
                          '--padding-start': '15px',
                          '--padding-end': '15px',
                          'borderRadius': '8px',
                          'marginTop': '5px'
                        }}
                      />
                    </IonItem>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div style={{ flex: '1' }}>
                    <IonItem lines="none" style={{ '--padding-start': '0' }}>
                      <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Bairro
                      </IonLabel>
                      <IonInput
                        type="text"
                        placeholder="Centro"
                        value={formData.bairro}
                        onIonInput={(e) => handleInputChange('bairro', e.detail.value!)}
                        style={{
                          '--background': '#f5f5f5',
                          '--padding-start': '15px',
                          '--padding-end': '15px',
                          'borderRadius': '8px',
                          'marginTop': '5px'
                        }}
                      />
                    </IonItem>
                  </div>

                  <div style={{ flex: '1' }}>
                    <IonItem lines="none" style={{ '--padding-start': '0' }}>
                      <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Cidade *
                      </IonLabel>
                      <IonInput
                        type="text"
                        placeholder="São Paulo"
                        value={formData.cidade}
                        onIonInput={(e) => handleInputChange('cidade', e.detail.value!)}
                        style={{
                          '--background': '#f5f5f5',
                          '--padding-start': '15px',
                          '--padding-end': '15px',
                          'borderRadius': '8px',
                          'marginTop': '5px'
                        }}
                      />
                    </IonItem>
                  </div>
                </div>

                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Estado *
                  </IonLabel>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#f5f5f5',
                      fontSize: '1rem',
                      marginTop: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Selecione um estado</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="BA">BA</option>
                    <option value="RS">RS</option>
                  </select>
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Observações */}
          <div style={{ marginBottom: '25px' }}>
            <h2
              style={{
                color: '#333',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              Observações
            </h2>

            <IonCard
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                margin: '0'
              }}
            >
              <IonCardContent style={{ padding: '20px' }}>
                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Informações adicionais (opcional)
                  </IonLabel>
                  <IonTextarea
                    placeholder="Ex: Óleo está em galão de 20L"
                    value={formData.observacoes}
                    onIonInput={(e) => handleInputChange('observacoes', e.detail.value!)}
                    rows={4}
                    style={{
                      '--background': '#f5f5f5',
                      '--padding-start': '15px',
                      '--padding-end': '15px',
                      'borderRadius': '8px',
                      'marginTop': '5px'
                    }}
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <IonButton
              expand="block"
              fill="outline"
              style={{
                '--border-color': '#999',
                '--color': '#999',
                '--border-radius': '10px',
                flex: '1'
              }}
              onClick={() => history.goBack()}
              disabled={loading}
            >
              Cancelar
            </IonButton>
            <IonButton
              expand="block"
              style={{
                '--background': styles.primaryGreen,
                '--border-radius': '10px',
                flex: '1'
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Solicitar Coleta'}
            </IonButton>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
      <GeradorNavBar />
    </IonPage>
  );
};

export default GeradorSolicitarColetaPage;

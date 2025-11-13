import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonIcon,
  IonText,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButtons,
  IonBackButton,
  IonProgressBar
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

const SignupPersonalInfo: React.FC = () => {
  const history = useHistory();
  
  // Estado do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  
  // Estado de validação e UI
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Verifica se há dados da etapa anterior
  useEffect(() => {
    const cadastroTemp = sessionStorage.getItem('cadastro_temp');
    if (!cadastroTemp) {
      history.replace('/app/signup');
    }
  }, [history]);

  // Formatar CPF
  const formatCPF = (value: string): string => {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  // Formatar Telefone
  const formatTelefone = (value: string): string => {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  // Validar CPF
  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  // Validar Telefone
  const validateTelefone = (telefone: string): boolean => {
    const cleaned = telefone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!nome.trim()) {
      newErrors.nome = 'Por favor, digite o seu nome';
    } else if (nome.trim().split(' ').length < 2) {
      newErrors.nome = 'Por favor, digite o nome completo';
    }

    if (!cpf) {
      newErrors.cpf = 'Por favor, digite um CPF válido';
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!telefone) {
      newErrors.telefone = 'Por favor, digite um telefone válido';
    } else if (!validateTelefone(telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!dataConsent) {
      newErrors.consent = 'Você deve concordar em fornecer seus dados pessoais';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler de submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Recupera dados da etapa anterior
      const cadastroTemp = JSON.parse(sessionStorage.getItem('cadastro_temp') || '{}');
      
      // Adiciona novos dados
      const cadastroCompleto = {
        ...cadastroTemp,
        nome,
        cpf: cpf.replace(/\D/g, ''),
        telefone: telefone.replace(/\D/g, ''),
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('cadastro_temp', JSON.stringify(cadastroCompleto));
      
      // Navega para próxima página
      history.push('/app/address');
      
    } catch (error) {
      setToastMessage('Erro ao processar dados. Tente novamente.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/signup" icon={arrowBack} text="" style={{ color: '#fff' }} />
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>
            Dados Pessoais
          </IonTitle>
        </IonToolbar>
        <IonProgressBar value={0.5} style={{ '--background': '#ddd', '--progress-background': styles.secondaryYellow }} />
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px 0' }}>
          
          {/* Título */}
          <div style={{ marginBottom: '25px' }}>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: 'bold', 
              color: styles.primaryGreen,
              marginBottom: '8px' 
            }}>
              Primeiros passos
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#666' }}>
              Preencha seus dados pessoais para continuar
            </p>
          </div>

          {/* Formulário */}
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '15px', 
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}>
            
            {/* Nome Completo */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Nome Completo *
              </IonLabel>
              <IonInput
                type="text"
                placeholder="Digite seu nome completo"
                value={nome}
                onIonInput={(e) => setNome(e.detail.value!)}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px'
                }}
              />
            </IonItem>
            {errors.nome && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.nome}
              </IonText>
            )}

            {/* CPF */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                CPF *
              </IonLabel>
              <IonInput
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                maxlength={14}
                onIonInput={(e) => setCpf(formatCPF(e.detail.value!))}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px'
                }}
              />
            </IonItem>
            {errors.cpf && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.cpf}
              </IonText>
            )}

            {/* Telefone */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Telefone *
              </IonLabel>
              <IonInput
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                maxlength={15}
                onIonInput={(e) => setTelefone(formatTelefone(e.detail.value!))}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px'
                }}
              />
            </IonItem>
            {errors.telefone && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.telefone}
              </IonText>
            )}

            {/* Checkbox Consentimento */}
            <IonItem lines="none" style={{ '--padding-start': '0', marginBottom: '10px', marginTop: '10px' }}>
              <IonCheckbox
                checked={dataConsent}
                onIonChange={(e) => setDataConsent(e.detail.checked)}
                slot="start"
                style={{ '--background': '#f5f5f5', marginRight: '10px' }}
              />
              <IonLabel style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                Concordo em fornecer meus dados pessoais para o processo de cadastro na Ecoleta
              </IonLabel>
            </IonItem>
            {errors.consent && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '15px' }}>
                {errors.consent}
              </IonText>
            )}

            {/* Botões */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '25px' 
            }}>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => history.goBack()}
                style={{
                  '--border-color': styles.primaryGreen,
                  '--color': styles.primaryGreen,
                  '--border-radius': '10px',
                  'flex': '1',
                  'fontWeight': 'bold',
                  'textTransform': 'none'
                }}
              >
                Voltar
              </IonButton>
              
              <IonButton
                expand="block"
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  '--background': styles.primaryGreen,
                  '--border-radius': '10px',
                  'flex': '1',
                  'fontWeight': 'bold',
                  'textTransform': 'none'
                }}
              >
                {isLoading ? <IonSpinner name="dots" /> : 'Continuar'}
              </IonButton>
            </div>

            {/* Texto Privacidade */}
            <IonText style={{ 
              display: 'block', 
              textAlign: 'center', 
              fontSize: '0.8rem', 
              color: '#666',
              marginTop: '20px',
              lineHeight: '1.4'
            }}>
              Seus dados estão protegidos conforme nossa{' '}
              <a href="#" style={{ color: styles.primaryGreen }}>Política de Privacidade</a>.
            </IonText>
          </div>
        </div>

        {/* Toast de Feedback */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default SignupPersonalInfo;
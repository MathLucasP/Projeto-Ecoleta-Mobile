import React, { useState } from 'react';
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
  IonBackButton
} from '@ionic/react';
import { eyeOutline, eyeOffOutline, arrowBack } from 'ionicons/icons';

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

const SignUpPage: React.FC = () => {
  const history = useHistory();
  
  // Estado do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Estado de validação e UI
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de senha
  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!email) {
      newErrors.email = 'Digite um email válido.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Formato de email inválido.';
    }

    if (!senha) {
      newErrors.senha = 'Digite uma senha.';
    } else if (!validatePassword(senha)) {
      newErrors.senha = 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.';
    }

    if (!confirmarSenha) {
      newErrors.confirmarSenha = 'Por favor, confirme sua senha.';
    } else if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem.';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os Termos de Uso.';
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
      // Simula chamada de API para verificar email
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aqui você faria a verificação real no backend
      // Por enquanto, simula sucesso
      
      // Salva dados na sessão/localStorage temporário
      const cadastroData = {
        email,
        senha,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('cadastro_temp', JSON.stringify(cadastroData));
      
      // Navega para próxima página
      history.push('/app/personal-info');
      
    } catch (error) {
      setToastMessage('Erro ao processar cadastro. Tente novamente.');
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
            <IonBackButton defaultHref="/app/home" icon={arrowBack} text="" style={{ color: '#fff' }} />
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>
            Cadastro de Gerador
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px 0' }}>
          
          {/* Título e Subtítulo */}
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              color: styles.primaryGreen,
              marginBottom: '10px' 
            }}>
              Torne-se um Gerador
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              color: '#666',
              marginBottom: '10px' 
            }}>
              Torne a coleta de óleo uma conveniência na sua rotina
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: styles.secondaryYellow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="30" height="30" fill="white">
                  <path d="M5.68623 0H10.3138L12.178 3.27835L13.9282 2.26789L14.4282 3.13392L13.3301 7.232L9.23203 6.13392L8.73203 5.26789L10.4459 4.27837L9.15033 2L6.84966 2L6.29552 2.97447L4.56343 1.97445L5.68623 0Z" />
                  <path d="M13.1649 9.05964L13.7039 10.0076L12.6055 12H9.99998L9.99998 9.99995H8.99998L5.99998 12.9999L8.99998 15.9999H9.99998L9.99998 14H13.7868L15.996 9.99242L14.8969 8.05962L13.1649 9.05964Z" />
                  <path d="M3.39445 12H4.49998V14H2.21325L0.00390625 9.99242L1.8446 6.75554L0.0717772 5.732L0.571776 4.86598L4.66986 3.7679L5.76793 7.86598L5.26793 8.732L3.57669 7.75556L2.29605 10.0076L3.39445 12Z" />
                </svg>
              </div>
              <IonText style={{ fontSize: '0.9rem', color: '#666' }}>
                E ajude sua região
              </IonText>
            </div>
          </div>

          {/* Formulário */}
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '15px', 
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}>
            
            {/* Email */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                E-mail *
              </IonLabel>
              <IonInput
                type="email"
                placeholder="Digite seu melhor email para contato"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px'
                }}
              />
            </IonItem>
            {errors.email && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.email}
              </IonText>
            )}

            {/* Senha */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Senha *
              </IonLabel>
              <div style={{ position: 'relative', width: '100%' }}>
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Insira a sua melhor senha"
                  value={senha}
                  onIonInput={(e) => setSenha(e.detail.value!)}
                  style={{
                    '--background': '#f5f5f5',
                    '--padding-start': '15px',
                    '--padding-end': '45px',
                    'borderRadius': '8px',
                    'marginTop': '5px'
                  }}
                />
                <IonButton
                  fill="clear"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    '--color': '#666'
                  }}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </div>
            </IonItem>
            {errors.senha && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.senha}
              </IonText>
            )}

            {/* Confirmar Senha */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Confirmar Senha *
              </IonLabel>
              <div style={{ position: 'relative', width: '100%' }}>
                <IonInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onIonInput={(e) => setConfirmarSenha(e.detail.value!)}
                  style={{
                    '--background': '#f5f5f5',
                    '--padding-start': '15px',
                    '--padding-end': '45px',
                    'borderRadius': '8px',
                    'marginTop': '5px'
                  }}
                />
                <IonButton
                  fill="clear"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    '--color': '#666'
                  }}
                >
                  <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                </IonButton>
              </div>
            </IonItem>
            {errors.confirmarSenha && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.confirmarSenha}
              </IonText>
            )}

            {/* Checkbox Termos */}
            <IonItem lines="none" style={{ '--padding-start': '0', marginBottom: '10px' }}>
              <IonCheckbox
                checked={acceptTerms}
                onIonChange={(e) => setAcceptTerms(e.detail.checked)}
                slot="start"
                style={{ '--background': '#f5f5f5', marginRight: '10px' }}
              />
              <IonLabel style={{ fontSize: '0.9rem', color: '#666' }}>
                Aceito os <a href="#" style={{ color: styles.primaryGreen, textDecoration: 'underline' }}>Termos de Uso</a> e condições da Ecoleta
              </IonLabel>
            </IonItem>
            {errors.terms && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '15px' }}>
                {errors.terms}
              </IonText>
            )}

            {/* Botão Cadastrar */}
            <IonButton
              expand="block"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                '--background': styles.primaryGreen,
                '--border-radius': '10px',
                'marginTop': '20px',
                'fontWeight': 'bold',
                'textTransform': 'none',
                'fontSize': '1rem'
              }}
            >
              {isLoading ? <IonSpinner name="dots" /> : 'Cadastrar agora'}
            </IonButton>

            {/* Texto Privacidade */}
            <IonText style={{ 
              display: 'block', 
              textAlign: 'center', 
              fontSize: '0.8rem', 
              color: '#666',
              marginTop: '15px',
              lineHeight: '1.4'
            }}>
              Ao continuar, você concorda em receber comunicações da Ecoleta.
              Confira nossa <a href="#" style={{ color: styles.primaryGreen }}>Declaração de Privacidade</a>.
            </IonText>

            {/* Link para Login */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #eee' 
            }}>
              <IonText style={{ color: '#666', fontSize: '0.9rem' }}>
                Já tem uma conta?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/app/home');
                  }}
                  style={{ 
                    color: styles.primaryGreen, 
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Fazer Login
                </a>
              </IonText>
            </div>
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

export default SignUpPage;
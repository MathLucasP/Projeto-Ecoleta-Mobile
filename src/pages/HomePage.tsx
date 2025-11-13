import React, { useState } from 'react';
import logo from '../assets/icon/logo.png';
import { useHistory } from 'react-router-dom';

import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonAvatar,
  IonItem,
  IonLabel,
  IonCard,
  IonText,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  IonModal,
  IonInput,
  IonToast, 
  IonSpinner,
  setupIonicReact
} from '@ionic/react';

import {
  menu,
  locationOutline,
  mapOutline,
  star,
  arrowForwardOutline,
  closeOutline
} from 'ionicons/icons';

import { Coletor, mockColetores } from '../data/mockData';

setupIonicReact();

interface ColetorCardProps {
  coletor: Coletor;
  onNavigate: (id: number) => void;
}

interface CEPAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: "#F5F5DC",
  secondaryYellow: '#D2A03C',
  secondaryGreen: '#387E5E',
  starGold: '#FFC700',
  locationInput: {
    '--background': '#ffffff',
    '--border-radius': '10px',
    '--box-shadow': '0 4px 12px rgba(0, 0, 0, 0.1)',
    'margin': '20px 0',
    'padding': '8px 10px',
    'fontSize': '1rem'
  },
  mainText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1.4rem',
    marginBottom: '8px',
  },
  subText: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '30px',
  },
  horizontalScroll: {
    display: 'flex',
    overflowX: 'auto' as const,
    paddingBottom: '10px',
    gap: '15px',
  },
  activeHomeIcon: {
    fontSize: '2rem',
    color: '#387E5E',
    padding: '5px',
    borderRadius: '50%',
    border: '2px solid #387E5E'
  }
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const starsArray = [];

  for (let i = 0; i < 5; i++) {
    starsArray.push(
      <IonIcon
        key={i}
        icon={star}
        style={{
          color: i < fullStars ? styles.starGold : '#ccc',
          fontSize: '14px',
          marginRight: '2px'
        }}
      />
    );
  }
  return <div style={{ display: 'flex' }}>{starsArray}</div>;
};

const ColetorCard: React.FC<ColetorCardProps> = ({ coletor, onNavigate }) => {
  const yearsAffiliated = new Date().getFullYear() - coletor.afiliacaoDesde;

  return (
    <IonCard 
      style={{ 
        minWidth: '220px', 
        borderRadius: '15px', 
        margin: '0', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
        cursor: 'pointer'
      }}
      onClick={() => onNavigate(coletor.id)}
    >
      <IonCardContent style={{ padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <IonAvatar style={{ width: '40px', height: '40px', marginRight: '10px' }}>
            <img
              src={`https://placehold.co/40x40/${styles.primaryGreen.substring(1)}/${styles.secondaryYellow.substring(1)}?text=${coletor.nome.charAt(0)}`}
              alt={`Avatar de ${coletor.nome}`}
            />
          </IonAvatar>
          <IonLabel>
            <h3 style={{ fontWeight: 'bold', fontSize: '1rem', color: styles.primaryGreen }}>{coletor.nome}</h3>
            <p style={{ fontSize: '0.75rem', color: '#888' }}>
              Desde {coletor.afiliacaoDesde} ({yearsAffiliated} anos)
            </p>
          </IonLabel>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <IonIcon icon={star} style={{ color: styles.secondaryYellow, fontSize: '1.2rem' }} />
            <IonText style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>
              {coletor.avaliacao.toFixed(1)}
            </IonText>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IonText style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: styles.primaryGreen }}>
              {coletor.totalColetas}
            </IonText>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>Coletas</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IonText style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: styles.primaryGreen, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {coletor.especialidade.split(' ')[0]}...
            </IonText>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>Especialidade</p>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

interface LoginModalContentProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModalContent: React.FC<LoginModalContentProps> = ({ onClose, onLoginSuccess }) => {
    const history = useHistory(); // Hook adicionado aqui dentro do componente
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

    const handleLogin = async () => {
        if (!email || !password) {
            setToastMessage('Por favor, preencha todos os campos.');
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    senha: password
                })
            });

            let resultado: any = null;
            try {
                const text = await response.text();
                if (text) {
                    resultado = JSON.parse(text);
                }
            } catch (parseError) {
                console.warn('Failed to parse JSON response:', parseError);
            }

            if (!response.ok) {
                const msg = resultado?.message || `Erro ao fazer login (status ${response.status})`;
                throw new Error(msg);
            }

            if (resultado && resultado.success === false) {
                throw new Error(resultado.message || 'Erro ao fazer login');
            }

            // Login bem-sucedido
            console.log('Login realizado:', resultado?.data);
            
            // Salva os dados do usuário no localStorage
            if (resultado?.data) {
                localStorage.setItem('usuario', JSON.stringify(resultado.data));
                localStorage.setItem('isLoggedIn', 'true');
            }

            setToastMessage('Login realizado com sucesso!');
            setToastColor('success');
            setShowToast(true);
            
            // Aguarda toast e callback
            setTimeout(() => {
                onLoginSuccess();
                onClose();
            }, 1500);

        } catch (error: any) {
            console.error('Erro no login:', error);
            setToastMessage(error.message || 'Erro ao fazer login. Tente novamente.');
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ color: styles.primaryGreen, fontWeight: 'bold' }}>
                        Acessar Conta
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} fill="clear">
                            <IonIcon icon={closeOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" fullscreen>
                <div style={{ padding: '20px 0' }}>
                    
                    <IonInput 
                        label="E-mail" 
                        type="email" 
                        fill="outline" 
                        labelPlacement="stacked"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value!)}
                        style={{ marginBottom: '15px' }} 
                    />
                    <IonInput 
                        label="Senha" 
                        type="password" 
                        fill="outline" 
                        labelPlacement="stacked"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value!)}
                        style={{ marginBottom: '25px' }} 
                    />
                    
                    <IonButton 
                        expand="block" 
                        onClick={handleLogin}
                        disabled={isLoading}
                        style={{ '--background': styles.primaryGreen }}
                    >
                        {isLoading ? <IonSpinner name="dots" /> : 'Acessar Plataforma'}
                    </IonButton>

                    <IonButton 
                       onClick={() => {
                           onClose();
                           history.push('/app/signup');
                       }} 
                       size="small"
                       fill="outline"
                       expand="block"
                       style={{ 
                           '--border-color': styles.primaryGreen,
                           '--color': styles.primaryGreen,
                           '--border-radius': '20px',
                           textTransform: 'none',
                           marginTop: '10px'
                       }}
                   >
                       Não tenho conta. Criar Conta
                   </IonButton>
                </div>
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

const HomePage: React.FC = () => {
  const [cep, setCep] = React.useState('');
  const [address, setAddress] = React.useState<CEPAddress | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Verifica se o usuário está logado no localStorage
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const history = useHistory(); 
  
  const navigateToColetorProfile = (id: number) => {
    history.push(`/app/coletor/${id}`);
  };

  const formatCep = (value: string) => {
    value = value.replace(/\D/g, ''); 
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };
  
  const searchCep = async (inputCep: string) => {
    setLoading(true);
    setError(null);
    setAddress(null);

    const cleanCep = inputCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
        setLoading(false);
        return;
    }
    
    try {
        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            attempts++;
            const apiUrl = `https://viacep.com.br/ws/${cleanCep}/json/`;

            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data: CEPAddress = await response.json();
                setLoading(false);

                if (data.erro) {
                    setError('CEP não encontrado ou inválido.');
                    setAddress(null);
                } else {
                    setAddress(data);
                }
                return; 
            } else {
                if (attempts < maxAttempts) {
                    const delay = Math.pow(2, attempts) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw new Error('Falha ao buscar o CEP após várias tentativas. Verifique sua conexão.');
                }
            }
        }
    } catch (fetchError) {
        setLoading(false);
        setError("Erro de rede. Não foi possível conectar ao serviço de CEP.");
        setAddress(null);
        console.error("Erro na comunicação com a API ViaCEP:", fetchError);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCep(rawValue);
    setCep(formattedValue);
    
    if (formattedValue.replace(/\D/g, '').length === 8) {
      searchCep(formattedValue);
    } else {
      setAddress(null);
      setError(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.secondaryGreen, '--padding': '8px 16px', '--min-height': '56px' }}>
          <IonButtons slot="start">
            <IonMenuButton>
              <IonIcon icon={menu} style={{ color: styles.primaryGreen }} />
            </IonMenuButton>
          </IonButtons>

          <div slot="secondary" style={{
            textAlign: 'center',
            flexGrow: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            border: `2px solid ${styles.primaryGreen}`,
            borderRadius: '20px',
            padding: '2px 12px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            color: styles.primaryGreen,
            backgroundColor: styles.primaryCream
          }}>
            HOME
          </div>

          <div slot="end" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLoggedIn ? (
                <>
                    <IonButton
                        onClick={() => history.push('/app/gerador-home')}
                        fill="clear"
                        style={{ padding: '0', '--min-height': '40px' }}
                    >
                        <IonAvatar style={{ cursor: 'pointer', width: '32px', height: '32px' }}>
                            <img src="https://i.pravatar.cc/150?img=1" alt="Usuário" />
                        </IonAvatar>
                    </IonButton>
                    <IonButton
                        onClick={() => {
                            localStorage.removeItem('usuario');
                            localStorage.removeItem('isLoggedIn');
                            setIsLoggedIn(false);
                        }}
                        size="small"
                        fill="outline"
                        style={{
                            '--border-color': '#fff',
                            '--color': '#fff',
                            '--border-radius': '20px',
                            textTransform: 'none',
                            '--padding-start': '12px',
                            '--padding-end': '12px',
                            '--min-height': '32px',
                            fontSize: '0.8rem'
                        }}
                    >
                        Sair
                    </IonButton>
                </>
            ) : (
                <IonButton 
                    onClick={() => setShowLoginModal(true)} 
                    size="small"
                    style={{ 
                        '--background': styles.primaryGreen,
                        '--border-radius': '20px',
                        textTransform: 'none',
                        '--padding-start': '12px',
                        '--padding-end': '12px',
                        '--min-height': '32px',
                        fontSize: '0.8rem'
                    }}
                >
                    Entrar
                </IonButton>
            )}
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        <div style={{ padding: '0 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
            <img src={logo} alt="Logo" />
          </div>
          
          <h1 style={styles.mainText}>Recicle e facilite seu dia a dia</h1>
          <p style={styles.subText}>A rapidez que você precisa está aqui!</p>

          <IonItem lines="none" style={styles.locationInput}>
            <IonIcon icon={locationOutline} slot="start" style={{ color: styles.primaryGreen }} />
            <IonLabel position="stacked">Local de Retirada (CEP)</IonLabel>
            <input
                type="text"
                placeholder="Insira seu CEP (ex: 01001-000)"
                maxLength={9}
                value={cep}
                onChange={handleCepChange}
                style={{
                    width: '100%',
                    padding: '5px 0',
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                }}
            />

            <IonIcon 
                icon={loading ? star : mapOutline} 
                slot="end" 
                style={{ color: loading ? styles.primaryGreen : '#aaa', animation: loading ? 'spin 1s infinite linear' : 'none' }} 
            />

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
          </IonItem>
          
          {(address || error) && (
              <IonCard style={{ margin: '10px 0', padding: '10px', backgroundColor: error ? '#fff0f0' : '#f0fff0', borderRadius: '8px', border: error ? '1px solid #c0392b' : '1px solid #387E5E', boxShadow: 'none' }}>
                  {error ? (
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#c0392b' }}>Erro: {error}</p>
                  ) : address && (
                    <>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: styles.primaryGreen }}>Localização Encontrada:</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                            {address.logradouro} - {address.bairro} ({address.localidade}/{address.uf})
                        </p>
                    </>
                  )}
              </IonCard>
          )}

          <IonGrid style={{ padding: 0, marginTop: '20px' }}>
            <IonRow className="ion-justify-content-between">
              <IonCol size="6" style={{ paddingRight: '5px' }}>
                <IonCard style={{ '--background': styles.primaryGreen, color: '#fff', borderRadius: '10px', margin: 0 }}>
                  <IonCardContent style={{ padding: '20px 15px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' }}>ECOPONTOS</h2>
                    <IonButton
                      expand="full"
                      fill="clear"
                      style={{
                        '--background': 'rgba(255, 255, 255, 0.15)',
                        '--color': '#fff',
                        '--border-radius': '15px',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Ver opções <IonIcon icon={arrowForwardOutline} slot="end" />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="6" style={{ paddingLeft: '5px' }}>
                <IonCard style={{ '--background': styles.secondaryYellow, color: '#fff', borderRadius: '10px', margin: 0 }}>
                  <IonCardContent style={{ padding: '20px 15px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' }}>COLETORES</h2>
                    <IonButton
                      expand="full"
                      fill="clear"
                      style={{
                        '--background': 'rgba(255, 255, 255, 0.15)',
                        '--color': '#fff',
                        '--border-radius': '15px',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Ver opções <IonIcon icon={arrowForwardOutline} slot="end" />
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '30px 0 15px 0', color: '#333' }}>
            Os Melhores Coletores
          </h2>

           <div style={styles.horizontalScroll}>
            {mockColetores.map((coletor) => (
              <ColetorCard key={coletor.id} coletor={coletor} onNavigate={navigateToColetorProfile} />
            ))}
          </div>
        </div>
      </IonContent>
      
      <IonModal 
          isOpen={showLoginModal} 
          onDidDismiss={() => setShowLoginModal(false)}
          presentingElement={undefined} 
          swipeToClose={true}
      >
          <LoginModalContent 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => setIsLoggedIn(true)} 
          />
      </IonModal>
    </IonPage>
  );
};

export default HomePage;
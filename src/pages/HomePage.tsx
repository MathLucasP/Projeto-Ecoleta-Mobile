import React, { useState } from 'react';
import logo from '../assets/icon/logo.png';
import { useHistory } from 'react-router-dom';
// As importações a seguir são padrão em um projeto Ionic + React.
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
  IonTabBar,
  IonTabButton,
  IonApp,
  IonRouterOutlet,
  IonModal, // 💡 Importante: IonModal
  IonInput, // Para os campos do formulário
  IonToast, // Para exibir mensagens de sucesso/erro
  IonSpinner,
  setupIonicReact
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import {
  personCircle,
  menu,
  locationOutline,
  mapOutline,
  homeOutline,
  peopleOutline,
  cubeOutline,
  star,
  arrowForwardOutline,
  closeOutline
} from 'ionicons/icons';

import { Coletor, mockColetores } from '../data/mockData';

// --- Configuração Inicial do Ionic ---
// Geralmente feito no index.tsx, mas incluído aqui para ser autocontido.
setupIonicReact();

// --- Interfaces TypeScript ---
// Estrutura de dados para um Coletor
interface ColetorCardProps {
  coletor: Coletor;
  onNavigate: (id: number) => void;
}
// Estrutura de dados para o retorno do ViaCEP
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

// --- Cores e Estilos Customizados ---
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

// --- Componente de Avaliação por Estrelas ---
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

// --- Componente Card do Coletor ---
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.'); // Usando alert apenas para debug rápido. Use IonToast em produção.
            return;
        }

        setIsLoading(true);
        // Simulação de chamada de API de Login
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setIsLoading(false);

        // Lógica de autenticação (AQUI VOCÊ INTEGRARÁ COM FIREBASE/BACKEND)
        if (email === 'coletor@exemplo.com' && password === '123456') {
            setShowToast(true);
            onLoginSuccess();
            onClose();
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    };

    const ColetorCard: React.FC<{ coletor: Coletor }> = ({ coletor }) => (
    <IonCard style={{ minWidth: '250px', margin: '0 10px 0 0', boxShadow: 'none', border: '1px solid #eee' }}>
      <IonCardContent style={{ padding: '15px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 5px 0', color: styles.primaryGreen }}>
          {coletor.nome}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Desde {coletor.afiliacaoDesde}
        </p>
        <IonItem lines="none" style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
          <IonIcon icon={star} style={{ color: styles.secondaryYellow, marginRight: '5px' }} />
          <IonLabel style={{ fontSize: '0.9rem', fontWeight: '600' }}>
            {coletor.avaliacao}
          </IonLabel>
          <IonButton fill="clear" size="small" style={{ '--padding-end': '0', '--color': styles.primaryGreen }}>
             Ver Perfil
          </IonButton>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );

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

                    <IonButton expand="block" fill="clear" style={{ marginTop: '10px' }}>
                        Não tenho conta. Criar Cadastro
                    </IonButton>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Login realizado com sucesso!"
                    duration={2000}
                    color="success"
                />
            </IonContent>
        </IonPage>
    );
};

// --- Componente Principal da Página Home (com lógica ViaCEP) ---
const HomePage: React.FC = () => {
  const [cep, setCep] = React.useState('');
  const [address, setAddress] = React.useState<CEPAddress | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  
  // 1. Estado para controlar a abertura do Modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 2. Simulação do estado de autenticação (trocar pelo contexto real depois)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   // ⬅️ NOVO: Chamar o Hook para ter acesso ao objeto de navegação
  const history = useHistory(); 
  
  // ⬅️ CORRIGIDO: Função para navegar para o perfil do coletor. USANDO /app/coletor/:id
  const navigateToColetorProfile = (id: number) => {
    history.push(`/app/coletor/${id}`);
  };

  // Função Simples para formatação de CEP (Masking)
  const formatCep = (value: string) => {
    // Remove tudo que não for dígito
    value = value.replace(/\D/g, ''); 
    // Adiciona o hífen
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };
  
  // Função para buscar o CEP com Backoff Exponencial (Melhor Prática)
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
            // NOTA: A API do ViaCEP não requer chave, então apiKey fica vazia.
            const apiKey = ""; 
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
                return; // Sucesso
            } else {
                // Tentativa falhou. Aguarda com backoff exponencial.
                if (attempts < maxAttempts) {
                    const delay = Math.pow(2, attempts) * 1000; // 2s, 4s, 8s
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
    
    // Tenta buscar o endereço somente se o CEP completo foi digitado
    if (formattedValue.replace(/\D/g, '').
    length === 8) {
      searchCep(formattedValue);
    } else {
      setAddress(null);
      setError(null);
    }
  };


  return (
    <IonPage>
      {/* --- 1. Header (Cabeçalho) --- */}
      <IonHeader>
        <IonToolbar style={{ '--background': styles.secondaryGreen }}>
          {/* Botão de Menu */}
          <IonButtons slot="start">
            <IonMenuButton>
              <IonIcon icon={menu} style={{ color: styles.primaryGreen }} />
            </IonMenuButton>
          </IonButtons>

          {/* Título Centralizado */}
          <div slot="secondary" style={{
            textAlign: 'center',
            flexGrow: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            border: `2px solid ${styles.primaryGreen}`,
            borderRadius: '20px',
            padding: '4px 15px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            color: styles.primaryGreen,
            backgroundColor: styles.primaryCream
          }}>
            HOME
          </div>

          {/* Ícone de Perfil */}
          <div slot="end">
            {isLoggedIn ? (
                <IonAvatar onClick={() => alert('Abrir Perfil')}>
                    {/* Imagem do usuário logado */}
                    <img src="https://i.pravatar.cc/150?img=1" alt="Usuário" />
                </IonAvatar>
            ) : (
                // 3. Botão que abre o Modal de Login
                <IonButton 
                    onClick={() => setShowLoginModal(true)} 
                    size="small"
                    style={{ 
                        '--background': styles.primaryGreen,
                        '--border-radius': '20px',
                        textTransform: 'none'
                    }}
                >
                    Entrar
                </IonButton>
            )}
          </div>
        </IonToolbar>
      </IonHeader>

      {/* --- 2. Content (Conteúdo Principal) --- */}
      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        <div style={{ padding: '0 10px' }}>
          {/* Logo Placeholder (Garrafa e Palmas) */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
            <img src={logo} alt="Logo" />
          </div>

          {/* Texto de Chamada */}
          <h1 style={styles.mainText}>Recicle e facilite seu dia a dia</h1>
          <p style={styles.subText}>A rapidez que você precisa está aqui!</p>

          {/* Campo de Busca de Localização (Input com integração CEP) */}
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
            {/* Ícone de Mapa/Loading */}
            <IonIcon 
                icon={loading ? star : mapOutline} 
                slot="end" 
                style={{ color: loading ? styles.primaryGreen : '#aaa', animation: loading ? 'spin 1s infinite linear' : 'none' }} 
            />
            {/* Adicionando um estilo para a animação de loading, comum em apps mobile */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
          </IonItem>
          
          {/* Exibição do Endereço Encontrado / Erro */}
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


          {/* --- 3. Opções de Navegação (Cards) --- */}
          <IonGrid style={{ padding: 0, marginTop: '20px' }}>
            <IonRow className="ion-justify-content-between">
              {/* Card ECOPONTOS (Verde) */}
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

              {/* Card COLETORES (Amarelo) */}
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

          {/* --- 4. Lista de Melhores Coletores (Horizontal) --- */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '30px 0 15px 0', color: '#333' }}>
            Os Melhores Coletores
          </h2>

           <div style={styles.horizontalScroll}>
            {/* 💡 mockColetores agora vem do arquivo de dados */}
            {mockColetores.map((coletor) => (
              <ColetorCard key={coletor.id} coletor={coletor} onNavigate={navigateToColetorProfile} />
            ))}
          </div>
        </div>
      </IonContent>
      <IonModal 
          isOpen={showLoginModal} 
          onDidDismiss={() => setShowLoginModal(false)}
          // 💡 Para mobile, geralmente usamos 'presentingElement' para tela cheia
          presentingElement={undefined} 
          // Animação de entrada/saída (opcional, mas recomendado para um bom UX)
          swipeToClose={true}
      >
          {/* 6. Conteúdo do Modal: O formulário de Login */}
          <LoginModalContent 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => setIsLoggedIn(true)} // Atualiza o estado da Home
          />
      </IonModal>
    </IonPage>
  );
};

export default HomePage;

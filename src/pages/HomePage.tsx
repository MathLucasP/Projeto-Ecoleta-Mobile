import React from 'react';
import logo from '../assets/icon/logo.png';
// As importações a seguir são padrão em um projeto Ionic + React.
// A falha de resolução é uma limitação do ambiente de execução e não do código em si.
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
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonTabBar,
  IonTabButton,
  IonApp,
  IonRouterOutlet,
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
  arrowForwardOutline
} from 'ionicons/icons';

// --- Configuração Inicial do Ionic ---
// Geralmente feito no index.tsx, mas incluído aqui para ser autocontido.
setupIonicReact();

// --- Interfaces TypeScript ---
// Estrutura de dados para um Coletor
interface Coletor {
  id: number;
  nome: string;
  afiliacaoDesde: number;
  avaliacao: number; // 1 a 5
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

// --- Dados Mockados ---
const mockColetores: Coletor[] = [
  { id: 1, nome: 'Carlos Andrade', afiliacaoDesde: 2020, avaliacao: 4.5 },
  { id: 2, nome: 'Mariana Silva', afiliacaoDesde: 2021, avaliacao: 5 },
  { id: 3, nome: 'EcoService SP', afiliacaoDesde: 2019, avaliacao: 4 },
  { id: 4, nome: 'João Coletas', afiliacaoDesde: 2023, avaliacao: 3.5 },
];

// --- Cores e Estilos Customizados ---
const styles = {
  primaryGreen: '#387E5E',
  secondaryYellow: '#D2A03C',
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
const ColetorCard: React.FC<{ coletor: Coletor }> = ({ coletor }) => (
  <IonCard
    style={{
      minWidth: '180px',
      maxWidth: '180px',
      borderRadius: '10px',
      margin: 0,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}
  >
    <IonCardContent style={{ padding: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <IonAvatar style={{ width: '40px', height: '40px', marginRight: '10px' }}>
          <IonIcon icon={personCircle} style={{ fontSize: '40px', color: '#ccc' }} />
        </IonAvatar>
        <div style={{ flexGrow: 1 }}>
          <p style={{ fontWeight: 'bold', margin: 0, fontSize: '0.95rem' }}>{coletor.nome}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>
            Afiliado desde {coletor.afiliacaoDesde}
          </p>
        </div>
      </div>
      <RatingStars rating={coletor.avaliacao} />
    </IonCardContent>
  </IonCard>
);

// --- Componente Principal da Página Home (com lógica ViaCEP) ---
const HomePage: React.FC = () => {
  const [cep, setCep] = React.useState('');
  const [address, setAddress] = React.useState<CEPAddress | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
    if (formattedValue.replace(/\D/g, '').length === 8) {
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
        <IonToolbar style={{ '--background': 'transparent' }}>
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
            color: styles.primaryGreen
          }}>
            HOME
          </div>

          {/* Ícone de Perfil */}
          <IonButtons slot="end">
            <IonIcon icon={personCircle} style={{ color: styles.primaryGreen, fontSize: '2rem' }} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* --- 2. Content (Conteúdo Principal) --- */}
      <IonContent fullscreen className="ion-padding">
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
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>ECOPONTOS</h2>
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
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>COLETORES</h2>
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
            {mockColetores.map((coletor) => (
              <ColetorCard key={coletor.id} coletor={coletor} />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

// --- Componente Raiz do Aplicativo (Roteador e Tabs) ---
// Este componente engloba a aplicação e define o roteamento global.
const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rotas principais */}
          <Route exact path="/home" component={HomePage} />
          
          {/* Rotas Placeholder para os botões da barra inferior */}
          <Route exact path="/perfil"> <HomePage /> </Route>
          <Route exact path="/mapa"> <HomePage /> </Route>
          <Route exact path="/coleta"> <HomePage /> </Route>

          {/* Rota padrão */}
          <Route exact path="/"> <Redirect to="/home" /> </Route>
        </IonRouterOutlet>

        {/* --- 5. Footer/Tabs (Barra de Navegação Inferior) --- */}
        <IonTabBar slot="bottom" style={{ '--background': '#fff', borderTop: '1px solid #eee' }}>
            
            {/* Botão Perfil */}
            <IonTabButton tab="perfil" href="/perfil">
                <IonIcon icon={peopleOutline} />
            </IonTabButton>

            {/* Botão Home - Estilo ativo fixo para visualização na Home */}
            <IonTabButton tab="home" href="/home">
                <IonIcon icon={homeOutline} style={styles.activeHomeIcon} />
            </IonTabButton>
            
            {/* Botão Mapa */}
            <IonTabButton tab="mapa" href="/mapa">
                <IonIcon icon={mapOutline} />
            </IonTabButton>

            {/* Botão Coleta */}
            <IonTabButton tab="coleta" href="/coleta">
                <IonIcon icon={cubeOutline} />
            </IonTabButton>
        </IonTabBar>

      </IonReactRouter>
    </IonApp>
  );
};
 
export default HomePage;

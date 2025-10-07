import React from 'react';
// ✅ Importamos o useParams para ler o ID da URL
import { useParams, useHistory } from 'react-router-dom'; 
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardContent,
  IonButton,
  setupIonicReact,
  IonChip,
} from '@ionic/react';
import {
  star,
  cubeOutline,
  calendarOutline,
  mailOutline,
  callOutline,
  locateOutline,
} from 'ionicons/icons';

// --- Configuração Inicial do Ionic ---
setupIonicReact();

// --- Estilos Compartilhados ---
const styles = {
  primaryGreen: '#387E5E', // Cor principal do tema (verde)
  lightBeige: '#F5F5DC', // Fundo claro
  secondaryYellow: '#D2A03C', // Cor de destaque (amarelo/terciário)
};

// --- Interfaces TypeScript ---
interface Coletor {
  id: number;
  nome: string;
  afiliacaoDesde: number;
  avaliacao: number; // Média de 1 a 5
  totalColetas: number;
  bio: string;
  telefone: string;
  email: string;
  especialidade: string; // Novo campo para o card local
}

// Mock de dados de coletores (autocontido na página)
const mockColetores: Coletor[] = [
  {
    id: 1,
    nome: 'Carlos Andrade',
    afiliacaoDesde: 2020,
    avaliacao: 4.5,
    totalColetas: 152,
    bio: 'Especializado na coleta de resíduos orgânicos para compostagem e pequenas quantidades de eletrônicos. Atendo a região central.',
    telefone: '(13) 98765-4321',
    email: 'carlos.andrade@coleta.com',
    especialidade: 'Orgânicos e Eletrônicos',
  },
  {
    id: 2,
    nome: 'Mariana Silva',
    afiliacaoDesde: 2021,
    avaliacao: 5.0,
    totalColetas: 310,
    bio: 'Equipe focada em plásticos, vidros e metais. Atendimento em toda a Baixada Santista. Retiradas agendadas via app.',
    telefone: '(13) 99123-4567',
    email: 'mariana.silva@coleta.com',
    especialidade: 'Plástico e Vidro',
  },
  {
    id: 3,
    nome: 'EcoService SP',
    afiliacaoDesde: 2019,
    avaliacao: 4.0,
    totalColetas: 78,
    bio: 'Foco em lixo eletrônico (e-waste). Aceitamos pilhas, baterias e pequenos eletrodomésticos com responsabilidade ambiental.',
    telefone: '(13) 98000-1122',
    email: 'ecoservice@coleta.com',
    especialidade: 'Lixo Eletrônico',
  },
  {
    id: 4,
    nome: 'João Coletas',
    afiliacaoDesde: 2023,
    avaliacao: 3.5,
    totalColetas: 45,
    bio: 'Coletor independente especializado em papelão e embalagens. Atendo bairros residenciais com agendamento prévio.',
    telefone: '(13) 98888-7777',
    email: 'joao.coletas@coleta.com',
    especialidade: 'Papelão e Embalagens',
  },
];

// --- Sub-Componente para o Card de Coletor Local ---
interface MiniCardProps {
  coletor: Coletor;
  onNavigate: (id: number) => void;
}

const MiniColetorCard: React.FC<MiniCardProps> = ({ coletor, onNavigate }) => {
  return (
    <IonCard 
      key={coletor.id} 
      onClick={() => onNavigate(coletor.id)}
      style={{ 
        margin: '10px 0', 
        borderRadius: '15px', 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer'
      }}
    >
      <IonItem lines="none" detail={true} style={{ '--padding-start': '10px', '--inner-padding-end': '10px' }}>
        {/* Avatar */}
        <IonAvatar slot="start" style={{ width: '45px', height: '45px', border: `2px solid ${styles.secondaryYellow}` }}>
          <img
            src={`https://placehold.co/45x45/${styles.secondaryYellow.substring(1)}/${styles.primaryGreen.substring(1)}?text=${coletor.nome.charAt(0)}`}
            alt={`Avatar de ${coletor.nome}`}
            onError={(e: any) => { e.target.src = `https://placehold.co/45x45/${styles.secondaryYellow.substring(1)}/${styles.primaryGreen.substring(1)}?text=U`; }}
          />
        </IonAvatar>

        <IonLabel>
          <h3 style={{ fontWeight: 'bold', color: styles.primaryGreen, fontSize: '1rem' }}>
            {coletor.nome}
          </h3>
          {/* Estrelas de Avaliação */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <IonIcon icon={star} style={{ color: styles.secondaryYellow, marginRight: '3px', fontSize: '0.9rem' }} />
            <IonText style={{ fontSize: '0.9rem', color: '#555' }}>
              {coletor.avaliacao.toFixed(1)} ({coletor.totalColetas})
            </IonText>
          </div>
        </IonLabel>
        
        {/* Chips de Especialidade */}
        <IonChip style={{ 
          backgroundColor: styles.primaryGreen, 
          color: '#fff', 
          fontSize: '0.7rem', 
          fontWeight: '500',
          height: '24px',
          margin: 0
        }}>
          {coletor.especialidade}
        </IonChip>
      </IonItem>
    </IonCard>
  );
};


// --- Componente principal da Página de Perfil ---
const ColetorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory(); // Para navegar para outro perfil

  // Converte o ID da URL (string) para número
  const coletorId = parseInt(id, 10);
  const coletor = mockColetores.find((c) => c.id === coletorId);
  
  // Lista de coletores locais (excluindo o perfil atual)
  const localColetores = mockColetores.filter((c) => c.id !== coletorId);

  // Função de navegação para um novo perfil
  const handleNavigateToColetor = (newId: number) => {
    // Usa replace para que o botão de voltar funcione corretamente (navegação em cadeia)
    history.replace(`/app/coletor/${newId}`);
  };


  if (!coletor) {
    // Página de Erro (manter a lógica de erro)
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{ '--background': styles.primaryGreen }}>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/home" style={{ color: '#fff' }} />
            </IonButtons>
            <IonTitle style={{ color: '#fff' }}>Erro</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center" fullscreen style={{ '--background': styles.lightBeige }}>
          <h2 style={{ marginTop: '50px', color: styles.primaryGreen }}>Coletor Não Encontrado</h2>
          <p style={{ color: '#666' }}>
            O perfil que você está tentando acessar não existe.
          </p>
          <IonButton routerLink="/app/home" style={{ marginTop: '20px', '--background': styles.secondaryYellow, '--color': styles.primaryGreen, fontWeight: 'bold' }}>
            Voltar para Home
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  // Se o coletor foi encontrado, exibe o perfil
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            {/* Botão de voltar que retorna para a página anterior (Home ou Mapa) */}
            <IonBackButton defaultHref="/app/home" style={{ color: '#fff' }} />
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>
            Perfil do Coletor
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': styles.lightBeige }}>
        {/* Seção Principal do Perfil */}
        <div style={{ padding: '30px 20px', backgroundColor: styles.primaryGreen, color: '#fff' }}>
          <div className="ion-text-center">
            {/* Avatar do Coletor - Usando um placeholder simples */}
            <IonAvatar style={{ width: '90px', height: '90px', margin: '0 auto 15px auto', border: `3px solid ${styles.secondaryYellow}` }}>
              <img
                src={`https://placehold.co/90x90/${styles.secondaryYellow.substring(1)}/${styles.primaryGreen.substring(1)}?text=${coletor.nome.charAt(0)}`}
                alt={`Avatar de ${coletor.nome}`}
                onError={(e: any) => { e.target.src = `https://placehold.co/90x90/${styles.secondaryYellow.substring(1)}/${styles.primaryGreen.substring(1)}?text=U`; }}
              />
            </IonAvatar>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0' }}>{coletor.nome}</h1>

            {/* Avaliação */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
              <IonIcon icon={star} style={{ color: styles.secondaryYellow, marginRight: '5px', fontSize: '1.2rem' }} />
              <IonText style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {coletor.avaliacao.toFixed(1)} ({coletor.totalColetas} coletas)
              </IonText>
            </div>
          </div>

          <IonGrid style={{ marginTop: '20px' }}>
            <IonRow>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={calendarOutline} style={{ fontSize: '1.5rem', color: styles.secondaryYellow }} />
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>Desde</p>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{coletor.afiliacaoDesde}</p>
              </IonCol>
              <IonCol size="6" className="ion-text-center">
                <IonIcon icon={cubeOutline} style={{ fontSize: '1.5rem', color: styles.secondaryYellow }} />
                <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>Total Coletas</p>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{coletor.totalColetas}</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* Detalhes e Contato */}
        <div className="ion-padding">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: styles.primaryGreen }}>Sobre o Coletor</h2>
          <p style={{ color: '#555', lineHeight: '1.5', marginBottom: '30px' }}>
            {coletor.bio}
          </p>

          <IonCard style={{ margin: '0', boxShadow: 'none', border: '1px solid #ddd', borderRadius: '15px' }}>
            <IonCardContent style={{ padding: '0' }}>
              <IonItem lines="full">
                <IonIcon icon={mailOutline} slot="start" style={{ color: styles.primaryGreen }} />
                <IonLabel>
                  <p style={{ fontSize: '0.9rem', color: '#777' }}>E-mail</p>
                  <h3 style={{ fontSize: '1rem', fontWeight: '500', color: styles.primaryGreen }}>{coletor.email}</h3>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={callOutline} slot="start" style={{ color: styles.primaryGreen }} />
                <IonLabel>
                  <p style={{ fontSize: '0.9rem', color: '#777' }}>Telefone</p>
                  <h3 style={{ fontSize: '1rem', fontWeight: '500', color: styles.primaryGreen }}>{coletor.telefone}</h3>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>

          <IonButton expand="block" style={{ marginTop: '30px', '--background': styles.secondaryYellow, '--color': styles.primaryGreen, fontWeight: 'bold', '--border-radius': '15px' }}>
            Solicitar Coleta
          </IonButton>
        </div>
        
        {/* --- NOVO: Seção de Coletores Locais --- */}
        {localColetores.length > 0 && (
          <div className="ion-padding" style={{ paddingTop: '0px', paddingBottom: '30px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '30px 0 15px 0', color: styles.primaryGreen, display: 'flex', alignItems: 'center' }}>
                <IonIcon icon={locateOutline} style={{ fontSize: '1.4rem', marginRight: '8px' }}/>
                Coletores Locais Próximos
            </h2>
            
            {/* Renderiza o MiniColetorCard para cada coletor local */}
            {localColetores.map((c) => (
              <MiniColetorCard 
                key={c.id} 
                coletor={c} 
                onNavigate={handleNavigateToColetor} 
              />
            ))}

            <p className="ion-text-center" style={{ fontSize: '0.8rem', color: '#888', marginTop: '20px' }}>
                *Baseado em nossa área de cobertura simulada.
            </p>
          </div>
        )}
        
      </IonContent>
    </IonPage>
  );
};

export default ColetorProfilePage;

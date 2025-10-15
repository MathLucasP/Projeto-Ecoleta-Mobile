import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonAvatar,
  IonItem,
  IonLabel,
  IonText,
  IonCard,
  IonChip,
  IonButtons,
  IonMenuButton,
  setupIonicReact,
} from '@ionic/react';
import { star, locateOutline, menu } from 'ionicons/icons';
// 💡 Importa a interface e os dados mockados de um arquivo central
import { Coletor, mockColetores } from '../data/mockData';

// --- Configuração Inicial do Ionic ---
setupIonicReact();

// --- Estilos Compartilhados ---
const styles = {
  primaryGreen: '#387E5E', // Cor principal do tema (verde)
  secondaryYellow: '#D2A03C', // Cor de destaque (amarelo/terciário)
  lightBeige: '#F5F5DC', // Fundo claro
};

// --- Card de Coletor para a lista principal ---
interface ColetorListCardProps {
  coletor: Coletor;
  onNavigate: (id: number) => void;
}

const ColetorListCard: React.FC<ColetorListCardProps> = ({ coletor, onNavigate }) => {
  return (
    <IonCard 
      key={coletor.id} 
      onClick={() => onNavigate(coletor.id)}
      style={{ 
        margin: '15px 0', 
        borderRadius: '15px', 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        backgroundColor: '#fff'
      }}
    >
      <IonItem lines="none" detail={true} style={{ '--padding-start': '10px', '--inner-padding-end': '10px' }}>
        {/* Avatar */}
        <IonAvatar slot="start" style={{ width: '60px', height: '60px', border: `3px solid ${styles.primaryGreen}` }}>
          <img
            src={`https://placehold.co/60x60/${styles.primaryGreen.substring(1)}/${styles.secondaryYellow.substring(1)}?text=${coletor.nome.charAt(0)}`}
            alt={`Avatar de ${coletor.nome}`}
            onError={(e: any) => { e.target.src = `https://placehold.co/60x60/${styles.primaryGreen.substring(1)}/${styles.secondaryYellow.substring(1)}?text=U`; }}
          />
        </IonAvatar>

        <IonLabel>
          <h3 style={{ fontWeight: 'bold', color: styles.primaryGreen, fontSize: '1.1rem' }}>
            {coletor.nome}
          </h3>
          {/* Estrelas de Avaliação */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <IonIcon icon={star} style={{ color: styles.secondaryYellow, marginRight: '5px', fontSize: '1rem' }} />
            <IonText style={{ fontSize: '0.9rem', color: '#555' }}>
              {coletor.avaliacao.toFixed(1)} ({coletor.totalColetas} coletas)
            </IonText>
          </div>
          {/* Chips de Especialidade */}
          <IonChip style={{ 
            backgroundColor: styles.secondaryYellow, 
            color: styles.primaryGreen, 
            fontSize: '0.75rem', 
            fontWeight: '600',
            height: '28px',
            marginTop: '5px'
          }}>
            {coletor.especialidade}
          </IonChip>
        </IonLabel>
      </IonItem>
    </IonCard>
  );
};


// --- Componente principal da Página de Perfil (Aba) ---
const PerfilPage: React.FC = () => {
  const history = useHistory();

  // Função para navegar para a página de detalhes do coletor
  const handleNavigateToColetor = (id: number) => {
    history.push(`/app/coletor/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            {/* Botão de Menu para o menu lateral (se existir) */}
            <IonMenuButton>
                <IonIcon icon={menu} style={{ color: '#fff' }} />
            </IonMenuButton>
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>
            Coletores Locais
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.lightBeige }}>
        
        {/* Título e ícone de localização */}
        <h1 style={{ 
            fontSize: '1.6rem', 
            fontWeight: 'bold', 
            margin: '10px 0 20px 0', 
            color: styles.primaryGreen, 
            display: 'flex', 
            alignItems: 'center' 
        }}>
            <IonIcon icon={locateOutline} style={{ fontSize: '1.8rem', marginRight: '10px' }}/>
            Coletores Próximos a Você
        </h1>

        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
            Encontre o profissional ou a empresa mais adequada para o seu tipo de resíduo.
        </p>

        {/* Lista de Coletores Locais */}
        <div>
          {/* 💡 mockColetores agora vem do arquivo de dados */}
          {mockColetores.map((c) => (
            <ColetorListCard 
              key={c.id} 
              coletor={c} 
              onNavigate={handleNavigateToColetor} 
            />
          ))}

          {/* Mensagem de rodapé para simulação */}
          <p className="ion-text-center" style={{ fontSize: '0.8rem', color: '#888', marginTop: '30px' }}>
              {mockColetores.length} coletores encontrados na sua região.
          </p>
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default PerfilPage;

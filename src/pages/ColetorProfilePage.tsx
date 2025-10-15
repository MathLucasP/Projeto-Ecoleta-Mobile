import React from 'react';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonAvatar,
  IonItem,
  IonLabel,
  IonText,
  setupIonicReact
} from '@ionic/react';
import { star, callOutline, mailOutline, calendarOutline, locationOutline } from 'ionicons/icons';
// 💡 Importa a interface e o utilitário de busca de um arquivo central
import { Coletor, findColetorById } from '../data/mockData';

// --- Configuração Inicial do Ionic ---
setupIonicReact();

// --- Estilos Compartilhados ---
const styles = {
  primaryGreen: '#387E5E', // Cor principal do tema (verde)
  secondaryYellow: '#D2A03C', // Cor de destaque (amarelo/terciário)
  lightBeige: '#F5F5DC', // Fundo claro
};

// Interface para os parâmetros da URL
interface ColetorProfileParams {
  id: string; // O ID virá como string da URL
}

const ColetorProfilePage: React.FC = () => {
  const { id } = useParams<ColetorProfileParams>();
  const coletorId = parseInt(id, 10);
  
  // Busca os dados usando a função utilitária
  const coletor = findColetorById(coletorId);
  const history = useHistory();

  // Caso o coletor não seja encontrado
  if (!coletor) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{ '--background': styles.primaryGreen }}>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/app/perfil" style={{ '--color': '#fff' }}/>
            </IonButtons>
            <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>Coletor Não Encontrado</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center" style={{ '--background': styles.lightBeige }}>
          <h2 style={{ color: '#C5000F' }}>Erro 404</h2>
          <p>O perfil do coletor com ID: {id} não foi encontrado.</p>
          <IonButton onClick={() => history.replace('/app/perfil')}>
              Voltar para Lista de Coletores
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  // Se o coletor for encontrado, exibe o perfil
  const yearsAffiliated = new Date().getFullYear() - coletor.afiliacaoDesde;

  // 🟢 NOVA FUNÇÃO: Redireciona para a página de agendamento com o ID do coletor na rota
  const handleAgendar = () => {
      history.push(`/app/agendamento/${coletor.id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/perfil" style={{ '--color': '#fff' }}/>
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>
            Perfil do Coletor
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ '--background': styles.lightBeige }}>
        
        {/* --- Card de Cabeçalho do Perfil --- */}
        <IonCard style={{ 
            borderRadius: '0 0 25px 25px', 
            margin: '0', 
            padding: '20px',
            background: `linear-gradient(135deg, ${styles.primaryGreen} 0%, #295F4A 100%)`, 
            color: '#fff',
            textAlign: 'center'
        }}>
            <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto 15px auto', border: `4px solid ${styles.secondaryYellow}` }}>
              <img 
                src={`https://placehold.co/100x100/${styles.secondaryYellow.substring(1)}/${styles.primaryGreen.substring(1)}?text=${coletor.nome.charAt(0)}`}
                alt={`Avatar de ${coletor.nome}`}
              />
            </IonAvatar>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '5px 0' }}>{coletor.nome}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                <IonIcon icon={star} style={{ color: styles.secondaryYellow, marginRight: '5px' }} />
                <IonText style={{ fontSize: '1.1rem', fontWeight: 'bold', color: styles.secondaryYellow }}>
                    {coletor.avaliacao.toFixed(1)} / 5.0
                </IonText>
                <IonText style={{ fontSize: '0.9rem', marginLeft: '10px', opacity: 0.8 }}>
                    ({coletor.totalColetas} coletas concluídas)
                </IonText>
            </div>
            
            <IonButton
                expand="block"
                onClick={handleAgendar}
                style={{
                    '--background': styles.secondaryYellow,
                    '--color': styles.primaryGreen,
                    '--border-radius': '10px',
                    height: '40px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    marginTop: '15px'
                }}
            >
                Agendar Coleta com {coletor.nome.split(' ')[0]}
            </IonButton>
        </IonCard>

        <div className="ion-padding">
            {/* --- Seção de Biografia / Especialidade --- */}
            <IonCard style={{ borderRadius: '15px', margin: '15px 0' }}>
                <IonCardHeader>
                    <IonCardTitle style={{ color: styles.primaryGreen, fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Sobre o Coletor
                    </IonCardTitle>
                    <IonCardSubtitle style={{ color: styles.secondaryYellow, fontWeight: '600' }}>
                        {coletor.especialidade}
                    </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <p style={{ color: '#555', lineHeight: '1.5' }}>
                        {coletor.bio}
                    </p>
                </IonCardContent>
            </IonCard>

            {/* --- Detalhes de Contato e Afiliação --- */}
            <IonCard style={{ borderRadius: '15px', margin: '15px 0' }}>
                <IonItem lines="full">
                    <IonIcon icon={callOutline} slot="start" color="primary" />
                    <IonLabel>
                        <p style={{ color: '#888' }}>Telefone</p>
                        <h3 style={{ color: styles.primaryGreen, fontWeight: 'bold' }}>{coletor.telefone}</h3>
                    </IonLabel>
                </IonItem>
                <IonItem lines="full">
                    <IonIcon icon={mailOutline} slot="start" color="primary" />
                    <IonLabel>
                        <p style={{ color: '#888' }}>E-mail</p>
                        <h3 style={{ color: styles.primaryGreen, fontWeight: 'bold' }}>{coletor.email}</h3>
                    </IonLabel>
                </IonItem>
                <IonItem lines="none">
                    <IonIcon icon={calendarOutline} slot="start" color="primary" />
                    <IonLabel>
                        <p style={{ color: '#888' }}>Afiliado desde</p>
                        <h3 style={{ color: styles.primaryGreen, fontWeight: 'bold' }}>
                            {coletor.afiliacaoDesde} ({yearsAffiliated} anos)
                        </h3>
                    </IonLabel>
                </IonItem>
                <IonItem lines="none">
                    <IonIcon icon={locationOutline} slot="start" color="primary" />
                    <IonLabel>
                        <p style={{ color: '#888' }}>Localização (Simulada)</p>
                        <h3 style={{ color: styles.primaryGreen, fontWeight: 'bold' }}>
                            Lat: {coletor.lat.toFixed(4)}, Lng: {coletor.lng.toFixed(4)}
                        </h3>
                    </IonLabel>
                </IonItem>
            </IonCard>

            <div style={{ height: '30px' }} /> {/* Espaço no final */}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default ColetorProfilePage;

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  useIonToast,
  IonSpinner,
  IonCard,
  IonAvatar,
  IonNote
} from '@ionic/react';
import { menu, locationOutline, calendarOutline, timeOutline, checkmarkCircleOutline, star } from 'ionicons/icons';


interface Coletor {
    id: string;
    nome: string;
    avaliacao: number;
    afiliacaoDesde: number;
    avatarUrl: string;
}

const mockColetores: Coletor[] = [
    { id: '1', nome: 'João - Coleta Express', avaliacao: 4.8, afiliacaoDesde: 2022, avatarUrl: 'https://placehold.co/40x40/223E2A/E2B633?text=J' },
    { id: '2', nome: 'Maria Recicla Fácil', avaliacao: 4.5, afiliacaoDesde: 2021, avatarUrl: 'https://placehold.co/40x40/223E2A/E2B633?text=M' },
    { id: '3', nome: 'Pedro Ambiental', avaliacao: 4.9, afiliacaoDesde: 2023, avatarUrl: 'https://placehold.co/40x40/223E2A/E2B633?text=P' },
];


// Estilos
const styles = {
    primaryGreen: '#387E5E',
    buttonColor: '#E2B633',
    primaryCream: "#F5F5DC", 
    backgroundColor: '#F9F6E8',
};


interface FormData {
  materialType: string;
  description: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  bairro: string; 
  coletorId: string; 
  date: string;
  time: string;
}


interface RouteParams {
    coletorId: string;
}


const ColetorDisplay: React.FC<{ coletor: Coletor }> = ({ coletor }) => (
    <IonCard style={{ marginBottom: '15px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <IonItem lines="none">
            <IonAvatar slot="start">
                <img src={coletor.avatarUrl} alt="Avatar do Coletor" />
            </IonAvatar>
            <IonLabel>
                <h3 style={{ fontWeight: 'bold', color: styles.primaryGreen }}>{coletor.nome}</h3>
                <p>
                    <IonIcon icon={star} style={{ color: styles.buttonColor, fontSize: '0.9rem', marginRight: '3px' }} />
                    {coletor.avaliacao} ({coletor.afiliacaoDesde})
                </p>
            </IonLabel>
        </IonItem>
    </IonCard>
);

const AgendamentoPage: React.FC = () => {
  const history = useHistory();
 
  const { coletorId: routeColetorId } = useParams<RouteParams>();
  const [present] = useIonToast();

  const initialColetorId = routeColetorId || '';
  
  const initialColetor = mockColetores.find(c => c.id === initialColetorId);

  const [formData, setFormData] = useState<FormData>({
    materialType: '',
    description: '',
    cep: '', 
    street: '',
    number: '',
    complement: '',
    bairro: '',
    coletorId: initialColetorId, 
    date: new Date().toISOString(),
    time: new Date().toISOString(),
  });
  
  const [loading, setLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false); 
  const [selectedColetor, setSelectedColetor] = useState<Coletor | undefined>(initialColetor);


  useEffect(() => {
    
    if (!routeColetorId) {
        setSelectedColetor(mockColetores.find(c => c.id === formData.coletorId));
    }
  }, [formData.coletorId, routeColetorId]);


 
  const handleInputChange = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  
  const handleSelectChange = (e: CustomEvent) => {
    setFormData({ ...formData, materialType: e.detail.value });
  };

  
  const handleDateTimeChange = (key: keyof FormData) => (e: CustomEvent) => {
    setFormData({ ...formData, [key]: e.detail.value || '' });
  };

  
  const isValidCep = (cep: string) => /^\d{8}$/.test(cep.replace(/\D/g, ''));
  
  const fetchAddressByCep = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, ''); 
    if (cleanedCep.length !== 8) return;

    setIsCepLoading(true);
    setFormData(prev => ({ ...prev, street: '', bairro: '' }));
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        present({ message: 'CEP não encontrado. Preencha o endereço manualmente.', duration: 3000, color: 'warning' });
      } else {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          bairro: data.bairro || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      present({ message: 'Erro na conexão para buscar o CEP. Tente novamente.', duration: 3000, color: 'danger' });
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleCepBlur = (e: CustomEvent) => {
    const cep = (e.target as HTMLInputElement).value;
    if (cep && isValidCep(cep)) {
        fetchAddressByCep(cep);
    }
  };
  

  
  const handleSchedule = () => {
    if (!formData.materialType || !formData.date || !formData.time || !formData.street || !formData.bairro || !formData.coletorId) {
      present({
        message: 'Por favor, preencha todos os campos obrigatórios (Material, Data, Hora, Endereço e Coletor).',
        duration: 3000,
        color: 'danger'
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
        console.log('Dados do Agendamento:', formData);
        setLoading(false);
        
        present({
          message: `Agendamento Confirmado com ${selectedColetor?.nome}!`,
          duration: 3000,
          color: 'success',
          icon: checkmarkCircleOutline
        });

        
        history.replace('/home'); 

    }, 1500); 
  };

  const addressFieldsDisabled = isCepLoading || loading;
  
  const isColetorFieldDisabled = !!routeColetorId || loading; 


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            <IonMenuButton>
                <IonIcon icon={menu} style={{ color: styles.primaryGreen }} />
            </IonMenuButton>
          </IonButtons>
          <IonTitle style={{ color: styles.primaryCream, fontWeight: 'bold' }}>
            Agendamento de Coleta
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.backgroundColor }}>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '15px 0', color: styles.primaryGreen }}>
            Coletor Selecionado *
        </h3>

        
        {routeColetorId && selectedColetor ? (
            
            <ColetorDisplay coletor={selectedColetor} />
        ) : (
            
            <IonItem style={{ marginBottom: '15px', borderRadius: '10px' }}>
                <IonLabel position="stacked" style={{ color: styles.primaryGreen, fontWeight: '500' }}>Escolher Coletor</IonLabel>
                <IonSelect
                    placeholder="Selecione um Coletor Disponível"
                    value={formData.coletorId}
                    onIonChange={(e) => setFormData({ ...formData, coletorId: e.detail.value })}
                    interfaceOptions={{ header: 'Escolha um Coletor' }}
                    style={{ paddingLeft: 0 }}
                    disabled={isColetorFieldDisabled}
                >
                    {mockColetores.map(coletor => (
                        <IonSelectOption key={coletor.id} value={coletor.id}>
                            {coletor.nome} ({coletor.avaliacao} ★)
                        </IonSelectOption>
                    ))}
                </IonSelect>
                {!formData.coletorId && (
                     <IonNote color="danger" slot="helper" style={{fontSize: '0.75rem'}}>
                        Você deve selecionar um coletor.
                    </IonNote>
                )}
                
                {selectedColetor && <ColetorDisplay coletor={selectedColetor} />}
            </IonItem>
        )}
        
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px', color: styles.primaryGreen }}>
          Detalhes da Sua Coleta
        </h2>

        <IonList lines="full" style={{ background: 'transparent' }}>
          
          
          <IonItem style={{ marginBottom: '10px', borderRadius: '10px' }}>
            <IonLabel position="stacked" style={{ color: styles.primaryGreen, fontWeight: '500' }}>Tipo de Material *</IonLabel>
            <IonSelect
              placeholder="Selecione o tipo de resíduo"
              value={formData.materialType}
              onIonChange={handleSelectChange}
              interfaceOptions={{ header: 'Selecione o Material' }}
              style={{ paddingLeft: 0 }}
              disabled={loading}
            >
              <IonSelectOption value="plastico">Plástico</IonSelectOption>
              <IonSelectOption value="papel">Papel e Papelão</IonSelectOption>
              <IonSelectOption value="vidro">Vidro</IonSelectOption>
              <IonSelectOption value="metal">Metal</IonSelectOption>
              <IonSelectOption value="eletronico">Eletrônico</IonSelectOption>
              <IonSelectOption value="outros">Outros</IonSelectOption>
            </IonSelect>
          </IonItem>

          
          <IonItem style={{ marginBottom: '10px', borderRadius: '10px' }}>
            <IonLabel position="stacked" style={{ color: styles.primaryGreen, fontWeight: '500' }}>Detalhes da Coleta (Descrição e Volume)</IonLabel>
            <IonTextarea
              name="description"
              placeholder="Ex: 5 sacolas grandes de garrafas PET e 2 caixas de papelão"
              rows={3}
              value={formData.description}
              onIonChange={(e) => setFormData({ ...formData, description: e.detail.value || '' })}
              disabled={loading}
            />
          </IonItem>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '30px 0 15px 0', color: styles.primaryGreen }}>
            Endereço de Retirada
          </h3>
          
          
          <IonItem style={{ marginBottom: '10px', borderRadius: '10px' }}>
            <IonIcon icon={locationOutline} slot="start" style={{ color: styles.primaryGreen }} />
            <IonInput 
              label="CEP *" 
              name="cep" 
              value={formData.cep} 
              onIonChange={handleInputChange} 
              onIonBlur={handleCepBlur} 
              placeholder="Ex: 11700-000" 
              type="text"
              inputmode="numeric"
              maxlength={9}
              disabled={loading}
            />
            {isCepLoading && <IonSpinner name="dots" slot="end" />}
          </IonItem>
          
          
          <IonItem style={{ marginBottom: '10px', borderRadius: '10px' }}>
            <IonInput 
              label="Rua/Avenida *" 
              name="street" 
              value={formData.street} 
              onIonChange={handleInputChange} 
              placeholder="Rua/Avenida" 
              disabled={addressFieldsDisabled} 
            />
          </IonItem>
          
          
          <IonItem style={{ marginBottom: '10px', borderRadius: '10px' }}>
            <IonInput 
              label="Bairro *" 
              name="bairro" 
              value={formData.bairro} 
              onIonChange={handleInputChange} 
              placeholder="Bairro ou Comunidade" 
              disabled={addressFieldsDisabled} 
            />
          </IonItem>

          
          <div style={{ display: 'flex', gap: '10px' }}>
            <IonItem style={{ flex: 1, marginBottom: '10px', borderRadius: '10px' }}>
              <IonInput 
                label="Nº" 
                name="number" 
                value={formData.number} 
                onIonChange={handleInputChange} 
                placeholder="123" 
                type="number"
                disabled={loading}
              />
            </IonItem>
            <IonItem style={{ flex: 2, marginBottom: '10px', borderRadius: '10px' }}>
              <IonInput 
                label="Complemento" 
                name="complement" 
                value={formData.complement} 
                onIonChange={handleInputChange} 
                placeholder="Apto 101 / Casa B" 
                disabled={loading}
              />
            </IonItem>
          </div>

          <IonButton 
            expand="block" 
            fill="outline" 
            style={{ 
              '--color': styles.primaryGreen, 
              '--border-color': styles.primaryGreen, 
              '--border-radius': '10px', 
              textTransform: 'none',
              marginTop: '10px',
              height: '40px',
            }}
            onClick={() => present({ message: 'Funcionalidade de Geo-Localização em desenvolvimento!', duration: 2000 })}
            disabled={loading}
          >
            <IonIcon icon={locationOutline} slot="start" />
            Usar Localização Atual
          </IonButton>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '30px 0 15px 0', color: styles.primaryGreen }}>
            Data e Hora Preferenciais
          </h3>
          
          
          <IonItem style={{ marginBottom: '10px', borderRadius: '10px' }}>
            <IonIcon icon={calendarOutline} slot="start" style={{ color: styles.primaryGreen }} />
            <IonLabel>Data da Coleta *</IonLabel>
            <IonDatetimeButton datetime="scheduleDate" />
            <IonModal keepContentsOpen={true} disabled={loading}>
              <IonDatetime
                id="scheduleDate"
                name="date"
                presentation="date"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]} 
                onIonChange={handleDateTimeChange('date')}
              />
            </IonModal>
          </IonItem>

          
          <IonItem style={{ marginBottom: '25px', borderRadius: '10px' }}>
            <IonIcon icon={timeOutline} slot="start" style={{ color: styles.primaryGreen }} />
            <IonLabel>Hora Preferencial *</IonLabel>
            <IonDatetimeButton datetime="scheduleTime" />
            <IonModal keepContentsOpen={true} disabled={loading}>
              <IonDatetime
                id="scheduleTime"
                name="time"
                presentation="time"
                value={formData.time}
                onIonChange={handleDateTimeChange('time')}
              />
            </IonModal>
          </IonItem>

        </IonList>

        
        <IonButton 
          expand="block" 
          onClick={handleSchedule}
          disabled={loading || !formData.materialType || !formData.date || !formData.time || !formData.street || !formData.bairro || !formData.coletorId}
          style={{
            '--background': styles.buttonColor, 
            '--color': styles.primaryGreen, 
            '--border-radius': '10px',
            fontWeight: 'bold',
            height: '50px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading ? (
            <IonSpinner name="dots" style={{ color: styles.primaryGreen }} />
          ) : (
            'Confirmar Agendamento'
          )}
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default AgendamentoPage;

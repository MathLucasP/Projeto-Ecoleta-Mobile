import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonMenuButton,
  setupIonicReact,
  IonLoading,
} from '@ionic/react';
import { menu } from 'ionicons/icons';

// --- Configuração Inicial do Ionic ---
setupIonicReact();

// --- Estilos Compartilhados ---
const styles = {
  primaryGreen: '#387E5E',
  lightBeige: '#F5F5DC',
};

// --- Interfaces TypeScript ---
interface Coletor {
  id: number;
  nome: string;
  lat: number;
  lng: number;
  avaliacao: number;
}

// Mock de dados dos coletores com coordenadas simuladas (Santos/SP)
const mockColetores: Coletor[] = [
  { id: 1, nome: 'Carlos Andrade', lat: -23.9610, lng: -46.3323, avaliacao: 4.5 },
  { id: 2, nome: 'Mariana Silva', lat: -23.9690, lng: -46.3380, avaliacao: 5.0 },
  { id: 3, nome: 'EcoService SP', lat: -23.9450, lng: -46.3300, avaliacao: 4.0 },
  { id: 4, nome: 'João Coletas', lat: -23.9550, lng: -46.3450, avaliacao: 3.5 },
];

// --- Configuração do Google Maps ---
// A chave deve ser fornecida pelo ambiente, mas para este ambiente de simulação, usaremos uma string vazia.
const GOOGLE_MAPS_API_KEY = ""; 
const MAP_ID = "YOUR_MAP_ID_HERE"; // Substitua pelo seu Map ID real, se usar estilos personalizados

// --- 2. Componente da Página de Mapa (Pronto para Google Maps API) ---
const MapPage: React.FC = () => {
  // Referência para o contêiner onde o mapa será desenhado
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ponto central do mapa (simulando a localização do usuário ou centro de Santos/SP)
  const defaultCenter = { lat: -23.9610, lng: -46.3323 }; 
  
  // Função para injetar o script da API do Google Maps
  const loadGoogleMapsScript = () => {
    // Verifica se o script já foi carregado
    if (document.getElementById('google-maps-script')) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      
      // Define a função global que será chamada quando o script carregar
      (window as any).initMap = () => {
        console.log("Script do Google Maps carregado.");
        resolve();
      };
      
      document.head.appendChild(script);
    });
  };

  // Função para inicializar o mapa e adicionar os marcadores
  const initializeMap = async () => {
    // Garante que o contêiner do mapa existe e o Google Maps está carregado
    if (!mapRef.current || typeof google === 'undefined' || !google.maps.Map) {
      console.error("Contêiner do mapa não encontrado ou Google Maps não carregado.");
      setIsLoading(false);
      return;
    }

    try {
        // Opções de inicialização do mapa
        const mapOptions: google.maps.MapOptions = {
            center: defaultCenter,
            zoom: 14, // Zoom padrão para uma vista local
            mapTypeControl: false, // Esconde controle de tipo de mapa (Satélite, Rua)
            streetViewControl: false, // Esconde Street View
            fullscreenControl: false, // Esconde Fullscreen
            zoomControl: true, // Mostra controle de Zoom
            // mapId: MAP_ID, // Descomente e use seu ID se tiver um estilo personalizado
        };

        // Cria a instância do mapa
        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
        
        // Adiciona o marcador de Localização do Usuário (simulado)
        addCenterMarker(newMap, defaultCenter);
        
        // Adiciona os marcadores dos Coletores
        addCollectorMarkers(newMap);

    } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
    } finally {
        setIsLoading(false);
    }
  };

  // Adiciona um marcador para a localização central (usuário)
  const addCenterMarker = (currentMap: google.maps.Map, position: google.maps.LatLngLiteral) => {
    new google.maps.Marker({
        position: position,
        map: currentMap,
        title: "Sua Localização (Simulada)",
        icon: {
            // Ícone azul para o usuário
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40),
        },
    });
  };

  // Adiciona marcadores para cada coletor
  const addCollectorMarkers = (currentMap: google.maps.Map) => {
    mockColetores.forEach(coletor => {
        const marker = new google.maps.Marker({
            position: { lat: coletor.lat, lng: coletor.lng },
            map: currentMap,
            title: coletor.nome,
            icon: {
                // Ícone verde para o coletor
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(40, 40),
            },
        });

        // Adiciona um InfoWindow ao clicar no marcador
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: Inter, sans-serif;">
                    <h3 style="color: ${styles.primaryGreen}; margin-top: 0; font-size: 1.1rem;">${coletor.nome}</h3>
                    <p style="margin: 5px 0;">Avaliação: <b>${coletor.avaliacao.toFixed(1)} ⭐</b></p>
                    <a href="/app/coletor/${coletor.id}" style="color: ${styles.primaryGreen}; text-decoration: none; font-weight: bold;">
                        Ver Perfil Completo
                    </a>
                </div>
            `,
        });

        marker.addListener('click', () => {
            infoWindow.open(currentMap, marker);
        });
    });
  };

  // Efeito principal para carregar o script e inicializar o mapa
  useEffect(() => {
    setIsLoading(true);
    loadGoogleMapsScript()
      .then(() => {
        // Timeout para garantir que o DOM esteja pronto e o callback do script tenha sido executado
        setTimeout(initializeMap, 100); 
      })
      .catch(error => {
        console.error("Falha ao carregar script do Google Maps.", error);
        setIsLoading(false);
      });
  }, []); // Executa apenas na montagem

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            <IonMenuButton>
                <IonIcon icon={menu} style={{ color: '#fff' }} />
            </IonMenuButton>
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold' }}>
            Mapa de Coletores
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{ '--background': styles.lightBeige }}>
        {/* Contêiner do Mapa */}
        <div ref={mapRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* O Google Maps será injetado aqui */}
        </div>

        {/* Loader visível enquanto o mapa carrega */}
        <IonLoading 
            isOpen={isLoading} 
            message="Carregando mapa e coletores..."
            spinner="crescent"
            duration={5000} // Duração máxima para evitar loop infinito
            style={{ 
                '--backdrop-opacity': '0.3', 
                '--background': '#ffffff', 
                '--spinner-color': styles.primaryGreen 
            }}
        />
        
        {/* Placeholder de erro caso o carregamento falhe */}
        {!isLoading && !map && (
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#C5000F', fontWeight: 'bold' }}>⚠️ Falha ao carregar o Google Maps.</p>
                <p style={{ color: '#666' }}>Verifique sua conexão ou a chave de API.</p>
             </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MapPage;

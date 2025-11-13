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

import { Coletor, mockColetores } from '../data/mockData'; 


setupIonicReact();


const styles = {
  primaryGreen: '#387E5E',
  lightBeige: '#F5F5DC',
};


// Substituir
const GOOGLE_MAPS_API_KEY = ""; 
const MAP_ID = ""; 


const MapPage: React.FC = () => {

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const defaultCenter = { lat: -23.9610, lng: -46.3323 }; 
  

  const loadGoogleMapsScript = () => {

    if (document.getElementById('google-maps-script')) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const script = document.createElement('script');

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      

      (window as any).initMap = () => {
        console.log("Script do Google Maps carregado.");
        resolve();
      };
      
      document.head.appendChild(script);
    });
  };


  const initializeMap = async () => {


    if (!mapRef.current || typeof google === 'undefined' || !google.maps.Map) {
      console.error("Contêiner do mapa não encontrado ou Google Maps não carregado.");
      setIsLoading(false);
      return;
    }

    try {

        const mapOptions: google.maps.MapOptions = {
            center: defaultCenter,
            zoom: 14, 
            mapTypeControl: false, 
            streetViewControl: false, 
            fullscreenControl: false, 
            zoomControl: true, 
            // mapId: MAP_ID, 
        };


        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
        

        addCenterMarker(newMap, defaultCenter);
        

        addCollectorMarkers(newMap);

    } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
    } finally {
        setIsLoading(false);
    }
  };


  const addCenterMarker = (currentMap: google.maps.Map, position: google.maps.LatLngLiteral) => {
    new google.maps.Marker({
        position: position,
        map: currentMap,
        title: "Sua Localização (Simulada)",
        icon: {

            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40),
        },
    });
  };


  const addCollectorMarkers = (currentMap: google.maps.Map) => {

    mockColetores.forEach(coletor => {
        const marker = new google.maps.Marker({
            position: { lat: coletor.lat, lng: coletor.lng },
            map: currentMap,
            title: coletor.nome,
            icon: {

                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(40, 40),
            },
        });


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


  useEffect(() => {
    setIsLoading(true);

    loadGoogleMapsScript()
      .then(() => {

        setTimeout(initializeMap, 100); 
      })
      .catch(error => {
        console.error("Falha ao carregar script do Google Maps.", error);
        setIsLoading(false);
      });
  }, []); 

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

        <div ref={mapRef} style={{ width: '100%', height: '100%', position: 'relative' }}>

        </div>

        <IonLoading 
            isOpen={isLoading} 
            message="Carregando mapa e coletores..."
            spinner="crescent"
            duration={5000}
            style={{ 
                '--backdrop-opacity': '0.3', 
                '--background': '#ffffff', 
                '--spinner-color': styles.primaryGreen 
            }}
        />
        

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

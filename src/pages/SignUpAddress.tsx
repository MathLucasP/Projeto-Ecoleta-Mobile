import React, { useState, useEffect } from 'react';
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
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonAvatar
} from '@ionic/react';
import { arrowBack, cameraOutline, closeCircle } from 'ionicons/icons';

const styles = {
  primaryGreen: '#387E5E',
  primaryCream: '#F5F5DC',
  secondaryYellow: '#D2A03C',
};

// URL da API - ALTERE PARA SEU SERVIDOR
const API_URL = '/api/cadastro_gerador.php';

interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const SignupAddress: React.FC = () => {
  const history = useHistory();
  
  // Estado do formulário
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [genero, setGenero] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  
  // Estado de validação e UI
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Verifica se há dados das etapas anteriores
  useEffect(() => {
    const cadastroTemp = sessionStorage.getItem('cadastro_temp');
    if (!cadastroTemp) {
      history.replace('/app/signup');
    }
  }, [history]);

  // Formatar CEP
  const formatCEP = (value: string): string => {
    value = value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  // Buscar CEP
  const buscarCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return;
    }

    setLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (response.ok) {
        const data: CEPData = await response.json();
        
        if (data.erro) {
          setToastMessage('CEP não encontrado');
          setToastColor('danger');
          setShowToast(true);
        } else {
          setEndereco(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      }
    } catch (error) {
      setToastMessage('Erro ao buscar CEP');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoadingCep(false);
    }
  };

  // Handler de foto
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validar tipo
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setToastMessage('Apenas arquivos JPG ou PNG são permitidos');
        setToastColor('danger');
        setShowToast(true);
        return;
      }
      
      // Validar tamanho (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setToastMessage('A foto deve ter no máximo 2MB');
        setToastColor('danger');
        setShowToast(true);
        return;
      }
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP inválido';
    }

    if (!endereco.trim()) {
      newErrors.endereco = 'Digite o endereço';
    }

    if (!numero.trim()) {
      newErrors.numero = 'Digite o número';
    }

    if (!bairro.trim()) {
      newErrors.bairro = 'Digite o bairro';
    }

    if (!cidade.trim()) {
      newErrors.cidade = 'Digite a cidade';
    }

    if (!estado) {
      newErrors.estado = 'Selecione o estado';
    }

    if (!dataNasc) {
      newErrors.dataNasc = 'Digite a data de nascimento';
    } else {
      const birthDate = new Date(dataNasc);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 14) {
        newErrors.dataNasc = 'Você deve ter pelo menos 14 anos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler de submit - ATUALIZADO
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Recupera dados das etapas anteriores
      const cadastroTemp = JSON.parse(sessionStorage.getItem('cadastro_temp') || '{}');
      
      // Monta objeto completo
      const cadastroCompleto = {
        email: cadastroTemp.email,
        senha: cadastroTemp.senha,
        nome: cadastroTemp.nome,
        cpf: cadastroTemp.cpf,
        telefone: cadastroTemp.telefone,
        dataNasc,
        genero: genero || '',
        foto: foto || null,
        endereco: {
          cep: cep.replace(/\D/g, ''),
          rua: endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        }
      };

      // Faz a requisição para a API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cadastroCompleto)
      });

      // Some servers may return an empty body (204) or non-JSON responses.
      // Read as text first, then try to parse JSON only if there's content.
      let resultado: any = null;
      try {
        const text = await response.text();
        if (text) {
          resultado = JSON.parse(text);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response from signup API:', parseError);
        // keep resultado as null
      }

      // If the response status is not OK, surface the server message if available.
      if (!response.ok) {
        const msg = resultado?.message || `Erro ao processar cadastro (status ${response.status})`;
        throw new Error(msg);
      }

      // If server returned JSON, check its success flag. If there was no JSON but status is OK,
      // treat it as success.
      if (resultado && resultado.success === false) {
        throw new Error(resultado.message || 'Erro ao processar cadastro');
      }

      // Sucesso!
      console.log('Cadastro realizado:', resultado?.data ?? null);
      
      // Limpa dados temporários
      sessionStorage.removeItem('cadastro_temp');
      
      setToastMessage('Cadastro realizado com sucesso!');
      setToastColor('success');
      setShowToast(true);
      
      // Aguarda toast e redireciona
      setTimeout(() => {
        history.replace('/app/success');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setToastMessage(error.message || 'Erro ao finalizar cadastro. Tente novamente.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': styles.primaryGreen }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/signup/personal-info" icon={arrowBack} text="" style={{ color: '#fff' }} />
          </IonButtons>
          <IonTitle style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem' }}>
            Endereço e Finalização
          </IonTitle>
        </IonToolbar>
        <IonProgressBar value={1} style={{ '--background': '#ddd', '--progress-background': styles.secondaryYellow }} />
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': styles.primaryCream }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px 0' }}>
          
          {/* Título */}
          <div style={{ marginBottom: '25px' }}>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: 'bold', 
              color: styles.primaryGreen,
              marginBottom: '8px' 
            }}>
              Últimos passos
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#666' }}>
              Complete seu cadastro para virar um gerador
            </p>
          </div>

          {/* Formulário */}
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '15px', 
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}>
            
            {/* Foto de Perfil */}
            <div style={{ marginBottom: '25px', textAlign: 'center' }}>
              <IonLabel style={{ 
                display: 'block',
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '15px',
                fontSize: '1rem'
              }}>
                Foto de Perfil (Opcional)
              </IonLabel>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{ position: 'relative' }}>
                  <IonAvatar 
                    style={{ 
                      width: '120px', 
                      height: '120px',
                      border: `3px solid ${styles.primaryGreen}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('photoInput')?.click()}
                  >
                    {foto ? (
                      <img src={foto} alt="Preview" />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <IonIcon 
                          icon={cameraOutline} 
                          style={{ fontSize: '40px', color: '#999' }} 
                        />
                        <IonText style={{ fontSize: '0.75rem', color: '#999' }}>
                          Adicionar
                        </IonText>
                      </div>
                    )}
                  </IonAvatar>
                  
                  {foto && (
                    <IonButton
                      fill="clear"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFoto(null);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        '--padding-start': '0',
                        '--padding-end': '0',
                        'width': '30px',
                        'height': '30px',
                        '--border-radius': '50%',
                        '--background': styles.primaryGreen
                      }}
                    >
                      <IonIcon icon={closeCircle} style={{ color: '#fff' }} />
                    </IonButton>
                  )}
                </div>
                
                <input
                  type="file"
                  id="photoInput"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                
                <IonText style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
                  JPG ou PNG • Máx 2MB<br/>
                  Foto nítida do rosto
                </IonText>
              </div>
            </div>

            {/* CEP */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                CEP *
              </IonLabel>
              <div style={{ position: 'relative', width: '100%' }}>
                <IonInput
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  maxlength={9}
                  onIonInput={(e) => {
                    const formatted = formatCEP(e.detail.value!);
                    setCep(formatted);
                  }}
                  onIonBlur={() => {
                    if (cep.replace(/\D/g, '').length === 8) {
                      buscarCEP(cep);
                    }
                  }}
                  style={{
                    '--background': '#f5f5f5',
                    '--padding-start': '15px',
                    '--padding-end': '45px',
                    'borderRadius': '8px',
                    'marginTop': '5px'
                  }}
                />
                {loadingCep && (
                  <div style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <IonSpinner name="dots" style={{ width: '20px', height: '20px' }} />
                  </div>
                )}
              </div>
            </IonItem>
            {errors.cep && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.cep}
              </IonText>
            )}

            {/* Endereço */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Endereço *
              </IonLabel>
              <IonInput
                type="text"
                placeholder="Rua, Avenida..."
                value={endereco}
                onIonInput={(e) => setEndereco(e.detail.value!)}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px'
                }}
              />
            </IonItem>
            {errors.endereco && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.endereco}
              </IonText>
            )}

            {/* Número e Complemento */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: '1' }}>
                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ 
                    fontWeight: '600', 
                    color: styles.primaryGreen,
                    marginBottom: '8px' 
                  }}>
                    Número *
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="123"
                    value={numero}
                    onIonInput={(e) => setNumero(e.detail.value!)}
                    style={{
                      '--background': '#f5f5f5',
                      '--padding-start': '15px',
                      '--padding-end': '15px',
                      'borderRadius': '8px',
                      'marginTop': '5px'
                    }}
                  />
                </IonItem>
                {errors.numero && (
                  <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                    {errors.numero}
                  </IonText>
                )}
              </div>
              
              <div style={{ flex: '1' }}>
                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ 
                    fontWeight: '600', 
                    color: styles.primaryGreen,
                    marginBottom: '8px' 
                  }}>
                    Complemento
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Apto, Bloco..."
                    value={complemento}
                    onIonInput={(e) => setComplemento(e.detail.value!)}
                    style={{
                      '--background': '#f5f5f5',
                      '--padding-start': '15px',
                      '--padding-end': '15px',
                      'borderRadius': '8px',
                      'marginTop': '5px'
                    }}
                  />
                </IonItem>
              </div>
            </div>

            {/* Bairro e Cidade */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: '1' }}>
                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ 
                    fontWeight: '600', 
                    color: styles.primaryGreen,
                    marginBottom: '8px' 
                  }}>
                    Bairro *
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Seu bairro"
                    value={bairro}
                    onIonInput={(e) => setBairro(e.detail.value!)}
                    style={{
                      '--background': '#f5f5f5',
                      '--padding-start': '15px',
                      '--padding-end': '15px',
                      'borderRadius': '8px',
                      'marginTop': '5px'
                    }}
                  />
                </IonItem>
                {errors.bairro && (
                  <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                    {errors.bairro}
                  </IonText>
                )}
              </div>
              
              <div style={{ flex: '1' }}>
                <IonItem lines="none" style={{ '--padding-start': '0' }}>
                  <IonLabel position="stacked" style={{ 
                    fontWeight: '600', 
                    color: styles.primaryGreen,
                    marginBottom: '8px' 
                  }}>
                    Cidade *
                  </IonLabel>
                  <IonInput
                    type="text"
                    placeholder="Sua cidade"
                    value={cidade}
                    onIonInput={(e) => setCidade(e.detail.value!)}
                    style={{
                      '--background': '#f5f5f5',
                      '--padding-start': '15px',
                      '--padding-end': '15px',
                      'borderRadius': '8px',
                      'marginTop': '5px'
                    }}
                  />
                </IonItem>
                {errors.cidade && (
                  <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                    {errors.cidade}
                  </IonText>
                )}
              </div>
            </div>

            {/* Estado */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Estado *
              </IonLabel>
              <IonSelect
                value={estado}
                placeholder="Selecione"
                onIonChange={(e) => setEstado(e.detail.value)}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px',
                  'width': '100%'
                }}
              >
                {estadosBrasil.map(uf => (
                  <IonSelectOption key={uf} value={uf}>{uf}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            {errors.estado && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.estado}
              </IonText>
            )}

            {/* Data de Nascimento */}
            <IonItem lines="none" style={{ marginBottom: '20px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Data de Nascimento *
              </IonLabel>
              <IonInput
                type="date"
                value={dataNasc}
                onIonInput={(e) => setDataNasc(e.detail.value!)}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px'
                }}
              />
            </IonItem>
            {errors.dataNasc && (
              <IonText color="danger" style={{ fontSize: '0.85rem', display: 'block', marginTop: '-15px', marginBottom: '10px' }}>
                {errors.dataNasc}
              </IonText>
            )}

            {/* Gênero */}
            <IonItem lines="none" style={{ marginBottom: '25px', '--padding-start': '0' }}>
              <IonLabel position="stacked" style={{ 
                fontWeight: '600', 
                color: styles.primaryGreen,
                marginBottom: '8px' 
              }}>
                Gênero
              </IonLabel>
              <IonSelect
                value={genero}
                placeholder="Prefiro não informar"
                onIonChange={(e) => setGenero(e.detail.value)}
                style={{
                  '--background': '#f5f5f5',
                  '--padding-start': '15px',
                  '--padding-end': '15px',
                  'borderRadius': '8px',
                  'marginTop': '5px',
                  'width': '100%'
                }}
              >
                <IonSelectOption value="">Prefiro não informar</IonSelectOption>
                <IonSelectOption value="M">Masculino</IonSelectOption>
                <IonSelectOption value="F">Feminino</IonSelectOption>
                <IonSelectOption value="O">Outro</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* Botões */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '25px' 
            }}>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => history.goBack()}
                disabled={isLoading}
                style={{
                  '--border-color': styles.primaryGreen,
                  '--color': styles.primaryGreen,
                  '--border-radius': '10px',
                  'flex': '1',
                  'fontWeight': 'bold',
                  'textTransform': 'none'
                }}
              >
                Voltar
              </IonButton>
              
              <IonButton
                expand="block"
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  '--background': styles.primaryGreen,
                  '--border-radius': '10px',
                  'flex': '1',
                  'fontWeight': 'bold',
                  'textTransform': 'none'
                }}
              >
                {isLoading ? <IonSpinner name="dots" /> : 'Finalizar Cadastro'}
              </IonButton>
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

export default SignupAddress;
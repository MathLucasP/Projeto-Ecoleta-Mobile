// Interface que define a estrutura completa de um Coletor.
// Todas as páginas usarão esta mesma estrutura.
export interface Coletor {
  id: number;
  nome: string;
  afiliacaoDesde: number;
  avaliacao: number; // Média de 1 a 5
  totalColetas: number;
  bio: string;
  telefone: string;
  email: string;
  especialidade: string;
  // Coordenadas para a exibição no mapa
  lat: number;
  lng: number;
}

// Mock de dados de coletores (usamos Santos/SP como localização simulada)
export const mockColetores: Coletor[] = [
  { 
    id: 1, 
    nome: 'Carlos Andrade', 
    afiliacaoDesde: 2020, 
    avaliacao: 4.5, 
    totalColetas: 152, 
    bio: 'Coletor independente com foco em material orgânico e eletrônico. Atendo toda a Baixada Santista com agilidade.', 
    telefone: '(13) 98765-4321', 
    email: 'carlos.andrade@coleta.com', 
    especialidade: 'Orgânicos e Eletrônicos',
    lat: -23.9610, 
    lng: -46.3323 
  },
  { 
    id: 2, 
    nome: 'Mariana Silva', 
    afiliacaoDesde: 2021, 
    avaliacao: 5.0, 
    totalColetas: 310, 
    bio: 'Especializada em reciclagem de Plástico e Vidro. Serviço de retirada programada para residências e empresas.', 
    telefone: '(13) 99123-4567', 
    email: 'mariana.silva@recicla.org', 
    especialidade: 'Plástico e Vidro',
    lat: -23.9690, 
    lng: -46.3380 
  },
  { 
    id: 3, 
    nome: 'EcoService SP', 
    afiliacaoDesde: 2019, 
    avaliacao: 4.0, 
    totalColetas: 78, 
    bio: 'Empresa dedicada à logística reversa de lixo eletrônico, pilhas e baterias. Coleta certificada e segura.', 
    telefone: '(13) 3223-1000', 
    email: 'contato@ecoservice.com.br', 
    especialidade: 'Lixo Eletrônico',
    lat: -23.9450, 
    lng: -46.3300 
  },
  { 
    id: 4, 
    nome: 'João Coletas', 
    afiliacaoDesde: 2023, 
    avaliacao: 3.5, 
    totalColetas: 45, 
    bio: 'Foco em papelão e embalagens para pequenos comércios e escritórios. Compromisso com a sustentabilidade.', 
    telefone: '(13) 98877-6655', 
    email: 'joao.coletas@gmail.com', 
    especialidade: 'Papelão e Embalagens',
    lat: -23.9550, 
    lng: -46.3450 
  },
];

/**
 * Função utilitária para encontrar um coletor pelo ID
 */
export const findColetorById = (id: number): Coletor | undefined => {
  return mockColetores.find(coletor => coletor.id === id);
};

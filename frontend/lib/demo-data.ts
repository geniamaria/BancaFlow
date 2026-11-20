// Dados fictícios usados apenas para compor a estrutura visual.
// Nenhuma instituição financeira real está representada nesta etapa.

export type QueueLevel = "normal" | "ocupada" | "fechada";

export interface DemoBank {
  id: string;
  name: string;
  shortName: string;
  agencyCount: number;
}

export interface DemoAgency {
  id: string;
  bank: string;
  name: string;
  address: string;
  city: string;
  distanceKm: number;
  waitMinutes: number;
  peopleWaiting: number;
  level: QueueLevel;
  services: string[];
}

export interface DemoProduct {
  id: string;
  name: string;
  category: "Contas" | "Atendimento" | "Documentos";
  description: string;
  details: string[];
}

export const demoBanks: DemoBank[] = [
  { id: "aurora", name: "Banco Aurora", shortName: "Aurora", agencyCount: 24 },
  { id: "meridiano", name: "Banco Meridiano", shortName: "Meridiano", agencyCount: 18 },
  { id: "litoral", name: "Banco Litoral", shortName: "Litoral", agencyCount: 12 },
];

export const demoAgencies: DemoAgency[] = [
  {
    id: "ag-01",
    bank: "Banco Aurora",
    name: "Aurora – Baixa",
    address: "Av. da Liberdade, 120",
    city: "Maputo",
    distanceKm: 1.2,
    waitMinutes: 8,
    peopleWaiting: 6,
    level: "normal",
    services: ["Abertura de conta", "Actualização de dados", "Depósitos"],
  },
  {
    id: "ag-02",
    bank: "Banco Meridiano",
    name: "Meridiano – Polana",
    address: "Rua do Segundo Congresso, 45",
    city: "Maputo",
    distanceKm: 2.4,
    waitMinutes: 17,
    peopleWaiting: 14,
    level: "ocupada",
    services: ["Abertura de conta", "Transferências", "Cartões"],
  },
  {
    id: "ag-03",
    bank: "Banco Litoral",
    name: "Litoral – Matola",
    address: "Av. das Nações Unidas, 88",
    city: "Matola",
    distanceKm: 6.8,
    waitMinutes: 5,
    peopleWaiting: 3,
    level: "normal",
    services: ["Actualização de dados", "Levantamentos", "Depósitos"],
  },
  {
    id: "ag-04",
    bank: "Banco Aurora",
    name: "Aurora – Beira Centro",
    address: "Av. Poder Popular, 210",
    city: "Beira",
    distanceKm: 12.5,
    waitMinutes: 11,
    peopleWaiting: 9,
    level: "normal",
    services: ["Abertura de conta", "Cartões", "Depósitos"],
  },
  {
    id: "ag-05",
    bank: "Banco Meridiano",
    name: "Meridiano – Nampula",
    address: "Av. Paulo Samuel Kankhomba, 31",
    city: "Nampula",
    distanceKm: 18.1,
    waitMinutes: 22,
    peopleWaiting: 19,
    level: "ocupada",
    services: ["Transferências", "Actualização de dados"],
  },
  {
    id: "ag-06",
    bank: "Banco Litoral",
    name: "Litoral – Maputo Sul",
    address: "EN1, km 12",
    city: "Maputo",
    distanceKm: 9.3,
    waitMinutes: 0,
    peopleWaiting: 0,
    level: "fechada",
    services: ["Depósitos", "Levantamentos"],
  },
];

export const demoProducts: DemoProduct[] = [
  {
    id: "conta-ordem",
    name: "Conta à ordem",
    category: "Contas",
    description: "Para movimentação diária, com cartão e acesso digital.",
    details: ["Sem custo de abertura", "Transferências nacionais", "Extracto mensal digital"],
  },
  {
    id: "conta-poupanca",
    name: "Conta poupança",
    category: "Contas",
    description: "Uma forma simples de reservar fundos para objectivos futuros.",
    details: ["Rendimento mensal", "Movimentos ilimitados", "Acesso através da app"],
  },
  {
    id: "conta-jovem",
    name: "Conta jovem",
    category: "Contas",
    description: "Pensada para clientes entre os 16 e os 25 anos.",
    details: ["Sem comissão de manutenção", "Cartão virtual", "Vídeo explicativo disponível"],
  },
  {
    id: "marcacao",
    name: "Marcação de atendimento",
    category: "Atendimento",
    description: "Escolha a agência, o serviço e o horário que melhor lhe convém.",
    details: ["Confirmação imediata", "Consulta do tempo de espera", "Reagendamento simples"],
  },
  {
    id: "actualizacao",
    name: "Actualização de dados",
    category: "Atendimento",
    description: "Atualize os seus dados cadastrais e apresente os originais na agência.",
    details: ["Upload antecipado", "Agendamento de apresentação", "Acompanhamento do pedido"],
  },
  {
    id: "documentos",
    name: "Documentos de abertura",
    category: "Documentos",
    description: "Consulte a lista de documentos necessários antes de ir à agência.",
    details: ["Documento de identificação", "Comprovativo de residência", "Certificado de nascimento"],
  },
];

export const demoSteps = [
  {
    title: "Escolha a agência",
    description: "Compare distância, serviços e movimento das filas.",
  },
  {
    title: "Prepare os documentos",
    description: "Consulte a lista e faça o upload antecipado.",
  },
  {
    title: "Marque o atendimento",
    description: "Selecione o dia e a hora para apresentar os originais.",
  },
];

export const adminMetrics = [
  { label: "Agências activas", value: "54", detail: "3 bancos demonstrativos" },
  { label: "Atendimentos hoje", value: "312", detail: "Dados ilustrativos" },
  { label: "Tempo médio de espera", value: "11 min", detail: "Últimas 24 horas" },
  { label: "Pedidos pendentes", value: "27", detail: "Actualização de dados" },
];

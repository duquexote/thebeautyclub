export interface Socia {
  id: number;
  uuid?: string;
  nome?: string;
  sobrenome?: string;
  email?: string;
  numero: string;
  cnpj?: string;
  certificado_url?: string;
  certificado_validado?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CadastroSociaSimplificado {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  numero: string;
}

export interface CadastroSociaCompleto extends CadastroSociaSimplificado {
  confirmarEmail: string;
  confirmarSenha: string;
  cnpj?: string;
  certificado?: File | null;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface Produto {
  id?: string;
  nome: string;
  preco: number;
  preco_promocional?: number | null;
  descricao?: string;
  imagem?: string;
  link_comprar?: string;
  ativo?: boolean;
  // Seções de descrição detalhada
  secao1_titulo?: string;
  secao1_subtitulo?: string;
  secao1_imagem?: string;
  secao2_titulo?: string;
  secao2_subtitulo?: string;
  secao2_imagem?: string;
  secao3_titulo?: string;
  secao3_subtitulo?: string;
  secao3_imagem?: string;
  created_at?: string;
  updated_at?: string;
}

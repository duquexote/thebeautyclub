// Este arquivo agora apenas importa e re-exporta o componente ProdutosProtegido
import ProdutosProtegido from './ProdutosProtegido';

// Componente principal que usa o componente ProdutosProtegido
export default function Produtos() {
  return <ProdutosProtegido />;
}

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Produto } from '../types/Produto';
import { v4 as uuidv4 } from 'uuid';

export default function RegistroProduto() {
  const [produto, setProduto] = useState<Partial<Produto>>({
    nome: '',
    preco: 0,
    preco_promocional: null,
    descricao: '',
    imagem: '',
    link_comprar: '',
    ativo: true,
    secao1_titulo: '',
    secao1_subtitulo: '',
    secao1_imagem: '',
    secao2_titulo: '',
    secao2_subtitulo: '',
    secao2_imagem: '',
    secao3_titulo: '',
    secao3_subtitulo: '',
    secao3_imagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Estados para as imagens das seções
  const [secao1ImageFile, setSecao1ImageFile] = useState<File | null>(null);
  const [secao1ImagePreview, setSecao1ImagePreview] = useState<string | null>(null);
  
  const [secao2ImageFile, setSecao2ImageFile] = useState<File | null>(null);
  const [secao2ImagePreview, setSecao2ImagePreview] = useState<string | null>(null);
  
  const [secao3ImageFile, setSecao3ImageFile] = useState<File | null>(null);
  const [secao3ImagePreview, setSecao3ImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    // Tratamento especial para campos numéricos
    if (name === 'preco' || name === 'preco_promocional') {
      setProduto({ ...produto, [name]: value === '' ? null : parseFloat(value) });
    } else if (type === 'checkbox') {
      setProduto({ ...produto, [name]: checked });
    } else {
      setProduto({ ...produto, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Funções para lidar com as imagens das seções
  const handleSecao1ImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecao1ImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setSecao1ImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSecao2ImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecao2ImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setSecao2ImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSecao3ImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecao3ImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setSecao3ImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      setLoading(true);
      
      // Inicializar variáveis para URLs das imagens
      let imagemUrl = produto.imagem || '';
      let secao1ImagemUrl = produto.secao1_imagem || '';
      let secao2ImagemUrl = produto.secao2_imagem || '';
      let secao3ImagemUrl = produto.secao3_imagem || '';
      
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(`${uuidv4()}-${imageFile.name}`, imageFile);

        if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem principal: ${uploadError.message}`);
        }

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(uploadData.path);

        imagemUrl = publicUrl;
      }
      
      // Upload da imagem da seção 1 se houver
      if (secao1ImageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(`secao1-${uuidv4()}-${secao1ImageFile.name}`, secao1ImageFile);

        if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem da seção 1: ${uploadError.message}`);
        }

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(uploadData.path);

        secao1ImagemUrl = publicUrl;
      }
      
      // Upload da imagem da seção 2 se houver
      if (secao2ImageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(`secao2-${uuidv4()}-${secao2ImageFile.name}`, secao2ImageFile);

        if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem da seção 2: ${uploadError.message}`);
        }

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(uploadData.path);

        secao2ImagemUrl = publicUrl;
      }
      
      // Upload da imagem da seção 3 se houver
      if (secao3ImageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(`secao3-${uuidv4()}-${secao3ImageFile.name}`, secao3ImageFile);

        if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem da seção 3: ${uploadError.message}`);
        }

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(uploadData.path);

        secao3ImagemUrl = publicUrl;
      }

      // Inserir produto no banco de dados
      const { error } = await supabase.from('produtos').insert([
        {
          ...produto,
          imagem: imagemUrl,
          secao1_imagem: secao1ImagemUrl,
          secao2_imagem: secao2ImagemUrl,
          secao3_imagem: secao3ImagemUrl
        },
      ]);

      if (error) throw new Error(`Erro ao cadastrar produto: ${error.message}`);

      setMessage({ text: 'Produto cadastrado com sucesso!', type: 'success' });
      
      // Limpar o formulário após o sucesso
      setProduto({
        nome: '',
        preco: 0,
        preco_promocional: null,
        descricao: '',
        imagem: '',
        link_comprar: '',
        ativo: true,
        secao1_titulo: '',
        secao1_subtitulo: '',
        secao1_imagem: '',
        secao2_titulo: '',
        secao2_subtitulo: '',
        secao2_imagem: '',
        secao3_titulo: '',
        secao3_subtitulo: '',
        secao3_imagem: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setSecao1ImageFile(null);
      setSecao1ImagePreview(null);
      setSecao2ImageFile(null);
      setSecao2ImagePreview(null);
      setSecao3ImageFile(null);
      setSecao3ImagePreview(null);
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Cadastro de Produto</h1>
      
      {message.text && (
        <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preco">
            Preço (R$) *
          </label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={produto.preco || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preco_promocional">
            Preço Promocional (R$)
          </label>
          <input
            type="number"
            id="preco_promocional"
            name="preco_promocional"
            value={produto.preco_promocional || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={produto.descricao || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagem">
            Imagem do Produto
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              id="imagem"
              name="imagem"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full h-auto max-h-48 rounded border border-gray-300" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link_comprar">
            Link do Botão de Comprar
          </label>
          <input
            type="url"
            id="link_comprar"
            name="link_comprar"
            value={produto.link_comprar || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://exemplo.com/comprar"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={produto.ativo || false}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label className="ml-2 block text-gray-700" htmlFor="ativo">
              Produto ativo (disponível para compra)
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Se desativado, o botão de compra será substituído por "Esgotado"</p>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-pink-600 border-b pb-2">Seções de Descrição Detalhada</h2>
        <p className="text-sm text-gray-500 mb-6">Adicione até 3 seções com título, subtítulo e imagem para exibir na página de detalhes do produto.</p>
        
        {/* Seção 1 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">Seção 1</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secao1_titulo">
              Título
            </label>
            <input
              type="text"
              id="secao1_titulo"
              name="secao1_titulo"
              value={produto.secao1_titulo || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secao1_subtitulo">
              Subtítulo/Descrição
            </label>
            <textarea
              id="secao1_subtitulo"
              name="secao1_subtitulo"
              value={produto.secao1_subtitulo || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Imagem da Seção 1
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleSecao1ImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-600
                  hover:file:bg-pink-100"
              />
              {secao1ImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={secao1ImagePreview} 
                    alt="Preview da imagem da seção 1" 
                    className="max-h-32 rounded border"
                  />
                </div>
              )}
              {produto.secao1_imagem && !secao1ImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Imagem atual:</p>
                  <img 
                    src={produto.secao1_imagem} 
                    alt="Imagem atual da seção 1" 
                    className="max-h-32 rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Seção 2 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">Seção 2</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secao2_titulo">
              Título
            </label>
            <input
              type="text"
              id="secao2_titulo"
              name="secao2_titulo"
              value={produto.secao2_titulo || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secao2_subtitulo">
              Subtítulo/Descrição
            </label>
            <textarea
              id="secao2_subtitulo"
              name="secao2_subtitulo"
              value={produto.secao2_subtitulo || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Imagem da Seção 2
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleSecao2ImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-600
                  hover:file:bg-pink-100"
              />
              {secao2ImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={secao2ImagePreview} 
                    alt="Preview da imagem da seção 2" 
                    className="max-h-32 rounded border"
                  />
                </div>
              )}
              {produto.secao2_imagem && !secao2ImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Imagem atual:</p>
                  <img 
                    src={produto.secao2_imagem} 
                    alt="Imagem atual da seção 2" 
                    className="max-h-32 rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Seção 3 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-pink-600">Seção 3</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secao3_titulo">
              Título
            </label>
            <input
              type="text"
              id="secao3_titulo"
              name="secao3_titulo"
              value={produto.secao3_titulo || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secao3_subtitulo">
              Subtítulo/Descrição
            </label>
            <textarea
              id="secao3_subtitulo"
              name="secao3_subtitulo"
              value={produto.secao3_subtitulo || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Imagem da Seção 3
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleSecao3ImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-600
                  hover:file:bg-pink-100"
              />
              {secao3ImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={secao3ImagePreview} 
                    alt="Preview da imagem da seção 3" 
                    className="max-h-32 rounded border"
                  />
                </div>
              )}
              {produto.secao3_imagem && !secao3ImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Imagem atual:</p>
                  <img 
                    src={produto.secao3_imagem} 
                    alt="Imagem atual da seção 3" 
                    className="max-h-32 rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useRef } from 'react';
import { insertArticleDirectly, uploadImage } from '../utils/supabaseClient';
import AdminAuth from '../components/AdminAuth';
import { useNavigate } from 'react-router-dom';

// Componente interno que será protegido pelo AdminAuth
function AdminBlogRegistrationContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para o formulário
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [published, setPublished] = useState(false);
  
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateSlug = () => {
    // Criar slug a partir do título
    const generatedSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  // Função para lidar com a seleção de arquivo de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    // Limitar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos de 5MB.');
      return;
    }
    
    setImageFile(file);
    setError(null);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setCoverImage('');
    setImageFile(null);
    setImagePreview(null);
    setPublished(false);
    setSuccess(null);
    setError(null);
    
    // Resetar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validar campos obrigatórios
      if (!title || !slug || !content) {
        throw new Error('Título, slug e conteúdo são obrigatórios');
      }

      console.log('Iniciando processo de criação do artigo...');
      
      // Variável para armazenar a URL da imagem
      let imageUrl: string | null = coverImage || null;
      
      // Se tiver um arquivo de imagem selecionado, fazer upload
      if (imageFile) {
        setUploadProgress(true);
        console.log('Fazendo upload da imagem...');
        
        imageUrl = await uploadImage(imageFile);
        
        if (!imageUrl) {
          throw new Error('Falha ao fazer upload da imagem. Tente novamente.');
        }
        
        setUploadProgress(false);
        console.log('Upload da imagem concluído com sucesso:', imageUrl);
      }
      
      // Criar objeto de dados para o artigo
      const articleData = {
        title,
        slug,
        content,
        excerpt: excerpt || title,
        cover_image: imageUrl || null,
        published,
        published_at: published ? new Date().toISOString() : null
        // Removido o campo author_id conforme solicitado
      };
      
      console.log('Dados do artigo para inserção:', articleData);
      
      // Usar nossa função de inserção direta que contorna as restrições
      const result = await insertArticleDirectly(articleData);
      
      // Verificar resultado
      if (!result.success) {
        throw new Error(`Erro na inserção direta: ${JSON.stringify(result.error)}`);
      }
      
      setSuccess('Artigo criado com sucesso!');
      console.log('Artigo criado com sucesso');
      
      // Resetar formulário após sucesso
      resetForm();
    } catch (err: any) {
      console.error('Erro ao salvar artigo:', err);
      setError(err.message || 'Erro ao salvar artigo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Cadastro de Artigo</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-center">
          <p className="text-red-700 text-sm">⚠️ {error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-center">
          <p className="text-green-700 text-sm">✅ {success}</p>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/blog')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para Gerenciar Blog
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para Admin
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Novo Artigo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleCreateSlug}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug (URL)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                /blog/
              </span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Resumo
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Conteúdo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
              Imagem de Capa
            </label>
            <div className="mt-1 flex flex-col space-y-2">
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-600
                  hover:file:bg-pink-100"
              />
              
              {/* Campo de URL opcional */}
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">ou URL:</span>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Prévia da imagem */}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Prévia:</p>
                  <img 
                    src={imagePreview} 
                    alt="Prévia da imagem" 
                    className="max-h-40 rounded-md border border-gray-300" 
                  />
                </div>
              )}
              
              {/* Indicador de progresso */}
              {uploadProgress && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-pulse text-pink-600 text-sm">Enviando imagem...</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Publicar artigo
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded disabled:bg-pink-300"
            >
              {loading ? 'Salvando...' : 'Salvar Artigo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal que usa o AdminAuth como wrapper
export default function AdminBlogRegistration() {
  return (
    <AdminAuth redirectTo="/admin-login">
      <AdminBlogRegistrationContent />
    </AdminAuth>
  );
}

import { useState, useEffect } from 'react';
import { supabase, insertArticleDirectly } from '../utils/supabaseClient';
import AdminAuth from '../components/AdminAuth';
import { useNavigate } from 'react-router-dom';

// Interface para os artigos do blog
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_id?: string;
}

// Componente interno que será protegido pelo AdminAuth
function AdminBlogContent() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Estados para o formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('blog_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Erro ao buscar artigos:', supabaseError);
        throw supabaseError;
      }

      console.log('Artigos obtidos com sucesso:', data?.length || 0, 'artigos');
      setArticles(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar artigos:', err);
      setError(err.message || 'Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  };

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

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setCoverImage('');
    setPublished(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar se é uma edição ou criação
      if (editingId) {
        // Atualizar artigo existente
        const { error: updateError } = await supabase
          .from('blog_articles')
          .update({
            title,
            slug,
            content,
            excerpt,
            cover_image: coverImage,
            published,
            published_at: published ? new Date().toISOString() : null
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        console.log('Artigo atualizado com sucesso');
      } else {
        console.log('Tentando inserir artigo usando inserção direta...');
        
        // Criar objeto de dados para o artigo
        const articleData = {
          title,
          slug,
          content,
          excerpt,
          cover_image: coverImage,
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
        
        // Se chegou aqui, não houve erro na inserção
        const insertError = null;

        if (insertError) throw insertError;
        console.log('Artigo criado com sucesso');
      }

      // Resetar formulário e buscar artigos atualizados
      resetForm();
      setShowForm(false);
      await fetchArticles();
    } catch (err: any) {
      console.error('Erro ao salvar artigo:', err);
      setError(err.message || 'Erro ao salvar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: BlogArticle) => {
    setTitle(article.title);
    setSlug(article.slug);
    setContent(article.content);
    setExcerpt(article.excerpt || '');
    setCoverImage(article.cover_image || '');
    setPublished(article.published);
    setEditingId(article.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log('Artigo excluído com sucesso');
      await fetchArticles();
    } catch (err: any) {
      console.error('Erro ao excluir artigo:', err);
      setError(err.message || 'Erro ao excluir artigo');
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (article: BlogArticle) => {
    try {
      setLoading(true);
      const newStatus = !article.published;
      
      const { error } = await supabase
        .from('blog_articles')
        .update({ 
          published: newStatus,
          published_at: newStatus ? new Date().toISOString() : null
        })
        .eq('id', article.id);

      if (error) throw error;
      console.log(`Artigo ${newStatus ? 'publicado' : 'despublicado'} com sucesso`);
      await fetchArticles();
    } catch (err: any) {
      console.error('Erro ao alterar status de publicação:', err);
      setError(err.message || 'Erro ao alterar status de publicação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Administração do Blog</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3 flex items-center justify-center">
          <p className="text-red-700 text-sm">⚠️ {error}</p>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          >
            {showForm ? 'Cancelar' : 'Editar Artigo'}
          </button>
          <button
            onClick={() => navigate('/admin/blog/novo')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Novo Artigo
          </button>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para Admin
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Artigo' : 'Novo Artigo'}</h2>
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
                URL da Imagem de Capa
              </label>
              <input
                type="url"
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
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
      )}

      {loading && !showForm ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum artigo encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">/blog/{article.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => togglePublishStatus(article)}
                      className={`${
                        article.published ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                      } mr-4`}
                    >
                      {article.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Componente principal que usa o AdminAuth como wrapper
export default function AdminBlog() {
  return (
    <AdminAuth redirectTo="/admin-login">
      <AdminBlogContent />
    </AdminAuth>
  );
}

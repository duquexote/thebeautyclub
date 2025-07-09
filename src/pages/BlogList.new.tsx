import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

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
  author_id: string;
  author_name?: string;
}

const BlogList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    // Função para verificar se é dispositivo móvel
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  useEffect(() => {
    fetchArticles();
  }, [searchParams, currentPage]);
  
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calcular offset para paginação
      const from = (currentPage - 1) * articlesPerPage;
      const to = from + articlesPerPage - 1;
      
      // Buscar artigos publicados
      let query = supabase
        .from('blog_articles')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(from, to);
      
      const { data, error: fetchError, count } = await query;
      
      if (fetchError) throw fetchError;
      
      // Buscar informações dos autores
      if (data && data.length > 0) {
        const authorIds = [...new Set(data.map(article => article.author_id))];
        
        const { data: authorsData } = await supabase
          .from('admins')
          .select('id, name')
          .in('id', authorIds);
        
        const authorsMap = (authorsData || []).reduce((map, author) => {
          map[author.id] = author.name;
          return map;
        }, {} as Record<string, string>);
        
        // Adicionar nomes dos autores aos artigos
        const articlesWithAuthors = data.map(article => ({
          ...article,
          author_name: authorsMap[article.author_id] || 'Autor'
        }));
        
        setArticles(articlesWithAuthors);
        
        // Calcular total de páginas
        if (count !== null) {
          setTotalPages(Math.ceil(count / articlesPerPage));
        }
      } else {
        setArticles([]);
      }
    } catch (err: any) {
      console.error('Erro ao buscar artigos:', err);
      setError(err.message || 'Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-16 relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog The Beauty Club</h1>
            <p className="text-lg md:text-xl opacity-90">
              Dicas, novidades e informações sobre beleza e estética
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">Nenhum artigo encontrado.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Featured Post */}
                  {articles.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="bg-white rounded-lg overflow-hidden shadow-md">
                        {articles[0].cover_image ? (
                          <img 
                            src={articles[0].cover_image} 
                            alt={articles[0].title} 
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
                            <span className="text-pink-500 text-lg font-medium">The Beauty Club</span>
                          </div>
                        )}
                        <div className="p-6">
                          <div className="mb-2">
                            <span className="ml-3 text-gray-500 text-sm">
                              {new Date(articles[0].published_at || articles[0].created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold mb-2">
                            <Link to={`/blog/${articles[0].slug}`} className="hover:text-pink-500">
                              {articles[0].title}
                            </Link>
                          </h2>
                          <p className="text-gray-600 mb-4">
                            {articles[0].excerpt || articles[0].content.substring(0, 150) + '...'}
                          </p>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-medium text-sm">
                                {articles[0].author_name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{articles[0].author_name || 'Autor'}</h3>
                              <p className="text-xs text-gray-500">The Beauty Club</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Regular Posts */}
                  {articles.slice(1).map((article) => (
                    <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                      {article.cover_image ? (
                        <img 
                          src={article.cover_image} 
                          alt={article.title} 
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
                          <span className="text-pink-500">The Beauty Club</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="ml-3 text-gray-500 text-sm">
                            {new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">
                          <Link to={`/blog/${article.slug}`} className="hover:text-pink-500">
                            {article.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {article.excerpt || article.content.substring(0, 150) + '...'}
                        </p>
                        <Link 
                          to={`/blog/${article.slug}`} 
                          className="text-pink-500 hover:underline font-medium inline-flex items-center"
                        >
                          Ler artigo completo
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'} bg-white`}
                      >
                        Anterior
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border rounded-md ${page === currentPage 
                            ? 'text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
                            : 'text-gray-500 bg-white hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'} bg-white`}
                      >
                        Próxima
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Sobre o Blog</h3>
              <p className="text-gray-600 mb-4">
                Bem-vindo ao blog do The Beauty Club! Aqui compartilhamos dicas, novidades e informações sobre o mundo da beleza e estética.
              </p>
            </div>
            
            {articles.length > 0 && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl shadow-md border border-pink-100 mb-8">
                <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Artigos Recentes</h3>
                <div className="space-y-6">
                  {articles.slice(0, 3).map((article) => (
                    <div key={article.id} className="flex items-start">
                      {article.cover_image ? (
                        <img 
                          src={article.cover_image} 
                          alt={article.title} 
                          className="w-16 h-16 object-cover rounded mr-3"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-pink-100 rounded flex items-center justify-center mr-3">
                          <span className="text-pink-500 text-xs">TBC</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          <Link to={`/blog/${article.slug}`} className="hover:text-pink-500">
                            {article.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(article.published_at || article.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md border border-purple-100">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Inscreva-se para receber as últimas atualizações e novidades do nosso blog.
              </p>
              <form>
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-full hover:from-pink-600 hover:to-purple-700 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;

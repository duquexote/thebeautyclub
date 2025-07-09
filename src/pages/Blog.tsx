import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  author_avatar?: string;
}

const Blog: React.FC = () => {
  // Obter o slug do artigo da URL
  const { slug } = useParams<{ slug: string }>();
  
  // Estado para armazenar o artigo atual e artigos relacionados
  const [post, setPost] = useState<BlogArticle | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar o artigo e artigos relacionados quando o slug mudar
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Buscar o artigo pelo slug
        const { data: article, error: articleError } = await supabase
          .from('blog_articles')
          .select(`
            id, title, slug, content, excerpt, cover_image, 
            published, created_at, updated_at, published_at, author_id
          `)
          .eq('slug', slug)
          .eq('published', true)
          .single();
        
        if (articleError) throw articleError;
        
        if (!article) {
          setError('Artigo não encontrado');
          setLoading(false);
          return;
        }
        
        // Simplificando a lógica de autores - não depende mais da tabela de usuários
        // Combinar dados do artigo com o autor padrão
        const fullArticle = {
          ...article,
          author_name: 'The Beauty Club',
        };
        
        setPost(fullArticle);
        
        // Buscar artigos relacionados (excluindo o atual)
        const { data: related } = await supabase
          .from('blog_articles')
          .select(`
            id, title, slug, content, excerpt, cover_image, 
            published, created_at, updated_at, published_at, author_id
          `)
          .eq('published', true)
          .neq('id', article.id)
          .order('published_at', { ascending: false })
          .limit(3);
        
        setRelatedPosts(related || []);
      } catch (err: any) {
        console.error('Erro ao buscar artigo:', err);
        setError(err.message || 'Erro ao carregar o artigo');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug]);

  // Se estiver carregando
  if (loading) {
    return (
      <div className="pt-24 pb-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  // Se ocorreu um erro ou o artigo não foi encontrado
  if (error || !post) {
    return (
      <div className="pt-24 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="mb-6">O artigo que você está procurando não existe ou foi removido.</p>
          <Link to="/blog" className="text-blue-600 hover:underline">Voltar para o blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 relative">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('/images/hero-background-web.png')` 
        }}>
        {/* Overlay para garantir a legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-sm"></div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-pink-300 rounded-full opacity-10 z-0 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300 rounded-full opacity-10 z-0 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="ml-3 text-white/80 text-sm">
                {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-200">
              {post.title}
            </h1>
            <p className="text-lg text-white/90 mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                <span className="text-white font-medium">
                  {post.author_name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{post.author_name || 'Autor'}</h3>
                <p className="text-sm text-white/80">The Beauty Club</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap -mx-4">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 px-4">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-pink-500 prose-a:hover:text-purple-600">
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto rounded-xl shadow-md mb-8"
                />
              )}
              
              {/* Renderizando o conteúdo do artigo como HTML */}
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }} 
                className="prose-strong:text-pink-700 prose-em:text-purple-600 prose-blockquote:border-l-pink-500 prose-blockquote:bg-pink-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Artigos Relacionados</h3>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="flex items-start">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                      {relatedPost.cover_image ? (
                        <img 
                          src={relatedPost.cover_image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium hover:text-pink-500">
                        <Link to={`/blog/${relatedPost.slug}`} className="hover:text-pink-500">{relatedPost.title}</Link>
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(relatedPost.published_at || relatedPost.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
                
                {relatedPosts.length === 0 && (
                  <p className="text-gray-500">Nenhum artigo relacionado encontrado.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Mais do Blog</h3>
              <div className="flex justify-center">
                <Link to="/blog" className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium py-2 px-4 rounded-md transition duration-300">
                  Ver todos os artigos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

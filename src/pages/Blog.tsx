import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NewsItem, getNewsBySlug, getRelatedNews } from "../data/news";

const Blog: React.FC = () => {
  // Obter o slug do artigo da URL
  const { slug } = useParams<{ slug: string }>();
  
  // Estado para armazenar o artigo atual e artigos relacionados
  const [post, setPost] = useState<NewsItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<NewsItem[]>([]);

  // Carregar o artigo e artigos relacionados quando o slug mudar
  useEffect(() => {
    if (slug) {
      const currentPost = getNewsBySlug(slug);
      if (currentPost) {
        setPost(currentPost);
        setRelatedPosts(getRelatedNews(slug));
      }
    }
  }, [slug]);

  // Se o artigo não for encontrado
  if (!post) {
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm">
                {post.category.name}
              </span>
              <span className="ml-3 text-white/80 text-sm">{post.publishedAt}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-200">
              {post.title}
            </h1>
            <p className="text-lg text-white/90 mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center">
              {post.author.avatar ? (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-pink-300"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-medium">{post.author.initials}</span>
                </div>
              )}
              <div>
                <h3 className="font-medium">{post.author.name}</h3>
                <p className="text-sm text-white/80">{post.author.role}</p>
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
              {post.coverImage && (
                <img
                  src={post.coverImage}
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
                      {relatedPost.coverImage ? (
                        <img 
                          src={relatedPost.coverImage} 
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
                      <p className="text-sm text-gray-500 mt-1">{relatedPost.publishedAt}</p>
                    </div>
                  </div>
                ))}
                
                {relatedPosts.length === 0 && (
                  <p className="text-gray-500">Nenhum artigo relacionado encontrado.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Categorias</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog?category=direito-medico" className="text-gray-700 hover:text-pink-500">
                    Direito Médico
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=estetica" className="text-gray-700 hover:text-pink-500">
                    Estética
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=empreendedorismo" className="text-gray-700 hover:text-pink-500">
                    Empreendedorismo
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=gestao" className="text-gray-700 hover:text-pink-500">
                    Gestão de Clínicas
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

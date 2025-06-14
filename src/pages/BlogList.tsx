import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { newsItems, getAllCategories } from "../data/news";

const BlogList: React.FC = () => {
  const categories = getAllCategories();
  const featuredPost = newsItems[0]; // Primeiro post como destaque
  const regularPosts = newsItems.slice(1); // Demais posts
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="pb-16 relative">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('${isMobile ? '/images/hero-background-mobile.png' : '/images/hero-background-web.png'}')` 
        }}>
        {/* Overlay para garantir a legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-purple-900/80 backdrop-blur-sm"></div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-pink-300 rounded-full opacity-10 z-0 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300 rounded-full opacity-10 z-0 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-200">
              Postagens recentes
            </h1>
            <p className="text-lg text-white/90">
              Acompanhe nossas postagens, atualizações do meio da beleza e conteúdos práticos.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Post */}
              {featuredPost && (
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={featuredPost.coverImage} 
                      alt={featuredPost.title} 
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <div className="mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm border border-pink-100">
                          {featuredPost.category.name}
                        </span>
                        <span className="ml-3 text-gray-500 text-sm">{featuredPost.publishedAt}</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        <Link to={`/blog/${featuredPost.slug}`} className="hover:text-pink-500">
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center">
                        {featuredPost.author.avatar ? (
                          <img 
                            src={featuredPost.author.avatar} 
                            alt={featuredPost.author.name} 
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium text-sm">{featuredPost.author.initials}</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-sm">{featuredPost.author.name}</h3>
                          <p className="text-xs text-gray-500">{featuredPost.author.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              {regularPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-pink-800 backdrop-blur-sm border border-pink-100">
                        {post.category.name}
                      </span>
                      <span className="ml-3 text-gray-500 text-sm">{post.publishedAt}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-pink-500">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`} 
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
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-2">
                <a href="#" className="px-4 py-2 border rounded-md text-gray-500 bg-white hover:bg-gray-50">
                  Anterior
                </a>
                <a href="#" className="px-4 py-2 border rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  1
                </a>
                <a href="#" className="px-4 py-2 border rounded-md text-gray-500 bg-white hover:bg-gray-50">
                  2
                </a>
                <a href="#" className="px-4 py-2 border rounded-md text-gray-500 bg-white hover:bg-gray-50">
                  3
                </a>
                <a href="#" className="px-4 py-2 border rounded-md text-gray-500 bg-white hover:bg-gray-50">
                  Próxima
                </a>
              </nav>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Categorias</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link 
                      to={`/blog?category=${category.slug}`} 
                      className="text-gray-700 hover:text-pink-500"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl shadow-md border border-pink-100 mb-8">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">Posts Populares</h3>
              <div className="space-y-6">
                {newsItems.slice(0, 2).map((post) => (
                  <div key={post.id} className="flex items-start">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-16 h-16 object-cover rounded mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        <Link to={`/blog/${post.slug}`} className="hover:text-pink-500">
                          {post.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-gray-500">{post.publishedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
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

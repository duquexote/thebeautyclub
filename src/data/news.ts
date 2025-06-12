export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: {
    name: string;
    slug: string;
  };
  coverImage: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
    initials?: string;
  };
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "posicionamento",
    title: "Posicionamento: Como ele impacta no seu valor?",
    excerpt: "Posicionamento é a maneira como você — enquanto profissional da beleza — é enxergado pelo mercado e pelos clientes.",
    content: `
  <p class="lead">
    No universo da beleza, o talento é indispensável, mas quem deseja crescer e cobrar o preço que merece precisa olhar além da tesoura, pinças e escovas. Seja você dono de um salão, profissional que trabalha para terceiros ou que atende em domicílio, um fator é vital: o seu posicionamento. E marcas que se valorizam podem (e devem) cobrar mais porque entregam valor percebido.
  </p>

  <h2>O Que É Posicionamento e Por Que Ele Impacta No Seu Valor?</h2>
  <p>
    Posicionamento é a maneira como você — enquanto profissional da beleza — é enxergado pelo mercado e pelos clientes. Uma pessoa bem posicionada é reconhecida não só pela técnica, mas por todo o conjunto da sua marca: experiência, atendimento, apresentação, ambiente, relações e reputação.
  </p>
  <p>
    Cobrar mais não é apenas aumentar números: é entregar um pacote de valor que conquista, encanta e faz o cliente enxergar que o investimento vale a pena — não importa onde o serviço aconteça.
  </p>

  <h2>Imagem Pessoal: Você É o Seu Próprio Cartão de Visitas</h2>
  <p>
    Independentemente de onde atende, sua imagem e postura dizem muito sobre sua marca pessoal. Mostre cuidado consigo, utilize roupas adequadas ao público que deseja atrair, invista em higiene e demonstre autoconfiança. O modo como você se apresenta inspira credibilidade e segurança, seja num salão sofisticado ou no conforto de casa da cliente.
  </p>
  <p>
    <strong>Dica:</strong> Fotos profissionais valorizam seu material para o portfólio e para as redes sociais. Não importa o cenário, mostrar-se como especialista faz toda a diferença!
  </p>

  <h2>Experiência do Cliente: Cative em Cada Detalhe</h2>
  <p>
    O posicionamento se constrói em todos os detalhes: o primeiro contato no WhatsApp, a simpatia no atendimento, a pontualidade, os produtos usados, as mensagens de acompanhamento, a atenção oferecida, o ambiente (seja um salão decorado, um espaço compartilhado ou a sala da sua cliente).
  </p>
  <ul>
    <li>Surpreenda com pequenos mimos ou uma mensagem de agradecimento personalizada.</li>
    <li>Seja atencioso com os horários e busque sempre ouvir o que a cliente realmente deseja.</li>
    <li>Personalize o serviço para cada cliente, mostrando atenção especial.</li>
  </ul>

  <h2>Redes Sociais: Seus Serviços São a Sua Vitrine</h2>
  <p>
    Instagram, WhatsApp, TikTok: não importa a plataforma, o importante é estar presente e saber comunicar o seu valor. Use suas redes como vitrine do seu trabalho, mostrando não só resultados (como antes e depois), mas também os bastidores, depoimentos de clientes satisfeitas e seu método de atendimento.
  </p>
  <ul>
    <li>Defina uma identidade visual marcante e alinhada ao público-alvo.</li>
    <li>Compartilhe conteúdos didáticos, demonstrando seu conhecimento.</li>
    <li>Mostre seu dia a dia, criando uma conexão real com os seguidores.</li>
    <li>Se possível, invista em anúncios para atingir potenciais clientes na sua região.</li>
  </ul>

  <h2>Posicione Seu Catálogo de Serviços</h2>
  <p>
    Valorize o que você faz transformando o nome e a apresentação dos serviços. Evite descrições genéricas e crie experiências: “Corte Premium”, “Coloração Personalizada”, “Atendimento Express em Domicílio” — seja criativo!
  </p>
  <p>
    As palavras certas fazem o cliente entender que está vivendo algo único, justificando um preço diferenciado.
  </p>

  <h2>Comunicação Clara e Confiança ao Ajustar Preços</h2>
  <p>
    Quando chegar o momento de reajustar valores, comunique sempre de forma transparente. Mostre o quanto você investe em capacitação, produtos de qualidade, novidades e entregas exclusivas.
  </p>
  <ul>
    <li>Avise com antecedência e mostre as melhorias do serviço.</li>
    <li>Transmita convicção e confiança — clientes valorizam sua segurança.</li>
    <li>Lembre: quem busca só preço baixo dificilmente valoriza qualidade. Foque em clientes que procuram valor agregado.</li>
  </ul>

  <h2>Relacionamento é Tudo</h2>
  <p>
    Clientes satisfeitas voltam, indicam e pagam mais por você. Crie estratégias de relacionamento, ofereça vantagens para indicações, promoções pontuais, lembretes de manutenção e mantenha contato mesmo fora das datas de visita.
  </p>

  <h2>Resumindo: Todos São Uma Marca, Em Qualquer Cenário</h2>
  <p>
    Seja num salão, atendendo em espaços compartilhados ou levando beleza até a casa das clientes, é possível criar valor e aumentar os preços quando você se posiciona de forma estratégica. Invista na sua imagem, na experiência, na comunicação nas redes, no relacionamento. Tudo isso faz a diferença!
  </p>
`,
    category: {
      name: "Posicionamento",
      slug: "posicionamento"
    },
    coverImage: "/images/hero-background-web.png",
    publishedAt: "12 de Junho, 2025",
    author: {
      name: "The Beauty Club",
      role: "Posicionamento",
      initials: "TBC"
    }
  },
  {
    id: "2",
    slug: "posicionamento",
    title: "Posicionamento: Como ele impacta no seu valor?",
    excerpt: "Posicionamento é a maneira como você — enquanto profissional da beleza — é enxergado pelo mercado e pelos clientes.",
    content: `
  <p class="lead">
    No universo da beleza, o talento é indispensável, mas quem deseja crescer e cobrar o preço que merece precisa olhar além da tesoura, pinças e escovas. Seja você dono de um salão, profissional que trabalha para terceiros ou que atende em domicílio, um fator é vital: o seu posicionamento. E marcas que se valorizam podem (e devem) cobrar mais porque entregam valor percebido.
  </p>

  <h2>O Que É Posicionamento e Por Que Ele Impacta No Seu Valor?</h2>
  <p>
    Posicionamento é a maneira como você — enquanto profissional da beleza — é enxergado pelo mercado e pelos clientes. Uma pessoa bem posicionada é reconhecida não só pela técnica, mas por todo o conjunto da sua marca: experiência, atendimento, apresentação, ambiente, relações e reputação.
  </p>
  <p>
    Cobrar mais não é apenas aumentar números: é entregar um pacote de valor que conquista, encanta e faz o cliente enxergar que o investimento vale a pena — não importa onde o serviço aconteça.
  </p>

  <h2>Imagem Pessoal: Você É o Seu Próprio Cartão de Visitas</h2>
  <p>
    Independentemente de onde atende, sua imagem e postura dizem muito sobre sua marca pessoal. Mostre cuidado consigo, utilize roupas adequadas ao público que deseja atrair, invista em higiene e demonstre autoconfiança. O modo como você se apresenta inspira credibilidade e segurança, seja num salão sofisticado ou no conforto de casa da cliente.
  </p>
  <p>
    <strong>Dica:</strong> Fotos profissionais valorizam seu material para o portfólio e para as redes sociais. Não importa o cenário, mostrar-se como especialista faz toda a diferença!
  </p>

  <h2>Experiência do Cliente: Cative em Cada Detalhe</h2>
  <p>
    O posicionamento se constrói em todos os detalhes: o primeiro contato no WhatsApp, a simpatia no atendimento, a pontualidade, os produtos usados, as mensagens de acompanhamento, a atenção oferecida, o ambiente (seja um salão decorado, um espaço compartilhado ou a sala da sua cliente).
  </p>
  <ul>
    <li>Surpreenda com pequenos mimos ou uma mensagem de agradecimento personalizada.</li>
    <li>Seja atencioso com os horários e busque sempre ouvir o que a cliente realmente deseja.</li>
    <li>Personalize o serviço para cada cliente, mostrando atenção especial.</li>
  </ul>

  <h2>Redes Sociais: Seus Serviços São a Sua Vitrine</h2>
  <p>
    Instagram, WhatsApp, TikTok: não importa a plataforma, o importante é estar presente e saber comunicar o seu valor. Use suas redes como vitrine do seu trabalho, mostrando não só resultados (como antes e depois), mas também os bastidores, depoimentos de clientes satisfeitas e seu método de atendimento.
  </p>
  <ul>
    <li>Defina uma identidade visual marcante e alinhada ao público-alvo.</li>
    <li>Compartilhe conteúdos didáticos, demonstrando seu conhecimento.</li>
    <li>Mostre seu dia a dia, criando uma conexão real com os seguidores.</li>
    <li>Se possível, invista em anúncios para atingir potenciais clientes na sua região.</li>
  </ul>

  <h2>Posicione Seu Catálogo de Serviços</h2>
  <p>
    Valorize o que você faz transformando o nome e a apresentação dos serviços. Evite descrições genéricas e crie experiências: “Corte Premium”, “Coloração Personalizada”, “Atendimento Express em Domicílio” — seja criativo!
  </p>
  <p>
    As palavras certas fazem o cliente entender que está vivendo algo único, justificando um preço diferenciado.
  </p>

  <h2>Comunicação Clara e Confiança ao Ajustar Preços</h2>
  <p>
    Quando chegar o momento de reajustar valores, comunique sempre de forma transparente. Mostre o quanto você investe em capacitação, produtos de qualidade, novidades e entregas exclusivas.
  </p>
  <ul>
    <li>Avise com antecedência e mostre as melhorias do serviço.</li>
    <li>Transmita convicção e confiança — clientes valorizam sua segurança.</li>
    <li>Lembre: quem busca só preço baixo dificilmente valoriza qualidade. Foque em clientes que procuram valor agregado.</li>
  </ul>

  <h2>Relacionamento é Tudo</h2>
  <p>
    Clientes satisfeitas voltam, indicam e pagam mais por você. Crie estratégias de relacionamento, ofereça vantagens para indicações, promoções pontuais, lembretes de manutenção e mantenha contato mesmo fora das datas de visita.
  </p>

  <h2>Resumindo: Todos São Uma Marca, Em Qualquer Cenário</h2>
  <p>
    Seja num salão, atendendo em espaços compartilhados ou levando beleza até a casa das clientes, é possível criar valor e aumentar os preços quando você se posiciona de forma estratégica. Invista na sua imagem, na experiência, na comunicação nas redes, no relacionamento. Tudo isso faz a diferença!
  </p>
`,
    category: {
      name: "Posicionamento",
      slug: "posicionamento"
    },
    coverImage: "/images/hero-background-web.png",
    publishedAt: "12 de Junho, 2025",
    author: {
      name: "The Beauty Club",
      role: "Posicionamento",
      initials: "TBC"
    }
  },
  {
    id: "3",
    slug: "posicionamento",
    title: "Posicionamento: Como ele impacta no seu valor?",
    excerpt: "Posicionamento é a maneira como você — enquanto profissional da beleza — é enxergado pelo mercado e pelos clientes.",
    content: `
  <p class="lead">
    No universo da beleza, o talento é indispensável, mas quem deseja crescer e cobrar o preço que merece precisa olhar além da tesoura, pinças e escovas. Seja você dono de um salão, profissional que trabalha para terceiros ou que atende em domicílio, um fator é vital: o seu posicionamento. E marcas que se valorizam podem (e devem) cobrar mais porque entregam valor percebido.
  </p>

  <h2>O Que É Posicionamento e Por Que Ele Impacta No Seu Valor?</h2>
  <p>
    Posicionamento é a maneira como você — enquanto profissional da beleza — é enxergado pelo mercado e pelos clientes. Uma pessoa bem posicionada é reconhecida não só pela técnica, mas por todo o conjunto da sua marca: experiência, atendimento, apresentação, ambiente, relações e reputação.
  </p>
  <p>
    Cobrar mais não é apenas aumentar números: é entregar um pacote de valor que conquista, encanta e faz o cliente enxergar que o investimento vale a pena — não importa onde o serviço aconteça.
  </p>

  <h2>Imagem Pessoal: Você É o Seu Próprio Cartão de Visitas</h2>
  <p>
    Independentemente de onde atende, sua imagem e postura dizem muito sobre sua marca pessoal. Mostre cuidado consigo, utilize roupas adequadas ao público que deseja atrair, invista em higiene e demonstre autoconfiança. O modo como você se apresenta inspira credibilidade e segurança, seja num salão sofisticado ou no conforto de casa da cliente.
  </p>
  <p>
    <strong>Dica:</strong> Fotos profissionais valorizam seu material para o portfólio e para as redes sociais. Não importa o cenário, mostrar-se como especialista faz toda a diferença!
  </p>

  <h2>Experiência do Cliente: Cative em Cada Detalhe</h2>
  <p>
    O posicionamento se constrói em todos os detalhes: o primeiro contato no WhatsApp, a simpatia no atendimento, a pontualidade, os produtos usados, as mensagens de acompanhamento, a atenção oferecida, o ambiente (seja um salão decorado, um espaço compartilhado ou a sala da sua cliente).
  </p>
  <ul>
    <li>Surpreenda com pequenos mimos ou uma mensagem de agradecimento personalizada.</li>
    <li>Seja atencioso com os horários e busque sempre ouvir o que a cliente realmente deseja.</li>
    <li>Personalize o serviço para cada cliente, mostrando atenção especial.</li>
  </ul>

  <h2>Redes Sociais: Seus Serviços São a Sua Vitrine</h2>
  <p>
    Instagram, WhatsApp, TikTok: não importa a plataforma, o importante é estar presente e saber comunicar o seu valor. Use suas redes como vitrine do seu trabalho, mostrando não só resultados (como antes e depois), mas também os bastidores, depoimentos de clientes satisfeitas e seu método de atendimento.
  </p>
  <ul>
    <li>Defina uma identidade visual marcante e alinhada ao público-alvo.</li>
    <li>Compartilhe conteúdos didáticos, demonstrando seu conhecimento.</li>
    <li>Mostre seu dia a dia, criando uma conexão real com os seguidores.</li>
    <li>Se possível, invista em anúncios para atingir potenciais clientes na sua região.</li>
  </ul>

  <h2>Posicione Seu Catálogo de Serviços</h2>
  <p>
    Valorize o que você faz transformando o nome e a apresentação dos serviços. Evite descrições genéricas e crie experiências: “Corte Premium”, “Coloração Personalizada”, “Atendimento Express em Domicílio” — seja criativo!
  </p>
  <p>
    As palavras certas fazem o cliente entender que está vivendo algo único, justificando um preço diferenciado.
  </p>

  <h2>Comunicação Clara e Confiança ao Ajustar Preços</h2>
  <p>
    Quando chegar o momento de reajustar valores, comunique sempre de forma transparente. Mostre o quanto você investe em capacitação, produtos de qualidade, novidades e entregas exclusivas.
  </p>
  <ul>
    <li>Avise com antecedência e mostre as melhorias do serviço.</li>
    <li>Transmita convicção e confiança — clientes valorizam sua segurança.</li>
    <li>Lembre: quem busca só preço baixo dificilmente valoriza qualidade. Foque em clientes que procuram valor agregado.</li>
  </ul>

  <h2>Relacionamento é Tudo</h2>
  <p>
    Clientes satisfeitas voltam, indicam e pagam mais por você. Crie estratégias de relacionamento, ofereça vantagens para indicações, promoções pontuais, lembretes de manutenção e mantenha contato mesmo fora das datas de visita.
  </p>

  <h2>Resumindo: Todos São Uma Marca, Em Qualquer Cenário</h2>
  <p>
    Seja num salão, atendendo em espaços compartilhados ou levando beleza até a casa das clientes, é possível criar valor e aumentar os preços quando você se posiciona de forma estratégica. Invista na sua imagem, na experiência, na comunicação nas redes, no relacionamento. Tudo isso faz a diferença!
  </p>
`,
    category: {
      name: "Posicionamento",
      slug: "posicionamento"
    },
    coverImage: "/images/hero-background-web.png",
    publishedAt: "12 de Junho, 2025",
    author: {
      name: "The Beauty Club",
      role: "Posicionamento",
      initials: "TBC"
    }
  }
];

// Função para obter todas as categorias únicas
export const getAllCategories = () => {
  const categories = newsItems.map(item => item.category);
  return Array.from(new Map(categories.map(item => [item.slug, item])).values());
};

// Função para obter um artigo pelo slug
export const getNewsBySlug = (slug: string): NewsItem | undefined => {
  return newsItems.find(item => item.slug === slug);
};

// Função para obter artigos relacionados (mesma categoria, excluindo o atual)
export const getRelatedNews = (currentSlug: string, limit: number = 3): NewsItem[] => {
  const currentNews = getNewsBySlug(currentSlug);
  if (!currentNews) return [];
  
  return newsItems
    .filter(item => item.slug !== currentSlug && item.category.slug === currentNews.category.slug)
    .slice(0, limit);
};

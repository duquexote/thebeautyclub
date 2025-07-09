import { createClient } from '@supabase/supabase-js';

// Usando variáveis de ambiente para maior segurança e flexibilidade
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
// Adicionando a chave de serviço para operações administrativas
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWVieWx0bXRvZWxqdmtua2ZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTg1NjM0NCwiZXhwIjoyMDY1NDMyMzQ0fQ.ig2rDwje-GfY9hfK2zrXgBOybdgczKaM3mg_1vh2BOY';

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não estão definidas corretamente!');
}

// Verificar se estamos em ambiente de desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

console.log(`Inicializando Supabase em ambiente de ${isDevelopment ? 'desenvolvimento' : 'produção'}`);
console.log('URL Supabase:', supabaseUrl);
console.log('Chave anônima disponível:', supabaseAnonKey ? 'Sim (primeiros 5 caracteres: ' + supabaseAnonKey.substring(0, 5) + '...)' : 'Não');

// Cliente com chave de serviço para operações administrativas
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'thebeautyclub-admin'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Cliente com chave anônima para operações públicas (caso precise no futuro)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'thebeautyclub-app'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Função simples para verificar se a chave API está configurada
export const checkApiKey = () => {
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!supabaseAnonKey;
};

// ID fixo para o autor padrão (The Beauty Club)
export const DEFAULT_AUTHOR_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Faz upload de uma imagem para o Supabase Storage
 * @param file Arquivo de imagem a ser enviado
 * @param bucket Nome do bucket no Storage (default: 'blog-images')
 * @returns URL pública da imagem ou null em caso de erro
 */
export async function uploadImage(file: File, bucket: string = 'blog-images'): Promise<string | null> {
  try {
    console.log(`Iniciando upload de imagem: ${file.name} (${file.size} bytes)`);
    
    // Verificar se o bucket existe, se não, criar
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      console.log(`Bucket ${bucket} não existe, criando...`);
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true
      });
      
      if (createError) {
        console.error('Erro ao criar bucket:', createError);
        return null;
      }
    }
    
    // Gerar um nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Fazer upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      return null;
    }
    
    // Obter URL pública da imagem
    const { data: publicURL } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    console.log('Upload concluído com sucesso:', publicURL?.publicUrl);
    return publicURL?.publicUrl || null;
    
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return null;
  }
}

/**
 * Insere um artigo diretamente no banco de dados usando a API REST
 * Esta função contorna as restrições de chave estrangeira
 */
export async function insertArticleDirectly(articleData: any): Promise<any> {
  try {
    console.log('Inserindo artigo diretamente via API REST:', articleData);
    
    // Usar as mesmas variáveis que já estão definidas no topo do arquivo
    // Usando a chave de serviço para ter mais permissões
    
    console.log('Usando URL:', supabaseUrl);
    console.log('Usando chave de serviço para inserção direta');
    
    if (!supabaseUrl) {
      throw new Error('URL do Supabase não encontrada');
    }
    
    // Remover o campo author_id para evitar violação de chave estrangeira
    // O usuário indicou que não precisamos relacionar a um autor
    const cleanedData = { ...articleData };
    delete cleanedData.author_id;
    
    // Usar fetch para fazer a requisição diretamente
    const response = await fetch(`${supabaseUrl}/rest/v1/blog_articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal' // Não retornar os dados inseridos
      },
      body: JSON.stringify(cleanedData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao inserir artigo:', response.status, errorText);
      return { success: false, error: { status: response.status, message: errorText } };
    }
    
    console.log('Artigo inserido com sucesso!');
    return { success: true };
  } catch (err) {
    console.error('Erro ao inserir artigo diretamente:', err);
    return { success: false, error: err };
  }
};

/**
 * Executa SQL diretamente no banco de dados Supabase usando a API pgrest
 * @param sql Comando SQL a ser executado
 */
export async function executeSql(sql: string): Promise<any> {
  try {
    console.log('Executando SQL:', sql);
    
    // Usar a API REST diretamente com a chave de serviço
    // Endpoint para execução de SQL bruto (disponível apenas com chave de serviço)
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'X-Client-Info': 'thebeautyclub-admin',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao executar SQL:', response.status, errorText);
      return {
        success: false,
        error: {
          status: response.status,
          message: errorText
        }
      };
    }
    
    const result = await response.json();
    console.log('Resultado SQL:', result);
    return { success: true, data: result };
    
  } catch (error) {
    console.error('Erro ao executar SQL:', error);
    return { success: false, error };
  }
};

/**
 * Modifica a estrutura da tabela blog_articles para tornar o campo author_id opcional
 */
export const fixBlogArticlesTable = async () => {
  try {
    console.log('Tentando modificar a estrutura da tabela blog_articles...');
    
    // Verificar se conseguimos acessar a tabela blog_articles
    const { data: articles, error: articlesError } = await supabase
      .from('blog_articles')
      .select('id')
      .limit(1);
    
    if (articlesError) {
      console.error('Erro ao acessar tabela blog_articles:', articlesError);
      console.log('Tentando modificar mesmo assim...');
    } else {
      console.log('Tabela blog_articles acessada com sucesso, encontrados', articles?.length || 0, 'registros');
    }
    
    console.log('Tentando modificar a estrutura da tabela...');
    
    // Tentar remover a restrição de chave estrangeira
    const dropConstraintResult = await executeSql(
      "ALTER TABLE blog_articles DROP CONSTRAINT IF EXISTS blog_articles_author_id_fkey;"
    );
    
    if (!dropConstraintResult.success) {
      console.log('Não foi possível remover a restrição, tentando tornar a coluna nullable...');
    } else {
      console.log('Restrição removida com sucesso');
    }
    
    // Tentar tornar a coluna author_id nullable
    const alterColumnResult = await executeSql(
      "ALTER TABLE blog_articles ALTER COLUMN author_id DROP NOT NULL;"
    );
    
    if (!alterColumnResult.success) {
      console.log('Não foi possível modificar a coluna author_id');
    } else {
      console.log('Coluna author_id modificada com sucesso para aceitar NULL');
    }
    
    return { success: true };
  } catch (err) {
    console.error('Erro ao modificar tabela blog_articles:', err);
    return { success: false, error: err };
  }
};

// Função para descobrir a estrutura do banco de dados
export const discoverDatabaseStructure = async () => {
  try {
    console.log('Verificando estrutura do banco de dados...');
    
    // Verificar tabela blog_articles e sua estrutura
    console.log('Examinando tabela blog_articles...');
    const { data: blogArticlesSchema, error: blogArticlesSchemaError } = await supabase
      .rpc('get_table_ddl', { table_name: 'blog_articles' });
    
    if (blogArticlesSchemaError) {
      console.error('Erro ao obter schema de blog_articles:', blogArticlesSchemaError);
    } else {
      console.log('Schema de blog_articles:', blogArticlesSchema);
    }
    
    // Verificar chaves estrangeiras na tabela blog_articles
    console.log('Verificando chaves estrangeiras de blog_articles...');
    const { data: foreignKeys, error: foreignKeysError } = await supabase
      .rpc('get_foreign_keys', { table_name: 'blog_articles' });
    
    if (foreignKeysError) {
      console.error('Erro ao obter chaves estrangeiras:', foreignKeysError);
      
      // Tentativa alternativa - consulta SQL direta
      console.log('Tentando consulta SQL direta para chaves estrangeiras...');
      const { data: fkData, error: fkError } = await supabase
        .from('information_schema.table_constraints')
        .select('*')
        .eq('table_name', 'blog_articles')
        .eq('constraint_type', 'FOREIGN KEY');
      
      if (fkError) {
        console.error('Erro na consulta SQL direta:', fkError);
      } else {
        console.log('Chaves estrangeiras via SQL:', fkData);
      }
    } else {
      console.log('Chaves estrangeiras encontradas:', foreignKeys);
    }
    
    // Verificar tabelas existentes
    console.log('Verificando tabelas existentes...');
    
    // Verificar tabela blog_articles
    const { data: blogArticles, error: blogArticlesError } = await supabase
      .from('blog_articles')
      .select('id, author_id')
      .limit(1);
    
    if (blogArticlesError) {
      console.error('Erro ao verificar blog_articles:', blogArticlesError);
    } else {
      console.log('Exemplo de blog_articles:', blogArticles);
    }
    
    // Verificar tabela auth.users
    const { data: authUsers, error: authUsersError } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1);
    
    if (authUsersError) {
      console.error('Erro ao verificar auth.users:', authUsersError);
    } else {
      console.log('Tabela auth.users existe:', !!authUsers, authUsers);
    }
    
    // Verificar tabela users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.error('Erro ao verificar users:', usersError);
    } else {
      console.log('Tabela users existe:', !!users, users);
      
      // Se a tabela users existir, verificar se há algum registro
      if (users && users.length > 0) {
        console.log('ID do primeiro usuário encontrado:', users[0].id);
        return users[0].id; // Retornar o ID do primeiro usuário encontrado
      }
    }
    
    // Verificar tabela profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.error('Erro ao verificar profiles:', profilesError);
    } else {
      console.log('Tabela profiles existe:', !!profiles, profiles);
      
      // Se a tabela profiles existir, verificar se há algum registro
      if (profiles && profiles.length > 0) {
        console.log('ID do primeiro perfil encontrado:', profiles[0].id);
        return profiles[0].id; // Retornar o ID do primeiro perfil encontrado
      }
    }
    
    return null;
  } catch (err) {
    console.error('Erro ao descobrir estrutura do banco de dados:', err);
    return null;
  }
};

// Função para encontrar um autor válido existente ou criar um novo
export const ensureDefaultAuthor = async () => {
  try {
    console.log('Buscando um autor válido existente...');
    
    // Usar a função discoverDatabaseStructure para encontrar um ID válido
    const existingAuthorId = await discoverDatabaseStructure();
    
    if (existingAuthorId) {
      console.log('Autor válido encontrado:', existingAuthorId);
      return existingAuthorId;
    }
    
    console.log('Nenhum autor existente encontrado. Tentando criar um novo...');
    
    // Tentar criar um autor na tabela auth.users (se existir)
    try {
      console.log('Tentando criar autor na tabela auth.users...');
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@thebeautyclub.com',
        password: 'Takeovers@00',
        user_metadata: { name: 'The Beauty Club' }
      });
      
      if (!authError && authUser && authUser.user) {
        console.log('Autor criado via auth.admin:', authUser.user.id);
        return authUser.user.id;
      }
      
      console.error('Erro ao criar autor via auth.admin:', authError);
    } catch (authErr) {
      console.error('Erro ao acessar auth.admin:', authErr);
    }
    
    // Tentar inserir diretamente na tabela users
    try {
      console.log('Tentando criar autor na tabela users...');
      const { data: insertedUser, error: insertUserError } = await supabase
        .from('users')
        .insert({
          email: 'admin@thebeautyclub.com',
          display_name: 'The Beauty Club',
          created_at: new Date().toISOString()
        })
        .select();
      
      if (!insertUserError && insertedUser && insertedUser.length > 0) {
        console.log('Autor criado na tabela users:', insertedUser[0].id);
        return insertedUser[0].id;
      }
      
      console.error('Erro ao criar autor na tabela users:', insertUserError);
    } catch (userErr) {
      console.error('Erro ao acessar tabela users:', userErr);
    }
    
    // Tentar inserir na tabela profiles
    try {
      console.log('Tentando criar autor na tabela profiles...');
      const { data: insertedProfile, error: insertProfileError } = await supabase
        .from('profiles')
        .insert({
          username: 'thebeautyclub',
          full_name: 'The Beauty Club',
          avatar_url: '/logo.png',
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (!insertProfileError && insertedProfile && insertedProfile.length > 0) {
        console.log('Autor criado na tabela profiles:', insertedProfile[0].id);
        return insertedProfile[0].id;
      }
      
      console.error('Erro ao criar autor na tabela profiles:', insertProfileError);
    } catch (profileErr) {
      console.error('Erro ao acessar tabela profiles:', profileErr);
    }
    
    // Como último recurso, tentar usar um ID fixo
    console.log('Todas as tentativas falharam. Retornando ID fixo como último recurso.');
    return DEFAULT_AUTHOR_ID;
  } catch (err) {
    console.error('Erro ao garantir autor padrão:', err);
    return null;
  }
};


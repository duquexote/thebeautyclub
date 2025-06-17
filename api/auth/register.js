// API serverless para criar usuários com email confirmado
import { createClient } from '@supabase/supabase-js';

// Função para criar o cliente Supabase Admin
const createAdminClient = () => {
  // Obter variáveis de ambiente
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Variáveis de ambiente do Supabase não definidas');
    throw new Error('Configuração do servidor incompleta');
  }
  
  // Criar cliente com chave de serviço (acesso admin)
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Handler da API
export default async function handler(req, res) {
  // Permitir apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Extrair dados do corpo da requisição
    const { email, password, userData } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email e senha são obrigatórios' 
      });
    }
    
    console.log('Criando usuário com email confirmado:', { email, userData });
    
    // Criar cliente Supabase Admin
    const supabaseAdmin = createAdminClient();
    
    // Criar usuário com email já confirmado
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        nome: userData?.nome || '',
        sobrenome: userData?.sobrenome || ''
      }
    });
    
    if (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    // Retornar dados do usuário criado
    return res.status(200).json({ 
      success: true, 
      data 
    });
    
  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
}

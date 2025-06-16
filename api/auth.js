// API serverless para autenticação
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com chave de serviço
const supabaseUrl = process.env.SUPABASE_URL || 'https://xpyebyltmtoeljvknkfd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar se a chave de serviço está definida
if (!supabaseServiceKey) {
  console.error('ERRO: SUPABASE_SERVICE_KEY não está definida no ambiente!');
}

console.log('API Auth - URL Supabase:', supabaseUrl);
console.log('API Auth - Chave de serviço definida:', !!supabaseServiceKey);

// Cliente Supabase com chave de serviço
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responder a requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas permitir POST para autenticação
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, action } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    let result;

    // Ações de autenticação
    switch (action) {
      case 'login':
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });
        break;
      
      case 'signup':
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${req.headers.origin}/login`,
          }
        });
        break;
        
      default:
        return res.status(400).json({ error: 'Ação inválida' });
    }

    // Retornar resultado
    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Erro na API de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

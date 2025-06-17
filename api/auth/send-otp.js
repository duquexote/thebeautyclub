// API serverless para enviar código OTP via WhatsApp
import crypto from 'crypto';

// Função para gerar um código OTP de 6 dígitos
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Função para criar um hash do OTP com o número de telefone como salt
const hashOTP = (otp, phoneNumber) => {
  return crypto
    .createHmac('sha256', process.env.OTP_SECRET || 'thebeautyclub-secret')
    .update(`${otp}:${phoneNumber}`)
    .digest('hex');
};

// Handler da API
export default async function handler(req, res) {
  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Obter o número do corpo da requisição
    const { number } = req.body;
    
    if (!number) {
      return res.status(400).json({ error: 'Número de telefone não fornecido' });
    }
    
    // Gerar código OTP
    const otp = generateOTP();
    
    // Obter a chave da API das variáveis de ambiente
    const apiKey = process.env.TAKEOVERS_API_KEY;
    
    if (!apiKey) {
      console.error('API key não encontrada nas variáveis de ambiente');
      return res.status(500).json({ error: 'Configuração do servidor incompleta' });
    }
    
    // Enviar o código OTP via WhatsApp
    const response = await fetch('https://evo2.takeovers.com.br/message/sendText/thebeautyclub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: number,
        text: `Seu código de verificação para The Beauty Club é: ${otp}. Válido por 5 minutos.`
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar OTP:', errorData);
      return res.status(response.status).json({ 
        error: 'Erro ao enviar código de verificação', 
        details: errorData 
      });
    }
    
    // Calcular o tempo de expiração (5 minutos a partir de agora)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    
    // Criar um hash do OTP com o número de telefone como parte do salt
    const otpHash = hashOTP(otp, number);
    
    // Retornar o hash do OTP em vez do OTP em si
    // Em produção, seria melhor armazenar no banco de dados
    return res.status(200).json({ 
      success: true, 
      otpHash: otpHash,
      expiresAt: expiresAt.toISOString(),
      nextAllowedAt: new Date(Date.now() + 40000).toISOString() // 40 segundos a partir de agora
    });
    
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

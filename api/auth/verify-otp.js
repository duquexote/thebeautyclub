// API serverless para verificar código OTP
import crypto from 'crypto';

// Função para criar um hash do OTP com o número de telefone como salt
const hashOTP = (otp, phoneNumber) => {
  return crypto
    .createHmac('sha256', process.env.OTP_SECRET || 'thebeautyclub-secret')
    .update(`${otp}:${phoneNumber}`)
    .digest('hex');
};

export default async function handler(req, res) {
  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Obter o número de telefone, o hash do OTP armazenado e o código fornecido pelo usuário
    const { number, otp: userOtp, otpHash } = req.body;
    
    if (!number || !userOtp || !otpHash) {
      return res.status(400).json({ error: 'Informações incompletas para verificação' });
    }
    
    // Calcular o hash do código fornecido pelo usuário
    const calculatedHash = hashOTP(userOtp, number);
    
    // Verificar se o hash calculado corresponde ao hash armazenado
    const valid = calculatedHash === otpHash;
    
    // Retornar o resultado da verificação
    return res.status(200).json({ 
      success: true, 
      valid: valid
    });
    
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

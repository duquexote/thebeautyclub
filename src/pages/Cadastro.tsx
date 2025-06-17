import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, createUserWithConfirmedEmail } from '../utils/supabaseClient';

// Etapas do cadastro
enum EtapaCadastro {
  VERIFICAR_NUMERO = 0,
  VERIFICAR_OTP = 1,
  CADASTRO_SIMPLIFICADO = 2,
  CADASTRO_COMPLETO_NOME = 3,
  CADASTRO_COMPLETO_EMAIL = 4,
  CADASTRO_COMPLETO_CERTIFICADO = 5,
  CADASTRO_COMPLETO_NUMERO = 6,
  CADASTRO_COMPLETO_SENHA = 7
}

export default function Cadastro() {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState<EtapaCadastro>(EtapaCadastro.VERIFICAR_NUMERO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para OTP
  const [userOtp, setUserOtp] = useState<string>('');
  const [otpHash, setOtpHash] = useState<string>('');
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [nextOtpAllowed, setNextOtpAllowed] = useState<Date | null>(null);
  const [sociaEncontrada, setSociaEncontrada] = useState<any>(null);
  
  // Dados do formulário
  const [numero, setNumero] = useState('');
  
  // Dados para cadastro simplificado e completo
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  // Estado para senha e confirmação de senha
  const [senha, setSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [usarCnpj, setUsarCnpj] = useState(false);
  const [cnpj, setCnpj] = useState('');
  const [certificado, setCertificado] = useState<File | null>(null);
  const [certificadoValidado, setCertificadoValidado] = useState(false);
  const [cadastroCompleto, setCadastroCompleto] = useState<{
    nome: string;
    sobrenome: string;
    email: string;
    confirmarEmail: string;
    numero: string;
    senha: string;
    confirmarSenha: string;
    cnpj?: string;
    certificado?: File | null;
  }>({nome: '', sobrenome: '', email: '', confirmarEmail: '', numero: '', senha: '', confirmarSenha: ''});
  
  // Função para enviar código OTP via WhatsApp
  const enviarCodigoOTP = async (numeroTelefone: string) => {
    try {
      setLoading(true);
      
      // Verificar se já pode enviar um novo código
      if (nextOtpAllowed && new Date() < nextOtpAllowed) {
        const segundosRestantes = Math.ceil((nextOtpAllowed.getTime() - new Date().getTime()) / 1000);
        setError(`Aguarde ${segundosRestantes} segundos para enviar um novo código.`);
        return false;
      }
      
      // Chamar a API para enviar o código OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: numeroTelefone })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar código de verificação');
      }
      
      // Armazenar o hash OTP e o tempo de expiração
      setOtpHash(data.otpHash);
      setOtpExpiry(new Date(data.expiresAt));
      setNextOtpAllowed(new Date(data.nextAllowedAt));
      
      console.log('Código OTP enviado com sucesso');
      return true;
    } catch (error: any) {
      console.error('Erro ao enviar código OTP:', error);
      setError(error.message || 'Erro ao enviar código de verificação');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Função para verificar o código OTP informado pelo usuário
  const verificarCodigoOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Chamar a API para verificar o código OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          number: numero.replace(/\D/g, ''),
          otp: userOtp,
          otpHash: otpHash
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar código');
      }
      
      if (!data.valid) {
        setError('Código inválido ou expirado. Por favor, verifique ou solicite um novo código.');
        return;
      }
      
      // Código válido, avançar para a próxima etapa
      setEtapaAtual(EtapaCadastro.CADASTRO_SIMPLIFICADO);
    } catch (error: any) {
      console.error('Erro ao verificar código OTP:', error);
      setError(error.message || 'Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };
  
  // Função para verificar se o número já existe
  const verificarNumero = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Verificando número:', numero);
      
      // Formatar o número para garantir consistência
      const numeroFormatado = numero.replace(/\D/g, '');
      console.log('Número formatado para consulta:', numeroFormatado);
      
      // Verificar se o cliente Supabase está configurado corretamente
      console.log('Cliente Supabase inicializado:', !!supabase);
      
      // Verificar se estamos em ambiente de produção ou desenvolvimento
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      console.log('Ambiente:', isDevelopment ? 'Desenvolvimento' : 'Produção');
      
      // Verificando primeiro quais colunas existem na tabela
      console.log('Executando consulta normal na tabela socias...');
      const { data, error } = await supabase
        .from('socias')
        .select('id, nome, email, auth_id')
        .eq('numero', numeroFormatado)
        .maybeSingle(); // Usando maybeSingle em vez de single para evitar erro quando não encontrar
      
      console.log('Resultado da consulta:', { data, error });
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro na consulta:', error);
        throw error;
      }
      
      if (data) {
        console.log('Número encontrado:', data);
        
        // Verificar se o número já tem um usuário associado
        // Verificamos se auth_id existe como propriedade e se não é nulo
        if ('auth_id' in data && data.auth_id) {
          console.log('Número já tem usuário associado:', data.auth_id);
          // Já existe um usuário para este número, redirecionar para login
          setError('Já existe uma conta associada a este número. Por favor, faça login.');
          setTimeout(() => {
            navigate('/login', { state: { message: 'Já existe uma conta associada a este número.' } });
          }, 2000);
          return;
        }
        
        // Número encontrado sem usuário associado - enviar código OTP
        console.log('Número encontrado sem usuário associado, enviando código OTP');
        
        // Guardar os dados da socia encontrada
        setSociaEncontrada(data);
        
        // Separar o nome completo em nome e sobrenome
        const nomeCompleto = data.nome || '';
        const partesNome = nomeCompleto.split(' ');
        
        if (partesNome.length > 1) {
          // Se houver espaço no nome, considerar a primeira parte como nome e o resto como sobrenome
          setNome(partesNome[0]);
          setSobrenome(partesNome.slice(1).join(' '));
        } else {
          // Se não houver espaço, considerar tudo como nome
          setNome(nomeCompleto);
          setSobrenome('');
        }
        
        setEmail(data.email || '');
        setConfirmarEmail(data.email || '');
        
        // Enviar código OTP
        await enviarCodigoOTP(numeroFormatado);
        
        // Avançar para a etapa de verificação OTP
        setEtapaAtual(EtapaCadastro.VERIFICAR_OTP);
      } else {
        console.log('Número não encontrado');
        // Número não encontrado, ir para cadastro completo
        setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_NOME);
      }
    } catch (error: any) {
      console.error('Erro ao verificar número:', error);
      setError('Erro ao verificar número. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar etapa de verificação OTP
  const renderVerificarOTP = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Verificação de Número</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enviamos um código de verificação para o seu WhatsApp. Por favor, insira o código abaixo.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            O código expira em 5 minutos.
          </p>
        </div>
        
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Código de Verificação
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="otp"
              name="otp"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Digite o código de 6 dígitos"
              maxLength={6}
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={verificarCodigoOTP}
            disabled={loading || !userOtp || userOtp.length !== 6}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
          
          <button
            type="button"
            onClick={() => enviarCodigoOTP(numero.replace(/\D/g, ''))}
            disabled={loading || (nextOtpAllowed !== null && new Date() < nextOtpAllowed)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {loading ? 'Enviando...' : 'Reenviar Código'}
          </button>
        </div>
        
        <div>
          <button
            type="button"
            onClick={() => setEtapaAtual(EtapaCadastro.VERIFICAR_NUMERO)}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar etapa inicial - verificar número
  const renderVerificarNumero = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Verificação Inicial</h3>
          <p className="mt-1 text-sm text-gray-500">
            Por favor, informe seu número de telefone para iniciarmos seu cadastro
          </p>
        </div>
        
        <div>
          <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
            Número de Telefone
          </label>
          <p className="mt-1 text-sm text-gray-500">
            (Exemplo: 5571987654321, tente sem o 9 na frente também)
          </p>
          <div className="mt-1">
            <input
              type="tel"
              id="numero"
              name="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="55(00)000000000"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div>
          <button
            type="button"
            onClick={verificarNumero}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
          >
            {loading ? 'Verificando...' : 'Continuar'}
          </button>
        </div>
      </div>
    );
  };
  
  // Função para lidar com o cadastro simplificado
  const handleCadastroSimplificado = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Verificar se as senhas coincidem
      if (senha !== confirmarSenha) {
        setError('As senhas não coincidem.');
        return;
      }
      
      // Criar usuário com email confirmado usando a função auxiliar
      const { data: userData, error: userError } = await createUserWithConfirmedEmail(
        email,
        senha,
        { nome, sobrenome }
      );
      
      if (userError) throw userError;
      
      // Verificar se temos os dados do usuário e o ID
      if (!userData || !userData.user || !userData.user.id) {
        console.error('ID do usuário não encontrado:', userData);
        throw new Error('ID do usuário não encontrado');
      }
      
      const userId = userData.user.id;
      console.log('ID do usuário criado:', userId);
      
      // Atualizar a tabela socias com o UUID do usuário, nome completo e auth_id
      const { error: updateError } = await supabase
        .from('socias')
        .update({ 
          id: userId, // Usando a coluna id em vez de uuid
          nome: `${nome} ${sobrenome}`.trim(), // Concatenando nome e sobrenome
          auth_id: userId // Salvando o auth_id para verificar se o usuário já está cadastrado
        })
        .eq('numero', numero);
      
      if (updateError) throw updateError;
      
      // Login automático
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });
      
      if (signInError) throw signInError;
      
      // Redirecionar para a página de produtos
      navigate('/produtos');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      setError(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar etapa de cadastro simplificado
  const renderCadastroSimplificado = () => {
    return (
      <form onSubmit={handleCadastroSimplificado} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Complete seu cadastro</h3>
          <p className="mt-1 text-sm text-gray-500">
            Seu número já está cadastrado. Complete as informações abaixo para finalizar seu cadastro.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700">
              Sobrenome
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
            Confirmar Senha
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
          >
            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>
        </div>
      </form>
    );
  };
  
  // Função para avançar para a próxima etapa do cadastro completo - nome para email
  const avancarEtapaCadastroCompleto = () => {
    // Salvar os dados da etapa atual
    setCadastroCompleto(prev => ({
      ...prev,
      nome,
      sobrenome
    }));
    
    // Avançar para a próxima etapa
    setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_EMAIL);
  };
  
  // Função para avançar para a próxima etapa do cadastro completo - email para certificado
  const avancarEtapaEmail = () => {
    // Salvar os dados da etapa atual
    setCadastroCompleto(prev => ({
      ...prev,
      email,
      confirmarEmail
    }));
    
    // Avançar para a próxima etapa
    setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_CERTIFICADO);
  };
  
  // Função para avançar para a próxima etapa do cadastro completo - certificado para número
  const avancarEtapaCertificado = () => {
    // Salvar os dados da etapa atual
    setCadastroCompleto(prev => ({
      ...prev,
      cnpj: usarCnpj ? cnpj : undefined,
      certificado: !usarCnpj ? certificado : undefined
    }));
    
    // Avançar para a próxima etapa
    setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_NUMERO);
  };
  
  // Função para avançar para a próxima etapa do cadastro completo - número para senha
  const avancarEtapaNumero = () => {
    // Salvar os dados da etapa atual
    setCadastroCompleto(prev => ({
      ...prev,
      numero
    }));
    
    // Avançar para a próxima etapa
    setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_SENHA);
  };
  
  // Função para finalizar o cadastro completo
  const finalizarCadastroCompleto = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Salvar os dados da última etapa
      const dadosCadastro = {
        ...cadastroCompleto,
        senha,
        confirmarSenha
      };
      
      // Verificar se o email já está em uso
      const { data: emailExistente } = await supabase.auth.signInWithOtp({
        email: dadosCadastro.email,
        options: {
          shouldCreateUser: false
        }
      });
      
      if (emailExistente) {
        setError('Este email já está em uso. Por favor, utilize outro email.');
        return;
      }
      
      // Criar usuário com email confirmado usando a função auxiliar
      const { data: userData, error: userError } = await createUserWithConfirmedEmail(
        dadosCadastro.email,
        dadosCadastro.senha,
        { nome: dadosCadastro.nome, sobrenome: dadosCadastro.sobrenome }
      );
      
      if (userError) throw userError;
      
      // Verificar se temos os dados do usuário e o ID
      if (!userData || !userData.user || !userData.user.id) {
        console.error('ID do usuário não encontrado:', userData);
        throw new Error('ID do usuário não encontrado');
      }
      
      const userId = userData.user.id;
      console.log('ID do usuário criado:', userId);
      
      // Criar registro na tabela socias
      const { error: sociaError } = await supabase.from('socias').insert({
        id: userId, // Usando a coluna id em vez de uuid
        nome: `${dadosCadastro.nome} ${dadosCadastro.sobrenome}`.trim(), // Concatenando nome e sobrenome
        email: dadosCadastro.email,
        numero: dadosCadastro.numero,
        cnpj: dadosCadastro.cnpj,
        certificado_url: dadosCadastro.certificado ? 'URL_DO_CERTIFICADO' : null, // Aqui seria feito o upload do certificado
        certificado_validado: dadosCadastro.certificado ? true : false,
        auth_id: userId // Salvando o auth_id para verificar se o usuário já está cadastrado
      });
      
      if (sociaError) throw sociaError;
      
      // Login automático
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: dadosCadastro.email,
        password: dadosCadastro.senha
      });
      
      if (signInError) throw signInError;
      
      // Redirecionar para a página de produtos
      navigate('/produtos');
    } catch (error: any) {
      console.error('Erro ao finalizar cadastro:', error);
      setError(error.message || 'Erro ao finalizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar etapa de cadastro completo - número de telefone
  const renderCadastroCompletoNumero = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Cadastro Completo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Informe seu número de telefone
          </p>
        </div>
        
        <div>
          <label htmlFor="numero-completo" className="block text-sm font-medium text-gray-700">
            Número de Telefone
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="numero-completo"
              name="numero-completo"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_CERTIFICADO)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Voltar
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (!numero.trim()) {
                setError('Por favor, informe seu número de telefone');
                return;
              }
              setError(null);
              avancarEtapaNumero();
            }}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Função para validar certificado (versão simplificada para desenvolvimento)
  const validarCertificado = async (file: File): Promise<boolean> => {
    try {
      // Simulação de validação - em produção, isso seria feito via API backend segura
      console.log('Validando certificado:', file.name);
      
      // Simular um delay para dar feedback ao usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retornar true para fins de desenvolvimento
      // Em produção, isso seria substituído pela chamada real à API OpenAI através de um endpoint backend
      return true;
    } catch (error) {
      console.error('Erro ao validar certificado:', error);
      return false;
    }
  };
  
  // Renderizar etapa de cadastro completo - certificado/CNPJ
  const renderCadastroCompletoCertificado = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Cadastro Completo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comprove sua atuação na área da beleza
          </p>
        </div>
        
        <div>
          <div className="flex items-center">
            <input
              id="usar-cnpj"
              name="usar-cnpj"
              type="checkbox"
              checked={usarCnpj}
              onChange={(e) => setUsarCnpj(e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="usar-cnpj" className="ml-2 block text-sm text-gray-900">
              Utilizar CNPJ
            </label>
          </div>
        </div>
        
        {usarCnpj ? (
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
              CNPJ
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="certificado" className="block text-sm font-medium text-gray-700">
              Certificado da Área da Beleza
            </label>
            <div className="mt-1">
              <input
                type="file"
                id="certificado"
                name="certificado"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCertificado(file);
                    setCertificadoValidado(false);
                  }
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
            {certificado && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    setError(null);
                    try {
                      const isValid = await validarCertificado(certificado);
                      setCertificadoValidado(isValid);
                      if (!isValid) {
                        setError('O certificado não foi validado. Por favor, envie um certificado válido da área da beleza.');
                      }
                    } catch (error: any) {
                      console.error('Erro ao validar certificado:', error);
                      setError('Erro ao validar certificado. Tente novamente.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading || !certificado}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
                >
                  {loading ? 'Validando...' : 'Validar Certificado'}
                </button>
                {certificadoValidado && (
                  <span className="ml-2 text-sm text-green-600">
                    Certificado validado com sucesso!
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_EMAIL)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Voltar
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (usarCnpj) {
                if (!cnpj.trim()) {
                  setError('Por favor, informe o CNPJ');
                  return;
                }
                // Aqui poderia ter uma validação de CNPJ
              } else {
                if (!certificado) {
                  setError('Por favor, envie um certificado');
                  return;
                }
                if (!certificadoValidado) {
                  setError('Por favor, valide o certificado antes de continuar');
                  return;
                }
              }
              setError(null);
              avancarEtapaCertificado();
            }}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar etapa de cadastro completo - email e confirmação de email
  const renderCadastroCompletoEmail = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Cadastro Completo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Informe seu email para continuar o cadastro
          </p>
        </div>
        
        <div>
          <label htmlFor="email-completo" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email-completo"
              name="email-completo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmar-email" className="block text-sm font-medium text-gray-700">
            Confirmar Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="confirmar-email"
              name="confirmar-email"
              value={confirmarEmail}
              onChange={(e) => setConfirmarEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_NOME)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Voltar
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (!email.trim()) {
                setError('Por favor, informe seu email');
                return;
              }
              if (email !== confirmarEmail) {
                setError('Os emails não coincidem');
                return;
              }
              setError(null);
              avancarEtapaEmail();
            }}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar etapa de cadastro completo - nome e sobrenome
  const renderCadastroCompletoNome = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Cadastro Completo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Preencha seus dados pessoais para criar sua conta
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nome-completo" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="nome-completo"
                name="nome-completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="sobrenome-completo" className="block text-sm font-medium text-gray-700">
              Sobrenome
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="sobrenome-completo"
                name="sobrenome-completo"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div>
          <button
            type="button"
            onClick={() => {
              if (!nome.trim() || !sobrenome.trim()) {
                setError('Por favor, preencha seu nome e sobrenome');
                return;
              }
              setError(null);
              avancarEtapaCadastroCompleto();
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar etapa de cadastro completo - senha e confirmação de senha
  const renderCadastroCompletoSenha = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Cadastro Completo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Defina sua senha para finalizar o cadastro
          </p>
        </div>
        
        <div>
          <label htmlFor="senha-completa" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="senha-completa"
              name="senha-completa"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmar-senha" className="block text-sm font-medium text-gray-700">
            Confirmar Senha
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="confirmar-senha"
              name="confirmar-senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setEtapaAtual(EtapaCadastro.CADASTRO_COMPLETO_NUMERO)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Voltar
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (!senha) {
                setError('Por favor, defina uma senha');
                return;
              }
              if (senha.length < 6) {
                setError('A senha deve ter pelo menos 6 caracteres');
                return;
              }
              if (senha !== confirmarSenha) {
                setError('As senhas não coincidem');
                return;
              }
              setError(null);
              finalizarCadastroCompleto();
            }}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
          >
            {loading ? 'Finalizando...' : 'Finalizar Cadastro'}
          </button>
        </div>
      </div>
    );
  };
  
  // Renderizar conteúdo com base na etapa atual
  const renderConteudo = () => {
    switch (etapaAtual) {
      case EtapaCadastro.VERIFICAR_NUMERO:
        return renderVerificarNumero();
      case EtapaCadastro.VERIFICAR_OTP:
        return renderVerificarOTP();
      case EtapaCadastro.CADASTRO_SIMPLIFICADO:
        return renderCadastroSimplificado();
      case EtapaCadastro.CADASTRO_COMPLETO_NOME:
        return renderCadastroCompletoNome();
      case EtapaCadastro.CADASTRO_COMPLETO_EMAIL:
        return renderCadastroCompletoEmail();
      case EtapaCadastro.CADASTRO_COMPLETO_CERTIFICADO:
        return renderCadastroCompletoCertificado();
      case EtapaCadastro.CADASTRO_COMPLETO_NUMERO:
        return renderCadastroCompletoNumero();
      case EtapaCadastro.CADASTRO_COMPLETO_SENHA:
        return renderCadastroCompletoSenha();
      default:
        return renderVerificarNumero();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cadastre-se no The Beauty Club
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a href="/login" className="font-medium text-pink-600 hover:text-pink-500">
              entre na sua conta
            </a>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          {renderConteudo()}
        </div>
      </div>
    </div>
  );
  }

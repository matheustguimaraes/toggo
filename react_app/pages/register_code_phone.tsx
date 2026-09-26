import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import ThemeToggleButton from '../components/ThemeToggleButton';

function RandomMessage() {
  const mensagens = [
    {
      titulo: 'Experiência personalizada',
      texto: 'Eventos filtrados por você, no lugar certo, na hora certa.'
    },
    {
      titulo: 'Descoberta de eventos',
      texto: 'Encontre os melhores eventos culturais, esportivos e comunitários em um só lugar.'
    },
    {
      titulo: 'Recomendações inteligentes',
      texto: 'Receba sugestões com base nos seus gostos, localização e histórico de navegação.'
    },
    {
      titulo: 'Engajamento com a comunidade',
      texto: 'Avalie, comente e descubra o que outras pessoas estão curtindo na sua cidade.'
    }
  ];

  const [mensagem, setMensagem] = useState(mensagens[0]);

  useEffect(() => {
    const aleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    setMensagem(aleatoria);
  }, []);

  return (
    <div className="random-message">
      <h3 className="random-message-title">{mensagem.titulo}</h3>
      <p className="random-message-text">{mensagem.texto}</p>
    </div>
  );
}

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = ''; 
      setCode(newCode);
      inputRefs[index - 1].current?.focus(); 
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');

    if (fullCode.length === 4) {
      router.push('/feed'); 
    } else {
      alert('Por favor, insira o código completo.');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Verifique seu Código - Toggo</title>
      </Head>
      <main className="auth-page">
        <div className="auth-left">
          <h1 className="verify-title">
            Verifique seu código <span role="img" aria-label="raio">⚡</span>
          </h1>
          <p className="verify-subtitle">
            Acabamos de enviar um código de 4 dígitos para seu e-mail.
            Digite o código abaixo para continuar.
          </p>

          <div className="verification-code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={inputRefs[index]}
                className="code-input"
              />
            ))}
          </div>

          <p className="resend-code-text">
            Não recebeu o código? <a href="#" className="resend-code-link">Reenviar código</a>
          </p>
          <div className="auth-footer-buttons">
            <button className="back-button" onClick={handleGoBack}>
              <img src="/imgs/back.png" alt="Voltar" className="back-icon" />
              Voltar
            </button>
            <button className="primary-button" onClick={handleSubmit}>
              Próximo
            </button>
          </div>
        </div>

        <div className="auth-right">
          <div className="logo-orbit-container">
            <div className="logo-orbit-center">
              <img src="/imgs/logo.png" alt="Logo" className="auth-logo" />
            </div>

            {[1, 2, 3].map((r) => (
              <div key={`ring-${r}`} className={`orbit-ring ring-${r}`}></div>
            ))}

            {[130, 160, 190].map((radius, i) => (
              <div
                key={`dot-${i}`}
                className="orbiter"
                style={{
                  animation: `spin ${10 + i * 2}s linear infinite`,
                }}
              >
                <div
                  className="orbit-dot"
                  style={{
                    backgroundColor: ['#f90', '#3f3c56', '#6c47b7', '#ffb930'][i],
                    transform: `translateX(${radius}px)`,
                  }}
                />
              </div>
            ))}
          </div>
          <RandomMessage />
        </div>
      </main>
      <ThemeToggleButton />
    </>
  );
}
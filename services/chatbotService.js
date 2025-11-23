import axios from "axios";

// Base de conhecimento veterinária
const veterinaryKnowledge = {
  greetings: [
    "Olá! Como posso ajudá-lo com seu pet hoje?",
    "Oi! Estou aqui para ajudar com questões veterinárias. O que você precisa?",
    "Bem-vindo! Sou seu assistente virtual veterinário. Como posso ajudar?",
  ],
  commonQuestions: {
    "vomito": "Vômito em pets pode ter várias causas: mudança de dieta, ingestão de algo inadequado, ou problemas mais sérios. Se persistir por mais de 24h ou vier acompanhado de outros sintomas, procure um veterinário urgentemente.",
    "diarreia": "Diarreia pode ser causada por mudança de alimentação, estresse, ou infecções. Mantenha o pet hidratado e ofereça comida leve. Se durar mais de 2 dias ou houver sangue, consulte um veterinário.",
    "febre": "Febre em pets geralmente indica infecção. A temperatura normal de cães é 38-39°C e de gatos 38-39.5°C. Se suspeitar de febre, procure um veterinário.",
    "vacina": "A vacinação é essencial para a saúde do pet. Filhotes precisam de múltiplas doses. Adultos precisam de reforços anuais. Consulte um veterinário para o calendário adequado.",
    "alimentacao": "A alimentação deve ser balanceada e adequada à idade, porte e espécie do pet. Evite dar comida humana, especialmente chocolate, cebola e uvas que são tóxicos.",
    "filhote": "Filhotes precisam de cuidados especiais: vacinação completa, vermifugação, alimentação adequada à idade, e muito carinho! Consulte um veterinário para orientações específicas.",
    "castracao": "A castração traz muitos benefícios: previne doenças, reduz comportamento agressivo, evita crias indesejadas e aumenta a expectativa de vida. Consulte um veterinário para saber o melhor momento.",
    "banho": "A frequência de banho depende do tipo de pet. Cães podem tomar banho a cada 2-4 semanas, gatos geralmente não precisam de banho. Use produtos específicos para pets.",
    "pulgas": "Pulgas causam coceira e podem transmitir doenças. Use produtos antipulgas recomendados por veterinário. Trate o ambiente também, não apenas o pet.",
    "obesidade": "Obesidade em pets é um problema sério. Alimentação balanceada e exercícios regulares são essenciais. Consulte um veterinário para um plano de perda de peso adequado.",
    "dentes": "A saúde dental é importante! Escove os dentes do pet regularmente, ofereça brinquedos para mastigar e faça limpeza profissional quando necessário.",
    "emergencia": "Em emergências, mantenha a calma. Se o pet está inconsciente, sangrando muito, com dificuldade para respirar ou convulsões, leve imediatamente ao veterinário.",
  },
  defaultResponse: "Entendo sua preocupação. Para uma orientação mais precisa e segura, recomendo que você consulte um veterinário. Posso ajudar com informações gerais, mas cada caso é único e requer avaliação profissional.",
};

// Perguntas frequentes para mostrar quando não há quota - formato como se a IA estivesse perguntando
export const getFrequentQuestions = () => {
  return [
    { id: "vomito", text: "Precisa de ajuda com vômito?" },
    { id: "diarreia", text: "Seu pet está com diarreia?" },
    { id: "febre", text: "Quer saber sobre febre em pets?" },
    { id: "vacina", text: "Tem dúvidas sobre vacinação?" },
    { id: "alimentacao", text: "Precisa de orientação sobre alimentação?" },
    { id: "filhote", text: "Tem um filhote e precisa de ajuda?" },
    { id: "castracao", text: "Quer saber sobre castração?" },
    { id: "banho", text: "Tem dúvidas sobre banho e higiene?" },
    { id: "pulgas", text: "Problema com pulgas ou parasitas?" },
    { id: "obesidade", text: "Seu pet está acima do peso?" },
    { id: "dentes", text: "Quer cuidar da saúde dental do seu pet?" },
    { id: "emergencia", text: "Está em uma situação de emergência?" },
  ];
};

// Função para detectar intenção na mensagem
const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Saudações
  if (lowerMessage.match(/\b(olá|oi|ola|bom dia|boa tarde|boa noite|hey|hello)\b/)) {
    return "greeting";
  }
  
  // Perguntas comuns
  if (lowerMessage.match(/\b(vomit|vômito|vomito|enjoo)\b/)) {
    return "vomito";
  }
  if (lowerMessage.match(/\b(diarreia|diarréia|cocô|fezes)\b/)) {
    return "diarreia";
  }
  if (lowerMessage.match(/\b(febre|temperatura|quente)\b/)) {
    return "febre";
  }
  if (lowerMessage.match(/\b(vacina|vacinação|vacinar)\b/)) {
    return "vacina";
  }
  if (lowerMessage.match(/\b(comida|alimentação|alimentacao|ração|comer)\b/)) {
    return "alimentacao";
  }
  if (lowerMessage.match(/\b(filhote|filhote|puppy|gatinho)\b/)) {
    return "filhote";
  }
  
  return "general";
};

// Função para verificar se OpenAI tem quota disponível
export const checkOpenAIQuota = async () => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your-openai-api-key") {
    return { hasQuota: false, reason: "no_api_key" };
  }

  try {
    // Faz uma requisição de teste simples
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "test",
          },
        ],
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return { hasQuota: true };
    }
  } catch (error) {
    const errorCode = error.response?.data?.error?.code;
    const errorType = error.response?.data?.error?.type;
    
    if (errorCode === 'insufficient_quota' || errorType === 'insufficient_quota') {
      return { hasQuota: false, reason: "insufficient_quota" };
    } else if (errorCode === 'invalid_api_key' || errorType === 'invalid_api_key') {
      return { hasQuota: false, reason: "invalid_api_key" };
    } else if (error.response?.status === 429) {
      return { hasQuota: false, reason: "rate_limit" };
    }
    
    // Outros erros podem ser temporários, então assumimos que tem quota
    return { hasQuota: true };
  }

  return { hasQuota: false, reason: "unknown" };
};

// Função para usar OpenAI API
const useOpenAI = async (userMessage, conversationHistory = []) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your-openai-api-key") {
    return null;
  }

  try {
    const messages = [
      {
        role: "system",
        content: "Você é um assistente virtual veterinário especializado em ajudar tutores de pets. Seja prestativo, empático e sempre recomende consultar um veterinário para casos sérios. Responda em português brasileiro de forma clara e acessível.",
      },
      ...conversationHistory.slice(-10), // Últimas 10 mensagens para contexto
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content.trim();
    }
  } catch (error) {
    // Erros comuns que não devem ser logados como erro crítico
    const errorCode = error.response?.data?.error?.code;
    const errorType = error.response?.data?.error?.type;
    
    if (errorCode === 'insufficient_quota' || errorType === 'insufficient_quota') {
      console.log("OpenAI: Quota excedida, usando IA baseada em regras");
    } else if (errorCode === 'invalid_api_key' || errorType === 'invalid_api_key') {
      console.log("OpenAI: Chave de API inválida, usando IA baseada em regras");
    } else if (error.response?.status === 429) {
      console.log("OpenAI: Muitas requisições, usando IA baseada em regras");
    } else {
      console.error("Erro ao usar OpenAI:", error.response?.data?.error?.message || error.message);
    }
    
    return null;
  }

  return null;
};


// Função principal
export const chatbotReply = async (userMessage, sessionId = null) => {
  try {
    // Tenta usar OpenAI primeiro
    const openAIResponse = await useOpenAI(userMessage);
    if (openAIResponse) {
      return openAIResponse;
    }

    // Se OpenAI não funcionar, usa IA baseada em regras
    // Se a mensagem for um ID de pergunta frequente (quando não há quota), retorna a resposta diretamente
    if (veterinaryKnowledge.commonQuestions[userMessage.toLowerCase()]) {
      return veterinaryKnowledge.commonQuestions[userMessage.toLowerCase()];
    }
    
    const intent = detectIntent(userMessage);
    
    if (intent === "greeting") {
      const greetings = veterinaryKnowledge.greetings;
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (intent !== "general" && veterinaryKnowledge.commonQuestions[intent]) {
      return veterinaryKnowledge.commonQuestions[intent];
    }

    // Resposta padrão inteligente
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("obrigad") || lowerMessage.includes("obrigado")) {
      return "De nada! Estou sempre aqui para ajudar. Se tiver mais alguma dúvida sobre seu pet, é só perguntar!";
    }
    
    if (lowerMessage.includes("ajuda") || lowerMessage.includes("help")) {
      return "Posso ajudar com informações sobre: vômito, diarreia, febre, vacinação, alimentação, cuidados com filhotes e muito mais! Faça sua pergunta e eu tentarei ajudar. Lembre-se: para casos sérios, sempre consulte um veterinário.";
    }

    // Resposta padrão
    return `${veterinaryKnowledge.defaultResponse} 

Posso ajudar com informações sobre:
- Sintomas comuns (vômito, diarreia, febre)
- Vacinação
- Alimentação
- Cuidados com filhotes
- E muito mais!

Faça uma pergunta específica ou diga "ajuda" para ver mais opções.`;

  } catch (error) {
    console.error("Erro geral no chatbot:", error.message);
    return "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente ou consulte um veterinário para orientações urgentes.";
  }
};

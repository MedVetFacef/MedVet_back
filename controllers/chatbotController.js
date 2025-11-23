import { chatbotReply, checkOpenAIQuota, getFrequentQuestions } from "../services/chatbotService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const reply = await chatbotReply(message, sessionId);

    return res.json({
      user: message,
      bot: reply,
    });
  } catch (error) {
    const errorMessage = error.message || "Erro ao processar a mensagem. Tente novamente.";
    return res.status(500).json({ 
      error: errorMessage,
      bot: errorMessage 
    });
  }
};

export const checkQuota = async (req, res) => {
  try {
    const quotaStatus = await checkOpenAIQuota();
    const questions = getFrequentQuestions();
    
    return res.json({
      hasQuota: quotaStatus.hasQuota,
      reason: quotaStatus.reason,
      questions: questions,
    });
  } catch (error) {
    return res.status(500).json({ 
      hasQuota: false,
      reason: "error",
      questions: getFrequentQuestions(),
    });
  }
};

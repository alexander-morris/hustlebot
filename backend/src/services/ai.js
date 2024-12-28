const { GoogleGenerativeAI } = require('@google/generative-ai');
const knowledgeBase = require('../data/knowledgebase.json');

class AIService {
  constructor() {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn('No GEMINI_API_KEY found in environment variables');
        console.warn('Please set GEMINI_API_KEY in your .env file');
        console.warn('Falling back to development mode with pre-defined questions');
        this.fallbackMode = true;
        return;
      }

      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      this.questions = knowledgeBase.questions;
      this.askedQuestions = new Set();
      this.lastQuestionCategory = null;
      this.availableQuestions = [...this.questions];
      this.fallbackMode = false;
    } catch (error) {
      console.error('Failed to initialize Gemini AI service:', error);
      if (error.message.includes('API key')) {
        console.error('Invalid or expired Gemini API key');
        console.error('Please check your API key in .env file');
      }
      this.fallbackMode = true;
    }
  }

  resetAskedQuestions() {
    this.askedQuestions.clear();
    this.availableQuestions = [...this.questions];
    this.lastQuestionCategory = null;
  }

  getRandomQuestion() {
    const availableQuestions = this.availableQuestions.filter(q => 
      !this.askedQuestions.has(q.id) &&
      (!this.lastQuestionCategory || q.category !== this.lastQuestionCategory)
    );
    
    if (availableQuestions.length === 0) {
      console.log('All questions have been asked');
      return null;
    }
    
    const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    this.askedQuestions.add(question.id);
    this.lastQuestionCategory = question.category;
    this.availableQuestions = this.availableQuestions.filter(q => q.id !== question.id);
    return question;
  }

  getFollowUpQuestion(category) {
    const categoryQuestions = this.availableQuestions.filter(q => 
      q.category === category && !this.askedQuestions.has(q.id)
    );
    if (categoryQuestions.length > 0) {
      const question = categoryQuestions[0];
      this.askedQuestions.add(question.id);
      this.availableQuestions = this.availableQuestions.filter(q => q.id !== question.id);
      return question;
    }
    return this.getRandomQuestion();
  }

  async generateResponse(message, chatHistory = []) {
    try {
      if (this.fallbackMode) {
        const question = this.getRandomQuestion();
        if (!question) {
          return {
            text: "You've provided some great insights. Let me reflect on what you've shared.",
            options: ["Tell me more", "What have you learned?", "How can we move forward?"]
          };
        }
        return {
          text: `Let me ask you something. ${question.text}`,
          options: question.options || []
        };
      }

      const shouldAskQuestion = Math.random() < 0.4;
      
      if (shouldAskQuestion) {
        const question = this.lastQuestionCategory ? 
          this.getFollowUpQuestion(this.lastQuestionCategory) : 
          this.getRandomQuestion();
        if (!question) {
          return {
            text: "You've shared some interesting perspectives. What stands out most from our conversation?",
            options: ["Personal insights", "New realizations", "Action steps"]
          };
        }
        return {
          text: `I understand. ${question.text}`,
          options: question.options || []
        };
      }

      const chat = this.model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return {
        text: response.text(),
        options: []
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      const question = this.getRandomQuestion();
      return {
        text: `I encountered an issue, but let's continue our conversation. ${question.text}`,
        options: question.options || []
      };
    }
  }
}

module.exports = new AIService();

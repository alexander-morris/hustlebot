const AIService = require('../services/ai');
const knowledgeBase = require('../data/knowledgebase.json');

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => Promise.resolve('Test response')
          }
        })
      })
    })
  }))
}));

describe('AI Service', () => {
  beforeEach(() => {
    // Reset asked questions before each test
    AIService.resetAskedQuestions();
  });

  it('should generate a response', async () => {
    const response = await AIService.generateResponse('Hello');
    expect(response).toBe('Test response');
  });

  it('should return questions from knowledge base', () => {
    const question = AIService.getRandomQuestion();
    expect(question).toHaveProperty('id');
    expect(question).toHaveProperty('text');
    expect(question).toHaveProperty('category');
    expect(knowledgeBase.questions).toContainEqual(question);
  });

  it('should not repeat questions until all are used', () => {
    const totalQuestions = knowledgeBase.questions.length;
    const askedQuestions = new Set();
    
    // Ask for questions until we've used them all
    for (let i = 0; i < totalQuestions; i++) {
      const question = AIService.getRandomQuestion();
      expect(askedQuestions.has(question.id)).toBeFalsy();
      askedQuestions.add(question.id);
    }
    
    expect(askedQuestions.size).toBe(totalQuestions);
  });

  it('should handle errors gracefully', async () => {
    jest.spyOn(AIService.model, 'startChat').mockImplementationOnce(() => {
      throw new Error('API Error');
    });

    await expect(AIService.generateResponse('Hello')).rejects.toThrow('Failed to generate response');
  });
}); 
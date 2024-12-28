import { generateReferralCode } from '../referralUtils';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

describe('referralUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReferralCode', () => {
    it('should generate a valid format code', async () => {
      addDoc.mockResolvedValue({ id: 'test' });
      
      const code = await generateReferralCode('testUserId');
      
      expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    it('should save code to Firestore', async () => {
      addDoc.mockResolvedValue({ id: 'test' });
      
      await generateReferralCode('testUserId');
      
      expect(addDoc).toHaveBeenCalled();
      const addDocArgs = addDoc.mock.calls[0][1];
      expect(addDocArgs.createdBy).toBe('testUserId');
      expect(addDocArgs.used).toBe(false);
      expect(addDocArgs.usedBy).toBeNull();
    });

    it('should handle errors', async () => {
      addDoc.mockRejectedValue(new Error('Test error'));
      
      await expect(generateReferralCode('testUserId')).rejects.toThrow('Test error');
    });
  });
}); 
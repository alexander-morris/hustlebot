import { getUrlParams, isValidReferralCode } from '../urlUtils';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';

describe('urlUtils', () => {
  beforeEach(() => {
    window.location.search = '';
  });

  describe('getUrlParams', () => {
    it('should parse refOffer parameter correctly', () => {
      window.location.search = '?refOffer=1';
      const params = getUrlParams();
      expect(params.refOffer).toBe(true);
    });

    it('should parse questions parameter correctly', () => {
      window.location.search = '?q=3';
      const params = getUrlParams();
      expect(params.questions).toBe(3);
    });

    it('should parse ref parameter correctly', () => {
      window.location.search = '?ref=TEST123';
      const params = getUrlParams();
      expect(params.ref).toBe('TEST123');
    });
  });

  describe('isValidReferralCode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return false for invalid code format', async () => {
      const result = await isValidReferralCode('123');
      expect(result).toBe(false);
    });

    it('should return false for expired code', async () => {
      const mockSnapshot = {
        empty: false,
        docs: [{
          data: () => ({
            used: false,
            expiresAt: { toDate: () => new Date(Date.now() - 1000) }
          })
        }]
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await isValidReferralCode('XXXX-XXXX-XXXX');
      expect(result).toBe(false);
    });

    it('should return false for used code', async () => {
      const mockSnapshot = {
        empty: false,
        docs: [{
          data: () => ({
            used: true,
            expiresAt: { toDate: () => new Date(Date.now() + 1000) }
          })
        }]
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await isValidReferralCode('XXXX-XXXX-XXXX');
      expect(result).toBe(false);
    });
  });
}); 
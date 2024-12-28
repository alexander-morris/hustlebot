import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import ChatUI from '../ChatUI';
import { generateReferralCode } from '../../../utils/referralUtils';

jest.mock('../../../utils/referralUtils');

describe('ChatUI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show referral interface when showRefOffer is true', async () => {
    generateReferralCode.mockResolvedValue('TEST-CODE-1234');

    const { getByText } = render(<ChatUI showRefOffer={true} />);

    await waitFor(() => {
      expect(getByText('Thank You for Using HustleBot!')).toBeInTheDocument();
      expect(getByText('TEST-CODE-1234')).toBeInTheDocument();
    });
  });

  it('should show login prompt after reaching question threshold', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ChatUI questionsBeforeLogin={2} />
    );

    // Simulate two questions
    const input = getByPlaceholderText('Type a message...');
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Second message' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
      await new Promise(r => setTimeout(r, 100));
    });

    expect(getByText(/Continue without signing in/i)).toBeInTheDocument();
  });

  it('should show referral code after Google sign in', async () => {
    generateReferralCode.mockResolvedValue('TEST-CODE-5678');

    const { getByText } = render(<ChatUI />);

    await act(async () => {
      // Simulate Google sign in
      const userData = { uid: 'test-uid', name: 'Test User' };
      await getByText(/sign in with google/i).click();
    });

    await waitFor(() => {
      expect(getByText('TEST-CODE-5678')).toBeInTheDocument();
    });
  });
}); 
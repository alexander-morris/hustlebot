import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ChatUI from '../Chat/ChatUI';
import { sendMessage } from '../../services/ai';

jest.mock('../../services/ai');

describe('ChatUI', () => {
  const testUserName = 'Test User';
  
  beforeEach(() => {
    sendMessage.mockClear();
  });

  it('renders correctly with welcome message', () => {
    const { getByPlaceholderText, getByText } = render(<ChatUI userName={testUserName} />);
    expect(getByPlaceholderText('Type a message...')).toBeTruthy();
    expect(getByText(`Welcome ${testUserName}!`)).toBeTruthy();
  });

  it('sends a message and displays response', async () => {
    sendMessage.mockResolvedValueOnce({ response: 'Test response' });

    const { getByPlaceholderText, findByText } = render(<ChatUI userName={testUserName} />);
    const input = getByPlaceholderText('Type a message...');

    await act(async () => {
      fireEvent.changeText(input, 'Hello');
      fireEvent(input, 'submitEditing');
    });

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith('Hello');
    });

    const response = await findByText('Test response');
    expect(response).toBeTruthy();
  });

  it('handles question responses correctly', async () => {
    sendMessage.mockResolvedValueOnce({ 
      response: 'I understand. What are your main goals?' 
    });

    const { getByPlaceholderText, findByText } = render(<ChatUI userName={testUserName} />);
    const input = getByPlaceholderText('Type a message...');

    await act(async () => {
      fireEvent.changeText(input, 'Hello');
      fireEvent(input, 'submitEditing');
    });

    const questionResponse = await findByText('I understand. What are your main goals?');
    expect(questionResponse).toBeTruthy();
    // Verify question styling
    expect(questionResponse.parent.props.style).toContainEqual(
      expect.objectContaining({ borderWidth: 1 })
    );
  });

  it('handles errors gracefully', async () => {
    sendMessage.mockRejectedValueOnce(new Error('API Error'));

    const { getByPlaceholderText, findByText } = render(<ChatUI userName={testUserName} />);
    const input = getByPlaceholderText('Type a message...');

    await act(async () => {
      fireEvent.changeText(input, 'Hello');
      fireEvent(input, 'submitEditing');
    });

    const errorMessage = await findByText('Sorry, something went wrong. Please try again.');
    expect(errorMessage).toBeTruthy();
  });

  it('disables input while loading', async () => {
    sendMessage.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    const { getByPlaceholderText } = render(<ChatUI userName={testUserName} />);
    const input = getByPlaceholderText('Type a message...');
    
    await act(async () => {
      fireEvent.changeText(input, 'Hello');
      fireEvent(input, 'submitEditing');
    });
    
    expect(input.props.editable).toBeFalsy();
  });
}); 
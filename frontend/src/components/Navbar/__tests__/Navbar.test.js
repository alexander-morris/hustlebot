import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Navbar from '../index';
import { auth } from '../../../services/auth';

jest.mock('../../../services/auth', () => ({
  auth: {
    currentUser: null,
    signOut: jest.fn()
  }
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows login button when user is not authenticated', () => {
    auth.currentUser = null;
    const { getByText } = render(<Navbar />);
    expect(getByText('Login')).toBeTruthy();
  });

  it('shows logout button when user is authenticated', () => {
    auth.currentUser = { uid: 'test-uid' };
    const { getByText } = render(<Navbar />);
    expect(getByText('Logout')).toBeTruthy();
  });

  it('calls sign out when logout is clicked', async () => {
    auth.currentUser = { uid: 'test-uid' };
    auth.signOut.mockResolvedValueOnce();
    
    const { getByText } = render(<Navbar />);
    const logoutButton = getByText('Logout');
    
    fireEvent.press(logoutButton);
    
    await waitFor(() => {
      expect(auth.signOut).toHaveBeenCalled();
    });
  });

  it('shows login button in mobile menu when not authenticated', () => {
    auth.currentUser = null;
    const { getByText } = render(<Navbar />);
    
    // Open mobile menu
    fireEvent.press(getByText('☰'));
    
    expect(getByText('Login')).toBeTruthy();
  });

  it('handles login button click', () => {
    auth.currentUser = null;
    const mockOnLogin = jest.fn();
    const { getByText } = render(<Navbar onLogin={mockOnLogin} />);
    
    fireEvent.press(getByText('Login'));
    
    expect(mockOnLogin).toHaveBeenCalled();
  });
}); 
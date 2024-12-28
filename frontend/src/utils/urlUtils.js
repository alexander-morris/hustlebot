export const getInviteFromURL = () => {
  try {
    // Check if we're in a web environment
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    let inviteCode = urlParams.get('invite') || urlParams.get('ref');
    
    // Also check for hash parameters
    if (!inviteCode && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      inviteCode = hashParams.get('invite') || hashParams.get('ref');
    }
    
    // Clean up the invite code
    if (inviteCode) {
      inviteCode = inviteCode.trim().toUpperCase();
    }
    
    console.log('Found invite code in URL:', inviteCode); // Debug log
    return inviteCode;
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    return null;
  }
};

export const clearInviteFromURL = () => {
  try {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.delete('invite');
    url.searchParams.delete('ref');
    
    // Update URL without refreshing the page
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.error('Error clearing URL parameters:', error);
  }
};

export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const refOffer = params.get('refOffer') === '1';
  console.log('URL Params:', {
    ref: params.get('ref'),
    questions: params.get('q'),
    refOffer,
    rawRefOffer: params.get('refOffer')
  });
  return {
    ref: params.get('ref'),
    questions: parseInt(params.get('q')) || null,
    refOffer: params.get('refOffer') === '1'
  };
};

export const isValidReferralCode = async (code) => {
  if (!code || code.length < 14) return false; // XXXX-XXXX-XXXX format
  
  try {
    const db = getFirestore();
    const codesRef = collection(db, 'referralCodes');
    const q = query(codesRef, where('code', '==', code));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    
    const referral = snapshot.docs[0].data();
    const now = new Date();
    
    // Check if code is expired or used
    if (referral.used || referral.expiresAt.toDate() < now) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating referral code:', error);
    return false;
  }
}; 
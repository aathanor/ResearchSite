// /functions/api/user.js - Extract user from Cloudflare Access
export async function onRequestGet(context) {
  const { request } = context;
  
  try {
    console.log('=== User API Called ===');
    
    // Get the JWT assertion from Cloudflare Access
    const jwtAssertion = request.headers.get('cf-access-jwt-assertion');
    console.log('JWT assertion present:', !!jwtAssertion);
    
    if (!jwtAssertion) {
      console.log('No JWT assertion found, user not authenticated');
      return new Response(JSON.stringify({ 
        email: 'anonymous',
        authenticated: false,
        error: 'No JWT assertion found'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Decode the JWT (base64 decode the payload)
    try {
      const parts = jwtAssertion.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      const payload = parts[1];
      // Add padding if needed for base64 decoding
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = atob(paddedPayload);
      const userInfo = JSON.parse(decoded);
      
      console.log('Decoded JWT payload:', userInfo);
      
      // Extract email from common Cloudflare Access fields
      const email = userInfo.email || 
                   userInfo.user_email ||
                   userInfo.preferred_username ||
                   userInfo.upn ||
                   userInfo.name ||
                   userInfo.sub ||
                   'anonymous';
      
      console.log('Extracted email:', email);
      
      return new Response(JSON.stringify({ 
        email: email,
        authenticated: true,
        userInfo: userInfo
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (jwtError) {
      console.error('Error decoding JWT:', jwtError);
      
      // Fallback: try to get user info from other headers
      const headers = {};
      for (const [key, value] of request.headers.entries()) {
        if (key.toLowerCase().includes('user') || key.toLowerCase().includes('email')) {
          headers[key] = value;
        }
      }
      
      console.log('User-related headers:', headers);
      
      return new Response(JSON.stringify({ 
        email: 'anonymous',
        authenticated: false,
        error: 'JWT decode failed',
        headers: headers
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('User API error:', error);
    return new Response(JSON.stringify({ 
      email: 'anonymous',
      authenticated: false,
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, cf-access-jwt-assertion',
    }
  });
}
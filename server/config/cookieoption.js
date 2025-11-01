const isProduction = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,                
  secure: isProduction,          
  sameSite: isProduction ? 'None' : 'Lax',
  maxAge: 1000 * 60 * 60 * 24,  
};


export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  authConfig: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    expirationKey: 'token_expiration'
  },
  uploadConfig: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf']
  }
};

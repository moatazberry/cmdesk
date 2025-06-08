export const environment = {
  production: true,
  apiUrl: '/api',
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

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  internalSecret: process.env.INTERNAL_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
  mongodbUri: `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority&appName=${process.env.DATABASE_NAME}`,
  mongodbName: 'ECP',
});

require('dotenv').config();

export const config = {
  jwt_secret: process.env.JWT_SECRET ?? 'your_secret_key',
  mongo_uri: process.env.MONGO_URI ?? '',
};

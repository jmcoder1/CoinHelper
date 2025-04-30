FROM node:18-slim

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl
RUN apt-get install -y ca-certificates
RUN update-ca-certificates

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./ 
COPY yarn.lock ./

RUN yarn

# Copy the entire project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Copy the production environment file
COPY .env.production .env

# Build the application
RUN yarn build

# Set environment to production
ENV NODE_ENV production

# Expose the application port
EXPOSE 8080

# Run the application with a script to handle migrations
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

# Use a non-root user for security
USER node
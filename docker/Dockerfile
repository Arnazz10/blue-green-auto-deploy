# Use official Node.js alpine image for a small footprint
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker layer caching
COPY app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY app/ .

# Expose the application port
EXPOSE 3000

# Use non-root user for security
USER node

# Start the application
CMD [ "npm", "start" ]

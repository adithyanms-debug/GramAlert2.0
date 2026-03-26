# Use an official Node runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (Render uses its own, but this is good practice)
EXPOSE 8080

# Define environment variables (defaults)
ENV NODE_ENV=production
ENV PORT=8080

# Command to run the application
CMD ["node", "server.js"]

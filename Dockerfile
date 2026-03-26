# Stage 1: Build the Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/Frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
RUN npm run build

# Stage 2: Build the Backend and serve the Frontend
FROM node:20-slim
WORKDIR /app
# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev
# Copy backend source
COPY backend/ ./backend/
# Copy built frontend from Stage 1 to backend/public
COPY --from=frontend-build /app/Frontend/dist ./backend/public

# Set working directory to backend for the CMD
WORKDIR /app/backend

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the server
CMD ["node", "server.js"]

# Use a multi-stage build for efficiency
# Base image
FROM node:20-alpine3.18 AS base
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY . . 
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Set environment variables
ENV NEW_RELIC_APP_NAME=AssignMentor \
    NEW_RELIC_LICENSE_KEY=2bae51ab56d6479104eb974615d7167eFFFFNRAL \
    NEW_RELIC_LOG_LEVEL=info \
    NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true \
    AZURE_STORAGE_ACCOUNT_NAME=vipernest \
    AZURE_STORAGE_ACCOUNT_KEY=5MJfM4zBaK+nF3JWd3A89qDpvHbJBdWg8WqmDr64uDI4ylwzSTJdnRAhMsdm+XnfsbAbzZxzYnoJ+AStONAk2w== \
    AZURE_STORAGE_CONTAINER_NAME=assignments \
    FILE_NAME=assignments_report.xlsx

# Copy necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port and set the default command
EXPOSE 3000
CMD ["npm", "start"]

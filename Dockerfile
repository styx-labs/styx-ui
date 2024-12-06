# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ENV VITE_APP_API_BASE_URL="https://unilink-agent-api-16250094868.us-central1.run.app"
ENV VITE_APP_NODE_ENV="production"

# Build the application
RUN npm run build

# Install a simple server to serve the static content
RUN npm install -g serve

# Expose the port the app runs on
# Set the port number as an environment variable
ENV PORT=3000

# Expose the port defined by the environment variable
EXPOSE $PORT

# Define the command to run the app
CMD serve -s build -l $PORT
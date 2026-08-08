# Use the standard Node image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your project files
COPY . .

# Build the Next.js production application
RUN npm run build

# Expose the default Next.js port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start"]

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm install; elif [ -f yarn.lock ]; then yarn; elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; else npm install; fi
COPY . .
RUN npm run build
CMD ["npm", "run", "dev"]

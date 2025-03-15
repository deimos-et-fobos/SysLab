FROM node:18

WORKDIR /app

# Instalar dependencias de React
COPY . /app/

RUN npm install

# Ejecuta Webpack Dev Server
CMD ["npm", "run", "dev"]
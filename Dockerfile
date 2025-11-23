# Dockerfile para o backend Node.js (Produção)
FROM node:20-alpine

# Instala dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Copia o schema do Prisma ANTES de instalar (necessário para o postinstall)
COPY prisma ./prisma

# Instala as dependências (usa npm install pois pode não ter package-lock.json)
# O postinstall irá gerar o Prisma Client automaticamente
RUN npm install --omit=dev

# Copia o restante dos arquivos do projeto
COPY . .

# Gera o Prisma Client novamente (caso o postinstall tenha falhado)
RUN npx prisma generate --schema=./prisma/schema.prisma || true

# Define variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]


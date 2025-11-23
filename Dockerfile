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

# Copia o diretório scripts (necessário para o postinstall)
COPY scripts ./scripts

# Copia o diretório config (necessário para scripts/run-prisma.js)
COPY config ./config

# Cria um config.env mínimo se não existir (prisma generate não precisa de DB)
RUN if [ ! -f config/config.env ]; then \
      echo "# Minimal config for build time" > config/config.env; \
      echo "DATABASE_URL=\"postgresql://dummy:dummy@localhost:5432/dummy?schema=public\"" >> config/config.env; \
    fi

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


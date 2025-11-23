# 🐾 MedVet Backend

Backend do sistema MedVet - Sistema de Gestão Veterinária

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Configuração

Configure as variáveis de ambiente no arquivo `config/config.env`:

```env
PORT=3000
DB_URI=mongodb+srv://...
DATABASE_URL=postgresql://...
JWT_SECRET=seu-secret
JWT_EXPIRES_TIME=7d
OPENAI_API_KEY=sua-chave
```

### Executar

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

### Prisma

**Gerar Prisma Client:**
```bash
npm run prisma:generate
```

**Executar Migrações:**
```bash
npm run prisma:migrate
```

## 🐳 Docker

**Desenvolvimento:**
```bash
docker-compose up
```

**Produção:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Estrutura

```
backend/
├── app.js                 # Servidor Express
├── config/                # Configurações
│   ├── config.env        # Variáveis de ambiente
│   └── dbConnect.js      # Conexões de banco
├── controllers/          # Controladores
├── middleware/           # Middlewares
├── models/              # Modelos MongoDB
├── prisma/              # Prisma (PostgreSQL)
├── routes/              # Rotas da API
├── services/            # Serviços
└── utils/               # Utilitários
```

## 👨‍💻 Desenvolvido por

**Pedro Gomes de Almeida** e **Matheus de Castro Evangelista**


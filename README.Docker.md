# 🐳 Docker - MedVet Backend

Guia de uso do Docker para o backend do MedVet.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)

## 🚀 Uso Básico

### Desenvolvimento

```bash
docker-compose up
```

### Produção

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Variáveis de Ambiente

Configure as variáveis de ambiente no arquivo `.env` ou diretamente no `docker-compose.yml`:

```env
PORT=3000
DB_URI=mongodb://mongodb:27017/medvet
DATABASE_URL=postgresql://postgres:medvet123@postgres:5433/medvet?schema=public
JWT_SECRET=seu-secret-jwt
JWT_EXPIRES_TIME=7d
OPENAI_API_KEY=sua-chave-openai
```

## 🔧 Comandos Úteis

**Ver logs:**
```bash
docker-compose logs -f backend
```

**Parar containers:**
```bash
docker-compose down
```

**Reconstruir:**
```bash
docker-compose build --no-cache
```

**Executar comandos no container:**
```bash
docker-compose exec backend sh
```

## 📦 Serviços

- **Backend**: Node.js/Express na porta 3000
- **MongoDB**: Porta 27017
- **PostgreSQL**: Porta 5433


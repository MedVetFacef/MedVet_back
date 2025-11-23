#!/bin/bash
echo "Iniciando containers Docker..."
docker-compose up -d
echo ""
echo "Containers iniciados!"
echo ""
echo "Para ver os logs: docker-compose logs -f"
echo "Para parar: docker-compose down"


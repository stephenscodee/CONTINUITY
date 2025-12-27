# Mapa Vivo de Procesos — MVP (FastAPI + React)

Este repo contiene un scaffold mínimo para el MVP "Mapa Vivo de Procesos".

## Qué incluye
- Backend: FastAPI + SQLAlchemy + JWT auth
- Frontend: React (Vite) con páginas básicas: login, dashboard, lista de procesos, vista de proceso
- Script para crear la base de datos localmente
- Ejemplo de métricas: bus factor

## Requisitos
- Python 3.10+
- Node 18+ / npm
- (Opcional) Docker / docker-compose

## Arrancar localmente (modo rápido con SQLite)

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Copiar y configurar variables de entorno (opcional, ya tiene valores por defecto)
cp .env.example .env  # Edita .env si necesitas cambiar valores
# crear DB y tablas
python create_tables.py
# arrancar API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# abre http://localhost:5173
```

## Endpoints útiles
- OpenAPI: GET http://localhost:8000/docs
- Auth: POST /api/v1/auth/register, POST /api/v1/auth/token
- Processes: /api/v1/processes (CRUD)
- Steps: /api/v1/processes/{id}/steps
- Failures: /api/v1/steps/{id}/failures
- Metrics: /api/v1/metrics/bus-factor

## Notas
- Por simplicidad el entorno por defecto usa SQLite. Para producción cambia la variable `DATABASE_URL` a Postgres y adapta `docker-compose`.
- Este scaffold está preparado para iterar: agrega validaciones, tests, migraciones (Alembic) y despliegue según prefieras.

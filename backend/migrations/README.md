# Database migrations (Alembic)

The app calls `Base.metadata.create_all()` on startup, which is enough for local
SQLite development. For Postgres / production, use Alembic:

```bash
# Generate a migration from the current models
alembic revision --autogenerate -m "init"

# Apply migrations
alembic upgrade head
```

`migrations/env.py` reads `DATABASE_URL` from your environment / `.env`.

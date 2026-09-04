from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api.routes import health, reconciliation, transactions, exceptions, audit

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinSentry")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(reconciliation.router, prefix="/api/reconciliation")
app.include_router(transactions.router, prefix="/api/transactions")
app.include_router(exceptions.router, prefix="/api/exceptions")
app.include_router(audit.router, prefix="/api/reconciliation")

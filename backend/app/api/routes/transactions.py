from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.transaction import Transaction

router = APIRouter()

@router.get("/{run_id}/transactions")
def get_transactions(run_id: str, db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.run_id == run_id).all()

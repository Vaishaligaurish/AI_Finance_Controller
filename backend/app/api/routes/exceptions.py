from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ...core.database import get_db
from ...models.exception import ExceptionRecord
from ...models.transaction import Transaction

router = APIRouter()

class ResolveRequest(BaseModel):
    action: str
    comment: str

@router.get("/{run_id}/exceptions")
def get_exceptions(run_id: str, db: Session = Depends(get_db)):
    return db.query(ExceptionRecord).filter(ExceptionRecord.run_id == run_id).all()

@router.post("/{exception_id}/resolve")
def resolve_exception(exception_id: str, req: ResolveRequest, db: Session = Depends(get_db)):
    exc = db.query(ExceptionRecord).filter(ExceptionRecord.exception_id == exception_id).first()
    if not exc:
        raise HTTPException(status_code=404, detail="Exception not found")
    
    exc.status = f"RESOLVED_{req.action.upper()}"
    exc.resolution_comment = req.comment
    
    txn = db.query(Transaction).filter(Transaction.transaction_id == exc.transaction_id).first()
    if txn:
        txn.status = "AUTO_MATCH" if req.action == "approve" else "UNRESOLVED_EXCEPTION"
        
    db.commit()
    return {"status": "success", "exception_status": exc.status}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.audit import AuditLog

router = APIRouter()

@router.get("/{run_id}/audit")
def get_audit(run_id: str, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(AuditLog.run_id == run_id).order_by(AuditLog.timestamp.desc()).all()

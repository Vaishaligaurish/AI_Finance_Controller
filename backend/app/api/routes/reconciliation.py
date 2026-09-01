from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.reconciliation import ReconciliationRun
import uuid
import os
import shutil
from ...existing_engine.engine.reconciliation_engine import process_reconciliation

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_files(bank_file: UploadFile = File(...), ledger_file: UploadFile = File(...), db: Session = Depends(get_db)):
    run_id = str(uuid.uuid4())
    bank_path = os.path.join(UPLOAD_DIR, f"{run_id}_bank.csv")
    ledger_path = os.path.join(UPLOAD_DIR, f"{run_id}_ledger.csv")
    
    with open(bank_path, "wb") as buffer:
        shutil.copyfileobj(bank_file.file, buffer)
    with open(ledger_path, "wb") as buffer:
        shutil.copyfileobj(ledger_file.file, buffer)
        
    run = ReconciliationRun(
        run_id=run_id,
        status="PENDING",
        bank_file_path=bank_path,
        ledger_file_path=ledger_path,
        bank_filename=bank_file.filename,
        ledger_filename=ledger_file.filename
    )
    db.add(run)
    db.commit()
    
    return {"run_id": run_id, "status": "PENDING", "filenames": [bank_file.filename, ledger_file.filename]}

@router.post("/{run_id}/start")
async def start_reconciliation(run_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    run = db.query(ReconciliationRun).filter(ReconciliationRun.run_id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    run.status = "PROCESSING"
    db.commit()
    
    background_tasks.add_task(process_reconciliation, run_id, run.bank_file_path, run.ledger_file_path, db)
    return {"message": "Reconciliation started", "status": "PROCESSING"}

@router.get("/runs")
def list_runs(db: Session = Depends(get_db)):
    runs = db.query(ReconciliationRun).order_by(ReconciliationRun.created_at.desc()).all()
    return runs

@router.get("/{run_id}/status")
def get_status(run_id: str, db: Session = Depends(get_db)):
    run = db.query(ReconciliationRun).filter(ReconciliationRun.run_id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return {"status": run.status, "match_rate": run.match_rate}

@router.get("/{run_id}/summary")
def get_summary(run_id: str, db: Session = Depends(get_db)):
    run = db.query(ReconciliationRun).filter(ReconciliationRun.run_id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

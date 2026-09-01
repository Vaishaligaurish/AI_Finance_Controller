from sqlalchemy import Column, String, Integer, Float, DateTime
from ..core.database import Base
from datetime import datetime

class ReconciliationRun(Base):
    __tablename__ = "reconciliation_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, unique=True, index=True)
    status = Column(String)
    bank_file_path = Column(String)
    ledger_file_path = Column(String)
    bank_filename = Column(String)
    ledger_filename = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    total_records = Column(Integer, default=0)
    total_value = Column(Float, default=0.0)
    matched_records = Column(Integer, default=0)
    review_records = Column(Integer, default=0)
    unresolved_records = Column(Integer, default=0)
    match_rate = Column(Float, default=0.0)
    reconciled_value = Column(Float, default=0.0)
    unreconciled_value = Column(Float, default=0.0)
    anomaly_count = Column(Integer, default=0)
    average_confidence = Column(Float, default=0.0)
    processing_time_seconds = Column(Float, default=0.0)

    exact_matches = Column(Integer, default=0)
    fuzzy_matches = Column(Integer, default=0)
    semantic_matches = Column(Integer, default=0)

    error_message = Column(String, nullable=True)

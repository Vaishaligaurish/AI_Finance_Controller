from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from ..core.database import Base
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, index=True)
    transaction_id = Column(String, index=True)
    source = Column(String)

    bank_date = Column(String, nullable=True)
    bank_vendor = Column(String, nullable=True)
    bank_amount = Column(Float, nullable=True)
    bank_currency = Column(String, nullable=True)

    matched_ledger_id = Column(String, nullable=True)
    ledger_date = Column(String, nullable=True)
    ledger_vendor = Column(String, nullable=True)
    ledger_amount = Column(Float, nullable=True)
    ledger_currency = Column(String, nullable=True)

    amount_difference = Column(Float, nullable=True)
    date_difference_days = Column(Integer, nullable=True)

    vendor_similarity = Column(Float, nullable=True)
    description_similarity = Column(Float, nullable=True)
    reference_similarity = Column(Float, nullable=True)
    semantic_similarity = Column(Float, nullable=True)

    semantic_used = Column(Boolean, default=False)
    confidence_score = Column(Float, nullable=True)
    status = Column(String)
    exception_category = Column(String, nullable=True)
    match_type = Column(String)
    reasoning = Column(String, nullable=True)

    anomaly_status = Column(Boolean, default=False)
    anomaly_score = Column(Float, nullable=True)

    processing_timestamp = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import Column, String, Integer, Float, DateTime
from ..core.database import Base
from datetime import datetime

class ExceptionRecord(Base):
    __tablename__ = "exceptions"

    id = Column(Integer, primary_key=True, index=True)
    exception_id = Column(String, unique=True, index=True)
    run_id = Column(String, index=True)
    transaction_row_id = Column(Integer)
    transaction_id = Column(String)

    category = Column(String)
    severity = Column(String)
    confidence_score = Column(Float, nullable=True)

    amount_difference = Column(Float, nullable=True)
    date_difference = Column(Integer, nullable=True)

    system_reasoning = Column(String)
    suggested_resolution = Column(String)

    status = Column(String)
    resolution_comment = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

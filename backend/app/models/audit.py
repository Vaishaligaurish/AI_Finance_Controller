from sqlalchemy import Column, String, Integer, DateTime
from ..core.database import Base
from datetime import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action = Column(String)
    transaction_id = Column(String, nullable=True)
    details = Column(String)

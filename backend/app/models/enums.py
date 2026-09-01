import enum

class RunStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class TransactionStatus(str, enum.Enum):
    AUTO_MATCH = "AUTO_MATCH"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    UNRESOLVED_EXCEPTION = "UNRESOLVED_EXCEPTION"

class MatchType(str, enum.Enum):
    EXACT = "EXACT"
    FUZZY = "FUZZY"
    SEMANTIC = "SEMANTIC"
    NONE = "NONE"

class ExceptionSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ExceptionStatus(str, enum.Enum):
    UNRESOLVED = "UNRESOLVED"
    RESOLVED_APPROVED = "RESOLVED_APPROVED"
    RESOLVED_REJECTED = "RESOLVED_REJECTED"
    RESOLVED = "RESOLVED"

class ResolutionAction(str, enum.Enum):
    approve = "approve"
    reject = "reject"
    resolve = "resolve"

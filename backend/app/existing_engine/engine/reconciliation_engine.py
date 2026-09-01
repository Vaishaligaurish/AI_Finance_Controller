import pandas as pd
import uuid
from datetime import datetime
from ...models.enums import TransactionStatus, MatchType, ExceptionSeverity, ExceptionStatus
from .fuzzy_matcher import perform_fuzzy_match
from .semantic_matcher import perform_semantic_match
from .anomaly_detector import detect_anomalies

def process_reconciliation(run_id, bank_path, ledger_path, db):
    from ...models.reconciliation import ReconciliationRun
    from ...models.transaction import Transaction
    from ...models.exception import ExceptionRecord
    from ...models.audit import AuditLog
    
    bank_df = pd.read_csv(bank_path)
    ledger_df = pd.read_csv(ledger_path)
    
    start_time = datetime.utcnow()
    total_bank = len(bank_df)
    total_ledger = len(ledger_df)
    
    matched_records = 0
    review_records = 0
    unresolved_records = 0
    exact_matches = 0
    fuzzy_matches = 0
    semantic_matches = 0
    
    for idx, bank_row in bank_df.iterrows():
        b_id = str(bank_row.get("transaction_id", ""))
        b_amount = float(bank_row.get("amount", 0))
        b_vendor = str(bank_row.get("vendor", ""))
        b_date = str(bank_row.get("date", ""))
        
        # Exact match
        exact_match = ledger_df[(ledger_df['transaction_id'] == b_id) | 
                               ((ledger_df['amount'] == b_amount) & (ledger_df['vendor'].str.lower() == b_vendor.lower()))]
        
        confidence = 0
        match_type = MatchType.NONE
        status = TransactionStatus.UNRESOLVED_EXCEPTION
        category = "MISSING_LEDGER_RECORD"
        l_id, l_vendor, l_amount, l_date = None, None, None, None
        reasoning = "No match found in ledger"
        
        if not exact_match.empty:
            match = exact_match.iloc[0]
            confidence = 100
            match_type = MatchType.EXACT
            l_id = str(match.get("transaction_id", ""))
            l_vendor = str(match.get("vendor", ""))
            l_amount = float(match.get("amount", 0))
            l_date = str(match.get("date", ""))
            exact_matches += 1
            if b_amount != l_amount:
                category = "AMOUNT_MISMATCH"
                confidence = 70
                reasoning = f"Exact match but amount differs: Bank {b_amount}, Ledger {l_amount}"
            else:
                category = None
                reasoning = "Exact match"
        else:
            # Fuzzy match
            f_match, f_score = perform_fuzzy_match(b_vendor, ledger_df['vendor'].tolist())
            if f_score > 85:
                match_type = MatchType.FUZZY
                confidence = f_score
                fuzzy_matches += 1
                match = ledger_df[ledger_df['vendor'] == f_match].iloc[0]
                l_id = str(match.get("transaction_id", ""))
                l_vendor = str(match.get("vendor", ""))
                l_amount = float(match.get("amount", 0))
                l_date = str(match.get("date", ""))
                category = None if b_amount == l_amount else "AMOUNT_MISMATCH"
                reasoning = f"Fuzzy match on vendor. Score: {f_score}"
            else:
                # Semantic match
                s_match, s_score = perform_semantic_match(b_vendor, ledger_df['vendor'].tolist())
                if s_score > 0.75:
                    match_type = MatchType.SEMANTIC
                    confidence = s_score * 100
                    semantic_matches += 1
                    match = ledger_df[ledger_df['vendor'] == s_match].iloc[0]
                    l_id = str(match.get("transaction_id", ""))
                    l_vendor = str(match.get("vendor", ""))
                    l_amount = float(match.get("amount", 0))
                    l_date = str(match.get("date", ""))
                    category = None if b_amount == l_amount else "AMOUNT_MISMATCH"
                    reasoning = f"Semantic match. Score: {s_score}"
        
        if confidence >= 95 and category is None:
            status = TransactionStatus.AUTO_MATCH
            matched_records += 1
        elif confidence >= 75:
            status = TransactionStatus.REVIEW_REQUIRED
            review_records += 1
            if category is None: category = "LOW_CONFIDENCE_MATCH"
        else:
            status = TransactionStatus.UNRESOLVED_EXCEPTION
            unresolved_records += 1
            
        txn = Transaction(
            run_id=run_id,
            transaction_id=b_id,
            source="BANK",
            bank_date=b_date,
            bank_vendor=b_vendor,
            bank_amount=b_amount,
            bank_currency=str(bank_row.get("currency", "INR")),
            matched_ledger_id=l_id,
            ledger_date=l_date,
            ledger_vendor=l_vendor,
            ledger_amount=l_amount,
            confidence_score=confidence,
            status=status.value,
            exception_category=category,
            match_type=match_type.value,
            reasoning=reasoning
        )
        db.add(txn)
        
        if status in [TransactionStatus.REVIEW_REQUIRED, TransactionStatus.UNRESOLVED_EXCEPTION]:
            exc = ExceptionRecord(
                exception_id=str(uuid.uuid4()),
                run_id=run_id,
                transaction_row_id=idx,
                transaction_id=b_id,
                category=category,
                severity=ExceptionSeverity.HIGH.value if category == "AMOUNT_MISMATCH" else ExceptionSeverity.MEDIUM.value,
                confidence_score=confidence,
                system_reasoning=reasoning,
                suggested_resolution="Review amount and vendor details",
                status=ExceptionStatus.UNRESOLVED.value
            )
            db.add(exc)
            
    db.commit()
    
    run = db.query(ReconciliationRun).filter(ReconciliationRun.run_id == run_id).first()
    run.status = "COMPLETED"
    run.completed_at = datetime.utcnow()
    run.total_records = total_bank
    run.total_value = bank_df['amount'].sum() if 'amount' in bank_df.columns else 0.0
    run.matched_records = matched_records
    run.review_records = review_records
    run.unresolved_records = unresolved_records
    run.match_rate = (matched_records / total_bank) * 100 if total_bank > 0 else 0.0
    run.exact_matches = exact_matches
    run.fuzzy_matches = fuzzy_matches
    run.semantic_matches = semantic_matches
    
    db.add(AuditLog(run_id=run_id, action="RECONCILIATION_COMPLETED", details="Engine finished successfully"))
    db.commit()

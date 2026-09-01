try:
    from sklearn.ensemble import IsolationForest
except Exception:
    IsolationForest = None

def detect_anomalies(amounts):
    if IsolationForest is None or len(amounts) < 5:
        return [False]*len(amounts)
    clf = IsolationForest(contamination=0.05)
    preds = clf.fit_predict([[a] for a in amounts])
    return [p == -1 for p in preds]

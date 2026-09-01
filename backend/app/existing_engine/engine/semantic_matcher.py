try:
    from sentence_transformers import SentenceTransformer, util
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception:
    model = None

def perform_semantic_match(query, choices):
    if model is None or not choices or not isinstance(query, str):
        return None, 0
    query_emb = model.encode(query)
    doc_emb = model.encode(choices)
    scores = util.cos_sim(query_emb, doc_emb)[0]
    best_idx = scores.argmax().item()
    return choices[best_idx], scores[best_idx].item()

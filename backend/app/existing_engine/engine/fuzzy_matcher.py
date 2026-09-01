from rapidfuzz import process, fuzz

def perform_fuzzy_match(query, choices):
    if not choices or not isinstance(query, str):
        return None, 0
    res = process.extractOne(query, choices, scorer=fuzz.ratio)
    if res:
        return res[0], res[1]
    return None, 0

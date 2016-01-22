def flatten_list(l):
    return [item for sublist in l for item in sublist]

def remove_duplicates(l):
    return list(set(l))

def safe_get(lst, index, default):
    try:
        return lst[index]
    except IndexError:
        return default

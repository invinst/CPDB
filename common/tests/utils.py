import copy


def sum_count(category):
    """Sum up `size` key of all child objects."""
    if 'size' in category:
        return category['size']
    else:
        count = 0
        subcats = copy.copy(category['children'])
        while(subcats):
            subcat = subcats.pop()
            if 'size' in subcat:
                count += subcat['size']
            else:
                subcats.extend(subcat['children'])
        return count


def get_category_obj(data, category_name):
    """Extract obj with `name` == `category_name` from `data`."""
    cats = copy.copy(data)
    while(cats):
        cat = cats.pop()
        if cat['name'] == category_name:
            return cat
        if 'children' in cat:
            cats.extend(cat['children'])
    return None

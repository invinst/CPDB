def build_query_string_from_session(session):
    parts = []
    for objs in session.query.get('filters', {}).values():
        for obj in objs:
            if 'filter' in obj:
                parts.append(obj['filter'])
            else:
                parts.append('%s=%s' % (obj['category'], obj['value']))
    return '&'.join(parts)

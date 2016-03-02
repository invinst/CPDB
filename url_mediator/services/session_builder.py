class Node(object):
    supported_attributes = []
    node_name = 'unknown'

    def __init__(self, *args, **kwargs):
        self.children = args
        self.attributes = kwargs
        self._check_attributes()

    def build(self):
        raise NotImplementedError

    def _check_attributes(self):
        for attribute in self.attributes:
            if attribute not in self.supported_attributes:
                raise Exception('The attribute "{attribute}" is not valid'.format(attribute=attribute))


class SimpleNode(Node):
    def build(self):
        if not self.children:
            return {}

        return self._build_children()

    def _build_children(self):
        result = {}

        for child in self.children:
            if not isinstance(child, Node):
                raise Exception('Invalid node type: {child_type}, session_builder.Node is expected'.format(
                    child_type=type(child))
                )
            result[child.node_name] = child.build()

        return result


class Builder(SimpleNode):
    node_name = 'root'


class ActiveOfficers(Node):
    node_name = 'active_officers'
    supported_attributes = ['pks']

    def build(self):
        return self.attributes['pks']


class ActiveComplaints(Node):
    node_name = 'active_complaints'
    supported_attributes = ['crids']

    def build(self):
        return self.attributes['crids']


class FilterTags(SimpleNode):
    node_name = 'filters'


class AllegationCrid(Node):
    node_name = 'allegation__crid'
    supported_attributes = ['crids']

    def build(self):
        results = []

        for crid in self.attributes['crids']:
            crid = str(crid)

            results.append({
                "displayValue": crid,
                "value": crid,
                "category": "allegation__crid",
                "pinned": False,
                "displayCategory": "Allegation ID"
            })

        return results

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

            result = self._build_child(result, child)
        return result

    def _build_child(self, result, child):
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


class VirtualNode(Node):
    pass


class FilterTags(SimpleNode):
    node_name = 'filters'

    def build(self):
        result = {}

        for child in self.children:
            if (isinstance(child, VirtualNode)):
                built_nodes = child.build()

                for node in built_nodes:
                    result = self._build_child(result, node)
            else:
                result = self._build_child(result, child)

        return result


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


class AllegationType(Node):
    node_name = 'cat'
    supported_attributes = ['categories']

    def build(self):
        results = []

        for value, displayValue in self.attributes['categories']:
            results.append({
                "displayValue": displayValue,
                "value": value,
                "category": "cat",
                "pinned": False,
                "displayCategory": "Allegation Type"
            })

        return results


class SuggestionsNode(Node):
    node_name = ''
    supported_attributes = ['suggestions']

    def build(self):
        results = []

        for suggestion in self.attributes['suggestions']:
            result = suggestion['tagValue']
            result['pinned'] = False
            results.append(result)

        return results


class FromSuggestions(VirtualNode):
    supported_attributes = ['suggestions']
    node_name = ''

    def build(self):
        built_nodes = []

        for display_category, suggestions in self.attributes['suggestions'].items():
            klass_name = '{category}SuggestionNode'.format(category=display_category)
            node_name = suggestions[0]['tagValue']['category']
            klass = type(klass_name, (SuggestionsNode,), {'node_name': node_name})
            built_nodes.append(klass(suggestions=suggestions))

        return built_nodes

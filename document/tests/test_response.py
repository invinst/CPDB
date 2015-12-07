from common.tests.core import SimpleTestCase
from document import response


class ResponseTestCase(SimpleTestCase):
    def test_json_reponse_protect_safe(self):
        response.JsonResponse.when.called_with([1]).should.throw(
            TypeError,
            'In order to allow non-dict objects to be serialized set the safe parameter to False'
        )

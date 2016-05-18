from mock import MagicMock, patch

from allegation.factories import AreaFactory
from common.management.commands.reimport_school_grounds import Command
from common.models import Area
from common.tests.core import SimpleTestCase


class ReImportSchoolGroundsTest(SimpleTestCase):
    def setUp(self):
        self.command = Command()

    def test_remove_all_school_grounds_area(self):
        AreaFactory(type='school-grounds')
        Area.objects.filter(type='school-grounds').should.have.length_of(1)
        self.command.remove_all_school_grounds_area()
        Area.objects.filter(type='school-grounds').should.have.length_of(0)

    def test_update_all_non_types_to_school_grounds(self):
        AreaFactory(type='')
        Area.objects.filter(type='').should.have.length_of(1)
        self.command.update_all_non_types_to_school_grounds()
        Area.objects.filter(type='').should.have.length_of(0)
        Area.objects.filter(type='school-grounds').should.have.length_of(1)

    @patch('common.management.commands.reimport_school_grounds.LayerMapping')
    def test_map_shape_file_to_model(self, mock):
        save_mock = MagicMock()
        mock.return_value.save = save_mock

        self.command.map_shape_file_to_model(file_path='file_path')
        save_mock.called.should.equal(True)

    def test_handle(self):
        self.command.update_all_non_types_to_school_grounds = MagicMock()
        self.command.remove_all_school_grounds_area = MagicMock()
        self.command.map_shape_file_to_model = MagicMock()

        self.command.handle(file='file_path')

        self.command.remove_all_school_grounds_area.called.should.equal(True)
        self.command.update_all_non_types_to_school_grounds.called.should.equal(True)
        self.command.map_shape_file_to_model.called.should.equal(True)

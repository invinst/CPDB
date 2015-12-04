import codecs

import django_nose
from django_nose.plugin import ResultPlugin, DjangoSetUpPlugin, TestReorderer
from django_nose.runner import _get_plugins_from_settings
from nose.core import TestProgram, TextTestRunner
from nose.result import TextTestResult

from common.tests.core import BaseLiveTestCase, world


class DjangoNoseTextTestResult(TextTestResult):
    def try_take_screen_short(self, test):
        if not isinstance(test.test, BaseLiveTestCase):
            return
        test.test.get_screen_shot(test.test._testMethodName)

    def addError(self, test, err):
        self.try_take_screen_short(test)
        super(DjangoNoseTextTestResult, self).addError(test, err)

    def addFailure(self, test, err):
        self.try_take_screen_short(test)
        super(DjangoNoseTextTestResult, self).addFailure(test, err)

    def addSuccess(self, test):
        super(DjangoNoseTextTestResult, self).addSuccess(test)


class DjangoNoseTextTestRunner(TextTestRunner):
    resultclass = DjangoNoseTextTestResult

    def _makeResult(self):
        return self.resultclass(self.stream,
                                self.descriptions,
                                self.verbosity,
                                self.config)


class NoseTestProgram(TestProgram):
    def runTests(self):
        if isinstance(self.testRunner, type):
            self.testRunner = self.testRunner(stream=self.config.stream,
                                              verbosity=self.config.verbosity,
                                              config=self.config)
        return super(NoseTestProgram, self).runTests()


class DjangoNoseTestSuiteRunner(django_nose.NoseTestSuiteRunner):
    test_runner = DjangoNoseTextTestRunner
    test_program = NoseTestProgram

    def run_suite(self, nose_argv):
        """Run the test suite."""
        result_plugin = ResultPlugin()
        plugins_to_add = [DjangoSetUpPlugin(self),
                          result_plugin,
                          TestReorderer()]

        for plugin in _get_plugins_from_settings():
            plugins_to_add.append(plugin)
        try:
            import django
            django.setup()
        except AttributeError:
            # Setup isn't necessary in Django < 1.7
            pass

        self.test_program(argv=nose_argv, exit=False, addplugins=plugins_to_add, testRunner=DjangoNoseTextTestRunner)
        self.save_javascript_coverage()
        return result_plugin.result

    def save_javascript_coverage(self):
        if BaseLiveTestCase.source_dir:
            output_file = os.path.join(BaseLiveTestCase.source_dir, 'coverage_{time}.txt'.format(time=time.time()))
            with codecs.open(output_file, 'w', 'utf-8') as f:
                json.dump(f, world.js_coverages, indent =2)

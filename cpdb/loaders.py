"""
Custom template loaders.
"""

from itertools import product

from django.conf import settings
from django.core.exceptions import SuspiciousFileOperation
from django.template.loaders.app_directories import Loader as AppDirectoriesLoader
from django.template.utils import get_app_template_dirs
from django.utils._os import safe_join


class BlackListAppDirectoriesLoader(AppDirectoriesLoader):
    is_usable = True

    def get_template_sources(self, template_name, template_dirs=None):
        """
        Same as `AppDirectoriesLoader.get_template_sources` but apps in
        TEMPLATE_APP_DIRS_BLACK_LIST will not have it's templates loaded.
        """
        if not template_dirs:
            template_dirs = get_app_template_dirs('templates')

        template_dirs = list(template_dirs)
        for app, tmpl_dir in product(settings.TEMPLATE_APP_DIRS_BLACK_LIST, template_dirs):
            if '%s/templates' % app in tmpl_dir and tmpl_dir in template_dirs:
                template_dirs.remove(tmpl_dir)
        template_dirs = tuple(template_dirs)

        for template_dir in template_dirs:
            try:
                yield safe_join(template_dir, template_name)
            except SuspiciousFileOperation:
                # The joined path was located outside of this template_dir
                # (it might be inside another one, so this isn't fatal).
                pass

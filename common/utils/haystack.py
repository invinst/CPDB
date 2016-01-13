from haystack.management.commands.rebuild_index import Command as RebuildIndexCommand


def rebuild_index():
    cmd = RebuildIndexCommand()
    cmd.handle(interactive=False, verbosity=0)

from tqdm import tqdm


def apply_with_progress_bar(desc=None):
    def decorator(key_func):
        def func_wrapper(iterable):
            pbar = tqdm(total=len(iterable), desc=desc)
            for obj in iterable:
                pbar.update()
                key_func(obj)
            pbar.close()
        return func_wrapper
    return decorator

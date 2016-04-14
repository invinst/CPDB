def build_tweet_permalink(status):
    return 'https://twitter.com/{screen_name}/status/{id}'.format(screen_name=status.user.screen_name, id=status.id)

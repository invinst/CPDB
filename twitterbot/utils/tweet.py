def build_tweet_permalink(tweet):
    return 'https://twitter.com/{screen_name}/status/{id}'.format(screen_name=tweet.user.screen_name, id=tweet.id)

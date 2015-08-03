from django.db import models


class Story(models.Model):
    officer = models.ForeignKey('common.Officer')
    title = models.CharField(max_length=254)
    slug = models.SlugField(max_length=254)
    short_description = models.TextField()
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    custom_order = models.IntegerField(default=1)

    class Meta:
        verbose_name_plural = 'Stories'

    def __str__(self):
        return self.title

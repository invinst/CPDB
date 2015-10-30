from rest_framework import serializers

from officer.models import Story


class StorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Story
        fields = ('id',
                  'officer',
                  'title',
                  'slug',
                  'short_description',
                  'content',
                  'story_type',
                  'created_date',
                  'url',
                  )

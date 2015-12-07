import factory
from django.contrib.auth import get_user_model
from faker import Faker


faker = Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    pk = None
    username = factory.Sequence(lambda n: u'User{0}'.format(n))
    password = 'password'

    is_superuser = True
    is_staff = True
    is_active = True

    @classmethod
    def _prepare(cls, create, **kwargs):
        password = kwargs.pop('password', None)
        user = super(UserFactory, cls)._prepare(create, **kwargs)
        if password:
            user.raw_password = password
            user.set_password(password)
            if create:
                user.save()
        return user


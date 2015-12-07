from django.core.urlresolvers import reverse


def mobile_url_for(resource, resource_key):
    base_url = reverse('mobile:home')
    return '{base_url}{resource}/{sub_uri}'.format(base_url=base_url, resource=resource,
                                                   sub_uri=sub_uri)


def sub_uri_for_officer(officer):
    return '{officer.display_name}/{officer.id}'.format(officer=officer

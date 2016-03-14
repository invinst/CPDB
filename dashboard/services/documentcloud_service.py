import re


class DocumentcloudService(object):
    def parse_document_link(self, link, document_type='CR'):
        # Example link: https://www.documentcloud.org/documents/1273509-cr-1002643.html
        pattern = re.compile('https://www.documentcloud\.org/documents/'
                             '(?P<documentcloud_id>\d+)-(?P<normalized_title>cr-(?P<allegation_crid>\d+))\.html')

        if document_type == 'CPB':
            # will update when we got format for CPB link
            pass

        matched = re.match(pattern, link)
        if matched:
            return {
                'documentcloud_id': matched.group('documentcloud_id'),
                'allegation_crid': matched.group('allegation_crid'),
                'normalized_title': matched.group('normalized_title')
            }
        else:
            return False

    def get_title(self, body):
        title_tag = '<title>'
        end_title_tag = '</title>'
        title_tag_idx = body.find(title_tag)
        end_title_tag_idx = body.find(end_title_tag)

        return body[title_tag_idx+len(title_tag):end_title_tag_idx]

    def get_working_document(self, id, link):
        self.parse_document_link(link)

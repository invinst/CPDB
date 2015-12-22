import csv

from common.management.commands.base_process_allegation_from_pdf import ProcessAllegationFromPdfBaseCommand

from common.models import Allegation, AllegationCategory


class Command(ProcessAllegationFromPdfBaseCommand):
    FIELD_NAMES = [
        'crid', 'raw_content', 'parsed_summary', 'existing_top_cat_code', 'existing_top_cat_text',
        'existing_sub_cat_code', 'existing_sub_cat_text', 'recommend_outcome', 'final_outcome',
        'recommend_finding', 'final_finding'
    ]

    rows = []

    def process_allegation(self, crid, content):
        fields = self.extract_fields(crid, content)

        row = {
            'crid': crid,
            'raw_content': content,
            'parsed_summary': fields['summary'],
        }

        if Allegation.objects.filter(crid=crid).exists():
            allegation = Allegation.objects.filter(crid=crid)[:1].get()
            additional_fields = self.additional_allegation_fields(allegation)
            row.update(additional_fields)

        self.rows.append(row)

    def additional_allegation_fields(self, allegation):
        row = {
            'recommend_outcome': allegation.recc_outcome,
            'recommend_finding': allegation.recc_finding,
            'final_outcome': allegation.final_outcome,
            'final_finding': allegation.final_finding
        }

        if allegation.cat is not None:
            row['existing_top_cat_code'] = allegation.cat.category_count
            row['existing_top_cat_text'] = allegation.cat.category
            row['existing_sub_cat_code'] = allegation.cat.cat_id
            row['existing_sub_cat_text'] = allegation.cat.allegation_name

        return row

    def post_pdf_processing(self):
        with open('extracted_allegations_from_pdf.csv', 'w') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=self.FIELD_NAMES)
            writer.writeheader()
            writer.writerows(self.rows)

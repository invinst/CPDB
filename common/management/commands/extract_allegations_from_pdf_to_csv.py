import csv

from common.management.commands.base_process_allegation_from_pdf import \
    ProcessAllegationFromPdfBaseCommand

from common.models import OfficerAllegation, Allegation


class Command(ProcessAllegationFromPdfBaseCommand):
    FIELD_NAMES = [
        'crid', 'raw_content', 'parsed_summary', 'existing_top_cat_code',
        'existing_top_cat_text', 'existing_sub_cat_code',
        'existing_sub_cat_text', 'recommend_outcome', 'final_outcome',
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
            officer_allegation = OfficerAllegation.objects.filter(
                allegation__crid=crid)[:1].get()
            additional_fields = self.additional_allegation_fields(
                officer_allegation)
            row.update(additional_fields)

        self.rows.append(row)

    def additional_allegation_fields(self, officer_allegation):
        row = {
            'recommend_outcome': officer_allegation.recc_outcome,
            'recommend_finding': officer_allegation.recc_finding,
            'final_outcome': officer_allegation.final_outcome,
            'final_finding': officer_allegation.final_finding
        }

        if officer_allegation.cat is not None:
            row['existing_top_cat_code'] = \
                officer_allegation.cat.category_count
            row['existing_top_cat_text'] = officer_allegation.cat.category
            row['existing_sub_cat_code'] = officer_allegation.cat.cat_id
            row['existing_sub_cat_text'] = \
                officer_allegation.cat.allegation_name

        return row

    def post_pdf_processing(self):
        with open('extracted_allegations_from_pdf.csv', 'w') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=self.FIELD_NAMES)
            writer.writeheader()
            writer.writerows(self.rows)

class TimelineService(object):

    @classmethod
    def get_timeline(cls, officer_allegations):
        allegations_date = officer_allegations\
            .values_list('allegation__incident_date_only', 'start_date')\
            .order_by('allegation__incident_date')

        items = []
        for date in allegations_date:
            if not date[0] and date[1]:
                items.append(date[1])
            elif date[0]:
                items.append(date[0])

        return sorted(items)

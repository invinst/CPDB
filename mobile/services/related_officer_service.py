from common.models import Officer


class RelatedOfficerService(object):
    @staticmethod
    def co_accused_officers(officer_id):
        sql = '''
          SELECT *
          FROM (
            SELECT officer_id, count(DISTINCT crid) AS num_allegations
            FROM common_allegation WHERE crid IN (
              SELECT DISTINCT crid
              FROM common_allegation
              WHERE officer_id=%(officer_id)s
            ) AND officer_id!=%(officer_id)s
            GROUP BY officer_id
          ) AS t1
          INNER JOIN common_officer ON t1.officer_id = common_officer.id
          ORDER BY allegations_count DESC, num_allegations DESC
        '''

        return Officer.objects.raw(sql, {'officer_id': officer_id})

    @staticmethod
    def witness_officers(officer_id):
        sql = '''
          SELECT *
          FROM (
            SELECT officer_id, count(DISTINCT crid) AS num_allegations
            FROM common_policewitness
            WHERE crid IN (
              SELECT crid
              FROM common_allegation
              WHERE officer_id=%(officer_id)s
            )
          GROUP BY officer_id
          ) AS t1
          INNER JOIN common_officer ON t1.officer_id=common_officer.id
          ORDER BY allegations_count DESC, num_allegations DESC
        '''

        return Officer.objects.raw(sql, {'officer_id': officer_id})

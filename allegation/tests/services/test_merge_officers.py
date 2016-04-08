import datetime

from allegation.factories import (
    OfficerFactory, OfficerAllegationFactory, AllegationFactory, OfficerHistoryFactory, PoliceWitnessFactory)
from allegation.services.merge_officers import (
    copy_missing_officer_fields, merge_officer_allegation, merge_officer_history, merge_police_witness,
    update_officer_allegation_session, update_officer_session)
from common.tests.core import SimpleTestCase
from common.constants import ACTIVE_UNKNOWN_CHOICE, ACTIVE_YES_CHOICE
from share.factories import SessionFactory


class MergeOfficersTestCase(SimpleTestCase):
    def test_copy_missing_officer_fields(self):
        officer_1 = OfficerFactory(gender=None, race=None, birth_year=None, active=ACTIVE_UNKNOWN_CHOICE)
        officer_2 = OfficerFactory(active=ACTIVE_YES_CHOICE)
        copy_missing_officer_fields(officer_1, officer_2)
        officer_1.refresh_from_db()

        officer_1.gender.should.equal(officer_2.gender)
        officer_1.race.should.equal(officer_2.race)
        officer_1.birth_year.should.equal(officer_2.birth_year)
        officer_1.active.should.equal(officer_2.active)

    def test_merge_officer_allegations(self):
        officer_1 = OfficerFactory()
        officer_2 = OfficerFactory()
        oa_list_1 = OfficerAllegationFactory.create_batch(2, officer=officer_1)
        oa_list_2 = OfficerAllegationFactory.create_batch(2, officer=officer_2)
        allegation = AllegationFactory()
        oa_1 = OfficerAllegationFactory(
            allegation=allegation, officer=officer_1, cat=None, recc_finding=None, recc_outcome=None,
            final_outcome=None, final_outcome_class=None, start_date=None, end_date=None, final_finding=None)
        oa_2 = OfficerAllegationFactory(allegation=allegation, officer=officer_2)

        merge_officer_allegation(officer_1, officer_2)
        oa_1.refresh_from_db()

        set(oa.pk for oa in officer_1.officerallegation_set.all()).should.equal(
            set(oa.pk for oa in oa_list_1 + oa_list_2 + [oa_1]))

        for field in [
                'cat', 'recc_finding', 'recc_outcome', 'final_finding', 'final_outcome',
                'final_outcome_class', 'start_date', 'end_date']:
            getattr(oa_1, field).should.equal(getattr(oa_2, field))

    def test_merge_officer_history(self):
        officer_1 = OfficerFactory()
        officer_2 = OfficerFactory()
        officer_histories_1 = OfficerHistoryFactory.create_batch(2, officer=officer_1)
        officer_histories_2 = OfficerHistoryFactory.create_batch(2, officer=officer_2)
        intersect_as_of = datetime.date.today() - datetime.timedelta(days=1)
        oh_1 = OfficerHistoryFactory(officer=officer_1, as_of=intersect_as_of, unit=None, rank=None, star=None)
        oh_2 = OfficerHistoryFactory(officer=officer_2, as_of=intersect_as_of)

        merge_officer_history(officer_1, officer_2)

        oh_1.refresh_from_db()
        set(officer_1.officerhistory_set.all()).should.equal(set(officer_histories_1 + officer_histories_2 + [oh_1]))

        for field in ['unit', 'rank', 'star']:
            getattr(oh_1, field).should.equal(getattr(oh_2, field))

    def test_merge_police_witness(self):
        officer_1 = OfficerFactory()
        officer_2 = OfficerFactory()
        pws_1 = PoliceWitnessFactory.create_batch(2, officer=officer_1)
        pws_2 = PoliceWitnessFactory.create_batch(2, officer=officer_2)
        intersect_allegation = AllegationFactory()
        pw_1 = PoliceWitnessFactory(officer=officer_1, allegation=intersect_allegation, gender=None, race=None)
        pw_2 = PoliceWitnessFactory(officer=officer_2, allegation=intersect_allegation)

        merge_police_witness(officer_1, officer_2)

        pw_1.refresh_from_db()
        set(officer_1.policewitness_set.all()).should.equal(set(pws_1 + pws_2 + [pw_1]))

        for field in ['gender', 'race']:
            getattr(pw_1, field).should.equal(getattr(pw_2, field))

    def test_update_officer_allegation_session(self):
        ids_to_update = [
            (OfficerAllegationFactory().id, OfficerAllegationFactory().id)
            for i in range(2)]
        session_1 = SessionFactory(query={'filters': {'id': [{'value': ids_to_update[0][0]}]}})
        SessionFactory(query={'filters': {'def': [{'value': ids_to_update[0][0]}]}})
        session_2 = SessionFactory(query={'activeComplaints': [ids_to_update[1][0]]})
        SessionFactory(query={'abc': ids_to_update[1][0]})

        update_officer_allegation_session(ids_to_update)

        session_1.refresh_from_db()
        session_1.query['filters']['id'][0]['value'].should.equal(ids_to_update[0][1])

        session_2.refresh_from_db()
        session_2.query['activeComplaints'][0].should.equal(ids_to_update[1][1])

    def test_update_officer_session(self):
        officer_1 = OfficerFactory()
        officer_2 = OfficerFactory()
        session = SessionFactory(query={'active_officers': [officer_2.pk]})
        SessionFactory(query={'cde': officer_2.pk})

        update_officer_session(officer_1, officer_2)

        session.refresh_from_db()
        session.query['active_officers'][0].should.equal(officer_1.pk)

from common.constants import ACTIVE_UNKNOWN_CHOICE
from common.models import OfficerAlias
from share.models import Session


def update_fields(obj_1, obj_2, keys):
    for key in keys:
        if getattr(obj_1, key) is None:
            setattr(obj_1, key, getattr(obj_2, key))
    obj_1.save()


def copy_missing_officer_fields(officer_1, officer_2):
    if officer_1.active == ACTIVE_UNKNOWN_CHOICE:
        officer_1.active = officer_2.active

    update_fields(officer_1, officer_2, [
        'gender', 'race', 'appt_date', 'unit', 'rank', 'star',
        'allegations_count', 'discipline_count', 'birth_year'])


def merge_officer_allegation(officer_1, officer_2):
    officer_allegations_1 = officer_1.officerallegation_set.all()
    officer_allegations_2 = officer_2.officerallegation_set.all()
    allegation_1_ids = officer_allegations_1.values_list('allegation_id', flat=True)
    outstanding_officer_allegations = officer_allegations_2.exclude(allegation_id__in=allegation_1_ids)
    intersect_officer_allegations = officer_allegations_2.filter(allegation_id__in=allegation_1_ids)

    ids_to_update = []

    outstanding_officer_allegations.update(officer=officer_1)

    for oa_to_remove in intersect_officer_allegations:
        oa_to_keep = officer_allegations_1.get(allegation_id=oa_to_remove.allegation_id)
        update_fields(oa_to_keep, oa_to_remove, [
            'cat', 'recc_finding', 'recc_outcome', 'final_finding', 'final_outcome',
            'final_outcome_class', 'start_date', 'end_date'])
        ids_to_update.append((oa_to_remove.pk, oa_to_keep.pk))
        oa_to_remove.delete()

    return ids_to_update


def merge_officer_history(officer_1, officer_2):
    officer_histories_1 = officer_1.officerhistory_set.all()
    officer_histories_2 = officer_2.officerhistory_set.all()

    officer_histories_2.filter(effective_date__isnull=True, end_date__isnull=True).update(officer=officer_1)

    officer_histories_1_effective_end_dates = officer_histories_1.exclude(
        effective_date__isnull=True, end_date__isnull=True).values_list('effective_date', 'end_date')
    intersect_histories = []

    for effective_date, end_date in officer_histories_1_effective_end_dates:
        intersect_histories += officer_histories_2.filter(effective_date=effective_date, end_date=end_date)

    for oh_to_remove in intersect_histories:
        oh_to_keep = officer_histories_1.get(
            effective_date=oh_to_remove.effective_date, end_date=oh_to_remove.end_date)
        update_fields(oh_to_keep, oh_to_remove, ['unit', 'rank', 'star'])
        oh_to_remove.delete()

    officer_histories_2.all().update(officer=officer_1)


def merge_police_witness(officer_1, officer_2):
    police_witnesses_1 = officer_1.policewitness_set.all()
    police_witnesses_2 = officer_2.policewitness_set.all()

    police_witnesses_1_allegation_ids = police_witnesses_1.values_list('allegation_id', flat=True)
    outstanding_witnesses = police_witnesses_2.exclude(allegation_id__in=police_witnesses_1_allegation_ids)
    intersect_witnesses = police_witnesses_2.filter(allegation_id__in=police_witnesses_1_allegation_ids)

    outstanding_witnesses.update(officer=officer_1)

    for pw_to_remove in intersect_witnesses:
        pw_to_keep = police_witnesses_1.get(allegation_id=pw_to_remove.allegation_id)
        update_fields(pw_to_keep, pw_to_remove, ['gender', 'race'])
        pw_to_remove.delete()


def update_officer_allegation_session(update_ids):
    for old_id, new_id in update_ids:
        # update filters
        for session in Session.objects.filter(query__icontains='"value": %d' % old_id):
            try:
                for obj in session.query['filters']['id']:
                    if obj['value'] == old_id:
                        obj['value'] = new_id
                        session.save()
                        break
            except KeyError:
                pass

        # update active complaints
        for session in Session.objects.filter(query__icontains=str(old_id)):
            if old_id in session.query.get('activeComplaints', []):
                active_complaints = set(session.query['activeComplaints'])
                active_complaints.remove(old_id)
                active_complaints.add(new_id)
                session.query['activeComplaints'] = list(active_complaints)
                session.save()


def update_officer_session(officer_1, officer_2):
    for session in Session.objects.filter(query__icontains='"value": %d' % officer_2.pk):
        try:
            for obj in session.query['filters']['officer']:
                if obj['value'] == officer_2.pk:
                    obj['value'] = officer_1.pk
                    session.save()
                    break
        except KeyError:
            pass

    for session in Session.objects.filter(query__icontains=str(officer_2.pk)):
        if officer_2.pk in session.query.get('active_officers', []):
            active_officers = set(session.query['active_officers'])
            active_officers.remove(officer_2.pk)
            active_officers.add(officer_1.pk)
            session.query['active_officers'] = list(active_officers)
            session.save()


def merge_officers(officer_1, officer_2):
    copy_missing_officer_fields(officer_1, officer_2)
    merge_officer_history(officer_1, officer_2)
    merge_police_witness(officer_1, officer_2)
    officer_allegation_ids = merge_officer_allegation(officer_1, officer_2)
    update_officer_allegation_session(officer_allegation_ids)
    update_officer_session(officer_1, officer_2)
    OfficerAlias.objects.create(new_officer=officer_1, old_officer_id=officer_2.pk)
    officer_2.delete()

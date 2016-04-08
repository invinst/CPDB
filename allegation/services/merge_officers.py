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

    officer_histories_1_as_ofs = officer_histories_1.values_list('as_of', flat=True)
    outstanding_histories = officer_histories_2.exclude(as_of__in=officer_histories_1_as_ofs)
    intersect_histories = officer_histories_2.filter(as_of__in=officer_histories_1_as_ofs)

    outstanding_histories.update(officer=officer_1)

    for oh_to_remove in intersect_histories:
        oh_to_keep = officer_histories_1.get(as_of=oh_to_remove.as_of)
        update_fields(oh_to_keep, oh_to_remove, ['unit', 'rank', 'star'])
        oh_to_remove.delete()


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
                session.query['activeComplaints'].remove(old_id)
                session.query['activeComplaints'].append(new_id)
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
            session.query['active_officers'].remove(officer_2.pk)
            session.query['active_officers'].append(officer_1.pk)
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

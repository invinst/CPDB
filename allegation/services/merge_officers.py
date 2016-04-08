from common.constants import ACTIVE_UNKNOWN_CHOICE


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

    for oa in outstanding_officer_allegations:
        oa.officer = officer_1
        oa.save()

    for oa_to_remove in intersect_officer_allegations:
        oa_to_keep = officer_allegations_1.get(allegation_id=oa_to_remove.allegation_id)
        update_fields(oa_to_keep, oa_to_remove, [
            'cat', 'recc_finding', 'recc_outcome', 'final_finding', 'final_outcome',
            'final_outcome_class', 'start_date', 'end_date'])
        # TODO: update session
        oa_to_remove.delete()


def merge_officer_history(officer_1, officer_2):
    officer_histories_1 = officer_1.officerhistory_set.all()
    officer_histories_2 = officer_2.officerhistory_set.all()

    officer_histories_1_as_ofs = officer_histories_1.values_list('as_of', flat=True)
    outstanding_histories = officer_histories_2.exclude(as_of__in=officer_histories_1_as_ofs)
    intersect_histories = officer_histories_2.filter(as_of__in=officer_histories_1_as_ofs)

    for oh in outstanding_histories:
        oh.officer = officer_1
        oh.save()

    for oh_to_remove in intersect_histories:
        oh_to_keep = officer_histories_1.get(as_of=oh_to_remove.as_of)
        update_fields(oh_to_keep, oh_to_remove, [
            'unit', 'rank', 'star'])
        # TODO: update session
        oh_to_remove.delete()


def merge_police_witness(officer_1, officer_2):
    police_witnesses_1 = officer_1.policewitness_set.all()
    police_witnesses_2 = officer_2.policewitness_set.all()

    police_witnesses_1_allegation_ids = police_witnesses_1.values_list('allegation_id', flat=True)
    outstanding_witnesses = police_witnesses_2.exclude(allegation_id__in=police_witnesses_1_allegation_ids)
    intersect_witnesses = police_witnesses_2.filter(allegation_id__in=police_witnesses_1_allegation_ids)

    for pw in outstanding_witnesses:
        pw.officer = officer_1
        pw.save()

    for pw_to_remove in intersect_witnesses:
        pw_to_keep = police_witnesses_1.get(allegation_id=pw_to_remove.allegation_id)
        update_fields(pw_to_keep, pw_to_remove, [
            'gender', 'race'])
        # TODO: update session
        pw_to_remove.delete()

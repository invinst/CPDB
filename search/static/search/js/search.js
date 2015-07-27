AUTOCOMPLETE_CATEGORY_NAMES = {
  'crid': 'Complaint ID',
  'cat__category': 'Category',
  'cat': 'Allegation type',
  'investigator': 'Investigator',
  'officer': 'Officer name',
  'officer__star': 'Badge number',
  'officer__unit': 'Officer Unit',
  'officer__rank': 'Officer Rank',
  'officer__gender': 'Officer Gender',
  'officer__race': 'Officer Race',
  'recc_outcome': 'Recommended Outcome',
  'recc_finding': 'Recommended Finding',
  'final_outcome': 'Final Outcome',
  'final_finding': 'Final Finding',
  'incident_date_only__year': 'Incident Year',
  'incident_date_only__year_month': 'Incident Year/Month',
  'incident_date_only': 'Incident Date',
  'areas__id': 'Area',
  'complainant_gender': 'Complainant Gender',
  'complainant_race': 'Complainant Race',
  'outcome_text': 'Outcome'
};

AUTOCOMPLETE_DISPLAY_CATEGORY_IN_TAG = [
  'officer__gender',
  'complainant_gender',
  'officer__race',
  'complainant_race'
];

function prettyLabels(label, term) {
  label = String(label).toLowerCase();
  term = String(term).toLowerCase();
  var re = new RegExp(term, 'i');
  var result = label.replace(/-/g, " ");
  result = result.replace(re, "<span class='term'>" + term + "</span>");
  return result;
}

(function () {
  var AUTOCOMPLETE_CAT_CLASS = 'ui-autocomplete-category';

  function category_elem(categoryName) {
    return "<li class='" + AUTOCOMPLETE_CAT_CLASS + "'>" + categoryName + "</li>"
  }

  $.widget("custom.catcomplete", $.ui.autocomplete, {
    _create: function () {
      this._super();
      this.widget().menu("option", "items", "> :not(." + AUTOCOMPLETE_CAT_CLASS + ")");
    },
    _renderMenu: function (ul, items) {
      var widget = this;
      var currentCategory = "";
      $.each(items, function (index, item) {
        if (item.category != currentCategory) {
          ul.append(category_elem(AUTOCOMPLETE_CATEGORY_NAMES[item.category]));
          currentCategory = item.category;
        }
        widget._renderItemData(ul, item);
      });
    },
    _renderItem: function (ul, item) {
      var label = item.type ? item.type + ": " + item.label : item.label;
      return $("<li>").addClass('autocomplete-' + item.category).html(prettyLabels(label, $(this.element).val())).appendTo(ul);
    }
  });
})();

function suggestionExists(term, suggestions) {
  for (var i = 0; i < suggestions.length; i++) {
    if (suggestions[i].label == term) {
      return true;
    }
  }
  return false;
}

function tagLabel(category, label){
  if (AUTOCOMPLETE_DISPLAY_CATEGORY_IN_TAG.indexOf(category) == -1) {
    return label;
  }
  return AUTOCOMPLETE_CATEGORY_NAMES[category] + ': ' + label;
}

function cpdbAutocomplete($input) {
  $($input).catcomplete({
    autoFocus: true,
    source: function (request, response) {
      $.ajax({
        url: "/search/suggest/",
        dataType: "json",
        data: {
          term: request.term
        },
        success: function (data) {
          var newData = [];
          $.each(data, function (i, subdata) {
            if (['start', 'crid', 'officer__star', 'officer_id'].indexOf(i) != -1) {
              // if request.term is found in the suggestion then we dont need to add this
              if (!suggestionExists(request.term, subdata)) {
                var freeTextData = {
                  category: i == 'officer_id' ? 'officer_name' : i,
                  label: request.term,
                  value: request.term
                };
                newData = newData.concat([freeTextData]);
              }
            }
            newData = newData.concat(subdata);
          });

          response(newData);
        }
      });
    },
    close: function (event, ui) {
      $($input).val('');
    },
    select: function (event, ui) {
      $('#cpdb-search').tagsinput("add", {
        text: tagLabel(ui.item.category, ui.item.label),
        value: [ui.item.category, ui.item.value]
      });
      $($input).val('');
    }
  });
}

cpdbAutocomplete($("#autocomplete"));

NO_CAP_CATEGORIES = [
  'has_filters'
];

function suggestionExists(term, suggestions) {
  for (var i = 0; i < suggestions.length; i++) {
    if (suggestions[i].label == term) {
      return true;
    }
  }
  return false;
}


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

  function renderCategoryElement(categoryName) {
    return "<li class='" + AUTOCOMPLETE_CAT_CLASS + "'>" + categoryName + "</li>"
  }

  $.widget("custom.catcomplete", $.ui.autocomplete, {
    tagLabel: function (category, label) {
      if (this.options.categoriesDisplayInTag.indexOf(category) == -1) {
        return label;
      }
      return this.options.categoryNames[category] + ': ' + label;
    },

    _create: function () {
      this._super();
      this.widget().menu("option", "items", "> :not(." + AUTOCOMPLETE_CAT_CLASS + ")");
    },
    _renderMenu: function (ul, items) {
      var widget = this;
      var currentCategory = "";
      $.each(items, function (index, item) {
        if (item.category != currentCategory) {
          ul.append(renderCategoryElement(widget.options.categoryNames[item.category]));
          currentCategory = item.category;
        }
        widget._renderItemData(ul, item);
      });
    },
    _renderItem: function (ul, item) {
      var label = item.type ? item.type + ": " + item.label : item.label;
      var element = $("<li>");

      if (NO_CAP_CATEGORIES.indexOf(item.category) == -1) {
        element.addClass('capitalize');
      }

      return element.addClass('autocomplete-' + item.category).html(prettyLabels(label, $(this.element).val())).appendTo(ul);
    },
    displayMessage: function (value) {
      var ul = this.menu.element.empty();
      ul.append(renderCategoryElement(value));
      this.isNewMenu = true;
      this.menu.refresh();

      ul.show();
    }
  });
})();

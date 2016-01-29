function suggestionExists(term, suggestions) {
  for (var i = 0; i < suggestions.length; i++) {
    if (suggestions[i].label == term) {
      return true;
    }
  }
  return false;
}

function slugify (title) {
  var asciiTitle = title.replace(/\s{2,}/g, ' ');
  var singleSpaceTitle = asciiTitle.replace(/[^\w\s]/gi, '').trim();
  var lowerCaseTitle  = singleSpaceTitle.toLowerCase();

  return lowerCaseTitle.replace(/\s/g, '-').trim();
}

function prettyLabels(label, term) {
  label = label.toString();

  var re = new RegExp("("+term+")", 'i');
  var result = label.replace(/-/g, " ");
  result = result.replace(re, "<span class='term'>$1</span>");
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
        var displayCategory = item.tagValue.displayCategory;
        if (displayCategory != currentCategory) {
          ul.append(renderCategoryElement(displayCategory));
          currentCategory = displayCategory;
        }
        widget._renderItemData(ul, item);
      });
    },

    _renderItem: function (ul, item) {
      var element = $("<li>");

      return element.addClass('autocomplete-' + slugify(item.tagValue.displayCategory)).html(prettyLabels(item.suggestValue, $(this.element).val())).appendTo(ul);
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

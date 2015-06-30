function prettyLabels(label, term){
    label = String(label).toLowerCase();
    term = String(term).toLowerCase();
    var re = new RegExp(term, 'i');
    var result = label.replace(/-/g," ");
    result = result.replace(re, "<span class='term'>" + term + "</span>");
    return result;
}
(function() {
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
        _renderItem: function(ul, item) {
            var label = item.type ? item.type + ": " + item.label : item.label;
            return $( "<li>").addClass('autocomplete-'+item.category).html( prettyLabels(label, $(this.element).val()) ).appendTo( ul );
        }
    });
})();

function suggestionExists(term, suggestions){
    for(var i = 0; i < suggestions.length; i++){
        if(suggestions[i].label == term){
            return true;
        }
    }
    return false;
}

function cpdbAutocomplete($input){
    $($input).catcomplete({
        autoFocus: true,
        source: function( request, response ) {
            $.ajax({
                url: "/search/suggest/",
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function( data ) {
                    var newData = [];
                    $.each(data, function(i, subdata) {
                        if (['start', 'crid', 'officer__star', 'officer_id'].indexOf(i) != -1) {
                            // if request.term is found in the suggestion then we dont need to add this
                            if(!suggestionExists(request.term, subdata)){
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

                    response( newData );
                }
            });
        },
        close: function(event, ui){
            $($input).val('');
        },
        select: function(event, ui){
            var text;
            if (ui.item.type) {
                text = ui.item.type
            } else {
                text = AUTOCOMPLETE_CATEGORY_NAMES[ui.item.category]
            }
            text = text + ": " + ui.item.label;
            $('#cpdb-search').tagsinput("add", {
                text: text,
                value: [ui.item.category,  ui.item.value]
            });
            $($input).val('');
        }
    });
}

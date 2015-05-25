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
                    ul.append(category_elem(item.category_name));
                    currentCategory = item.category;
                }
                widget._renderItemData(ul, item);
            });
        },
        _renderItem: function(ul, item) {
            return $( "<li>").addClass('autocomplete-'+item.category).text( item.label ).appendTo( ul );
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
                    var categories = data.categories;
                    delete data.categories;

                    var newData = [];
                    $.each(data, function(i, subdata) {
                        if (['officer_name', 'start', 'crid', 'officer_badge_number'].indexOf(i) != -1) {
                            // if request.term is found in the suggestion then we dont need to add this
                            if(!suggestionExists(request.term, subdata)){
                                var freeTextData = {
                                    category: i,
                                    category_name: categories[i],
                                    label: request.term
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
            $('#cpdb-search').tagsinput("add", {
                text: ui.item.category_name + ":" + ui.item.label,
                value: [ui.item.category,  ui.item.label]
            });
            $($input).val('');
        }
    });
}

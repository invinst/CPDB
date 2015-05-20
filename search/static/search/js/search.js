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
        }
    });

    $(function () {
        $('#cpdb-search').tagsinput({
            itemValue: 'value',
            itemText: 'text'
        });
        cpdbAutocomplete($('#cpdb-search').tagsinput("input"));
    });

    function cpdbAutocomplete($input){
        $($input).catcomplete({
            source: function( request, response ) {
                $.ajax({
                    url: "/search/suggest",
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function( data ) {
                        var newData = [];
                        $.each(data, function(i, subdata) {
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
})();

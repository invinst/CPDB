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

    $(function () {
        $('#cpdb-search').tagsinput({
            itemValue: 'value',
            itemText: 'text'
        });
        $('#cpdb-search').on('itemAdded', changeDataTableAjaxUrl);
        $('#cpdb-search').on('itemRemoved', changeDataTableAjaxUrl);
        cpdbAutocomplete($('#cpdb-search').tagsinput("input"));
    });

    function changeDataTableAjaxUrl(){
        var filter_query = "";
        $.each($('#cpdb-search').tagsinput("items"), function(index, value){
            if (typeof(value.value[1]) != 'object') {
                filter_query += "&" + value.value[0] + '=' + value.value[1];
            } else {
                filter_query += "&" + value.value[0] + '=' + value.value[1][1];  // seconds param as value
            }
        });
        allegation_table.ajax.url('/api/allegations/?' + filter_query).load();
    }

    function cpdbAutocomplete($input){
        $($input).catcomplete({
            autoFocus: true,
            source: function( request, response ) {
                $.ajax({
                    url: "/search/suggest",
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
                                var freeTextData = {
                                    category: i,
                                    category_name: categories[i],
                                    label: request.term
                                };
                                newData = newData.concat([freeTextData]);
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
})();

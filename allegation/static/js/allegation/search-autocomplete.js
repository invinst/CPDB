// Create the first autocomplete, which suggests the fields to search
createFieldAutocomplete();

function modifyLastElementWidth(){
    var width = $(".autocomplete-search").width() -24;
    $('.autocomplete-search > *').slice(0, -1).each(function() { width -= ($(this).width() + 7); });
    $(".autocomplete-search .search-group .field-search:last").width(width);
}

// Code to create a 'field' autocomplete
function createFieldAutocomplete() {
    // Append the <input> which will suggest search fields
    var searchGroup = $("<div class='search-group'/>");
    var searchElem = $('<input type="text" class="field-search">');
    searchGroup.append(searchElem);
    $('.autocomplete-search').append(searchGroup);

    modifyLastElementWidth();

    // Init Typeahead.js for said <input>
    searchElem.typeahead({
        highlight: true,
        minLength: 0,
        classNames: {
            menu: 'dropdown-menu'
        }
    },
    {
        source: function (query, syncResults) {
            // Add searchable fields here
            syncResults(searchable_fields);
        },
        limit: searchable_fields_length
    });

    // On selecting a field
    searchElem.bind('typeahead:select', function (ev, suggestion) {
        $(this).attr('size', suggestion.length);
        $(this).css("width", "auto");
        $(searchGroup).addClass("has-value");

        // Create an autocomplete for that field, plus a new field autocomplete after it
        var searchElem = $('<input type="text" class="' + suggestion + '-search">');
        searchGroup.append(searchElem);
        createValueAutocomplete(searchElem, suggestion);
        createFieldAutocomplete();
        searchElem.focus();
        modifyLastElementWidth();
    });
}

function createBloodhound(field) {
    return new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: autocomplete_json_url + '?field=' + field,
        remote: {
            url: autocomplete_json_url + '?field=' + field + '&query=%QUERY',
            wildcard: '%QUERY'
        }
    });
}

function valueEntered(){
    $(this).attr('size', $(this).val().length);
    $(".search-placeholder").click();
    modifyLastElementWidth();
}

// Code to create a 'value' autocomplete for a certain field
function createValueAutocomplete(searchElem, field) {
    searchElem.typeahead({
        highlight: true,
        classNames: {
            menu: 'dropdown-menu'
        }
    },
    {
        source: createBloodhound(field)
    });


    searchElem.bind('typeahead:select', function (ev, suggestion) {
        valueEntered.apply(this);
    });
    searchElem.on("keydown", function(e){
        if(e.keyCode == 13) {
            valueEntered.apply(this);
        }
    });
    return searchElem;
}

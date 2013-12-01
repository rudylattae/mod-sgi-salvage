var items = depot('boostSgiSalvage_items', {idAttribute:'id'});


function preparetableForThumbnails( table ) {
    table.find('thead tr').prepend('<th class="header">&nbsp;</th>');
    table.find('tbody tr').each(function(i, row) {
        var me = $(row);
        if ( me.find('.thumb').length == 0 ) {
            me.prepend('<td class="js-controls"></td>');            
        }
    });
}

function getItemSummariesFromTable( table ) {

    table.find('tbody tr').each(function(i, tableRow) { 
        if (i >= 4) return;  // throttle for quick testing
        var summary = getItemSummaryFromRow( tableRow );
        items.save(summary);
        updateItemRowWithThumbnail( tableRow, summary );
    });

}


function getItemSummaryFromRow( row ) {
    var rawUrl = $('td a', row).eq(1).attr('href'),
        detailsUrl = parseUrl(rawUrl),
        id = detailsUrl.params.stock_num

    return {
        id: id,
        store: detailsUrl.params.store,
        detailsUrl: detailsUrl
    };
}


function updateItemRowWithThumbnail( row, summary ) {

    $.get(summary.detailsUrl, function( data ){
        var srcImage = $('img[name="image1"]', data),
            a = $('<a class="thumb" target="_blank"></a>')
                        .attr('href', summary.detailsUrl),
            img = $('<img alt="loading..."/>')
                        .attr('src', srcImage[0].src)
                        .attr('width', 245)
                        .appendTo(a);

        $('.js-controls', row).append(a);
    });
}

function main() {
    var t = $('#bid_items');
    preparetableForThumbnails( t );
    getItemSummariesFromTable( t );
}
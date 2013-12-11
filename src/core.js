var core = (function() {
    "use strict";


    function TableRowIterator( el, logger ) {
        if ( typeof el === 'undefined' ) throw new Error('You must provide a table element');
        this._el = el;
        this._cursor = 1;
        this._columns = ['year', 'make', 'model', 'branch', 'location', 'stockNumber', 
                            'closingDate', 'reservePrice'];

        if ( $('tr', this._el).length === 0 && logger && logger.warn ) 
            logger.warn('The provided table does not have any rows');
    }

    TableRowIterator.prototype.hasNext = function hasNext() {
        return this._currentRow() ? this._currentRow().length > 0 : false;
    };

    TableRowIterator.prototype.next = function next() {
        if ( !this.hasNext() ) throw new Error('StopIteration');

        var data = this._serializeRowData(this._currentRow());
        this._cursor = this._cursor + 1;
        return data;
    };

    TableRowIterator.prototype._currentRow = function _currentRow() {
        return this._el.find('tr:eq(' + this._cursor + ')');
    };

    TableRowIterator.prototype._serializeRowData = function _serializeRowData( row ) {
        var serialized = {},
            cells = row.find('td'),
            i = 0,
            max = this._columns.length;

        for (; i < max; i++) {
            serialized[this._columns[i]] = cells[i].innerText;
        }
        return serialized;
    };

    TableRowIterator.prototype.reset = function reset() {
        this._cursor = 1;
    };


    function ItemRepository( localStorageWrapper, Model ) {
        if ( typeof localStorageWrapper === 'undefined' ) throw new Error('You must provide a localStorageWrapper');
        this._ls = localStorageWrapper;
        this._Model = Model;
    }

    ItemRepository.prototype.add = function add( item ) {
        return this._ls.save( item );
    };

    ItemRepository.prototype.update = function update( item ) {
        return this._ls.update( item );
    };

    ItemRepository.prototype.remove = function remove( query ) {
        return this._ls.destroy( query );
    };

    ItemRepository.prototype.find = function find( query ) {
        var entities = this._ls.find( query ),
            i = 0,
            max = entities.length,
            models = [];

        if ( typeof this._Model === 'undefined' ) return entities;
        for (; i < max; i++) {
            models.push( new this._Model( entities[i] ) );
        }
        return models;
    };

    ItemRepository.prototype.get = function get( id ) {
        var entity = this._ls.get( id );
        if ( typeof this._Model === 'undefined' ) return entity;
        return new this._Model( entity );
    };

    ItemRepository.prototype.all = function all() {
        return this._ls.all();
    };

    ItemRepository.prototype.count = function count() {
        return this._ls.size();
    };


    function ItemSummaryImporter( tableRowIterator, itemRepository ) {
        this._iter = tableRowIterator;
        this._repo = itemRepository;
    }

    ItemSummaryImporter.prototype.run = function( force ) {
        while( this._iter.hasNext() ) {
            var item = this._iter.next();
            if ( !this._repo.get( item.stockNumber ) || force ) {
                this._repo.add( item );
            }
        }
    };


    return {
        TableRowIterator: TableRowIterator,
        ItemRepository: ItemRepository,
        ItemSummaryImporter: ItemSummaryImporter
    };
})();

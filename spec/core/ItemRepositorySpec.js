describe('core.ItemRepository', function() {

    function ItemModel( data ) {}

    describe('initializing', function() {

        it('requires a localStorageWrapper', function() {
            function createWithoutLocalStorageWrapper() {
                return new core.ItemRepository();
            }

            expect( createWithoutLocalStorageWrapper ).toThrow('You must provide a localStorageWrapper');
        });

        it('initializes with a localStorageWrapper', function() {
            var repo = new core.ItemRepository({});

            expect( repo ).not.toBe( null );
        });

        it('initializes with a model', function() {
            var repo = new core.ItemRepository({}, ItemModel);

            expect( repo ).not.toBe( null );
        });
    });

    describe('working with models', function() {
        var repo,
            localStorageWrapper,
            items = [
                {stockNumber: 'R123', year: '2014', make: 'HONDA'},
                {stockNumber: 'S234', year: '2013', make: 'NISSAN'},
                {stockNumber: 'Y556', year: '2013', make: 'KIA'},
                {stockNumber: 'M566', year: '2012', make: 'TOYOTA'}
            ];

        beforeEach(function() {
            localStorageWrapper = 
                jasmine.createSpyObj('localStorageWrapper', ['add', 'update', 'find', 'get', 'all']);

            localStorageWrapper.get.andReturn( items[2] );
            localStorageWrapper.find.andReturn( items.slice(1,3) );
            localStorageWrapper.all.andReturn( items );

            repo = new core.ItemRepository(localStorageWrapper, ItemModel);

            this.addMatchers({
                toBeAnInstanceOf: function ( expected ) {
                    return this.actual instanceof expected;
                }
            });
        });

        it('#get, returns a model for the entity', function() {
            var item = repo.get('ID');

            expect( item ).toBeAnInstanceOf( ItemModel );
        });

        xit('#add, persists the derived entity from the model', function() {

        });
    });
});
        
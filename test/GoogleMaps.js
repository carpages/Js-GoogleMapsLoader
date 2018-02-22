( function() {
  var baseUrl = GoogleMapsLoader.URL;

  describe( 'GoogleMaps', function() {
    beforeEach( function() {
      GoogleMapsLoader.makeMock();
    });

    afterEach( function( done ) {
      GoogleMapsLoader.release( function() {
        done();
      });
    });

    describe( 'defaults', function() {
      it( 'should have a default version', function() {
        expect( GoogleMapsLoader.defaultOptions.v ).to.be.equal(
          GoogleMapsLoader.VERSION
        );
      });

      it( 'should have a default callback name', function() {
        expect( GoogleMapsLoader.defaultOptions.callback ).to.be.equal(
          GoogleMapsLoader.WINDOW_CALLBACK_NAME
        );
      });
    });

    describe( '#load', function() {
      it( 'should load google api object', function( done ) {
        GoogleMapsLoader.load( function( google ) {
          expect( google ).to.be.a( 'object' );
          expect( GoogleMapsLoader.isLoaded()).to.be.true;
          done();
        });
      });

      it( 'should load google api only for first time and then use stored object', function( done ) {
        var count = 0;

        GoogleMapsLoader.onLoad( function() {
          count++;
        });

        GoogleMapsLoader.load();
        GoogleMapsLoader.load();
        GoogleMapsLoader.load();

        GoogleMapsLoader.load( function() {
          expect( count ).to.be.equal( 1 );
          done();
        });
      });
    });

    describe( '#release', function() {
      it( 'should restore google maps package to original state and remove google api object completely and load it again', function( done ) {
        GoogleMapsLoader.load( function() {
          expect( GoogleMapsLoader.isLoaded()).to.be.true;

          GoogleMapsLoader.release( function() {
            expect( GoogleMapsLoader.isLoaded()).to.be.false;

            GoogleMapsLoader.makeMock();
            GoogleMapsLoader.load( function() {
              expect( GoogleMapsLoader.isLoaded()).to.be.true;
              done();
            });
          });
        });
      });
    });

    describe( '#createUrl', function() {
      it( 'should create url with key', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.key = 'abcdefghijkl';

        GoogleMapsLoader.KEY = 'abcdefghijkl';

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with one library', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.libraries = [ 'hello' ];

        GoogleMapsLoader.LIBRARIES = [ 'hello' ];

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with more libraries', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.libraries = [ 'hello', 'day' ];

        GoogleMapsLoader.LIBRARIES = [ 'hello', 'day' ];

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with client', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.client = 'buf';

        GoogleMapsLoader.CLIENT = 'buf';

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with a specific version', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.v = '3.30';

        GoogleMapsLoader.VERSION = '3.30';

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with channel', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.channel = 'abcdefghijkl';

        GoogleMapsLoader.CHANNEL = 'abcdefghijkl';

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with language', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.language = 'fr';

        GoogleMapsLoader.LANGUAGE = 'fr';

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });

      it( 'should create url with region', function() {
        var expectedOptions = JSON.parse(
          JSON.stringify( GoogleMapsLoader.defaultOptions )
        );
        expectedOptions.region = 'GB';

        GoogleMapsLoader.REGION = 'GB';

        expect( GoogleMapsLoader.createUrl()).to.be.equal(
          baseUrl + GoogleMapsLoader._parseOptions( expectedOptions )
        );
      });
    });
  });
}.call());

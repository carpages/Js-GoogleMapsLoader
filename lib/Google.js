( function( root, factory ) {
  if ( root === null ) {
    throw new Error( 'Google-maps package can be used only in browser' );
  }

  if ( typeof define === 'function' && define.amd ) {
    define( factory );
  } else if ( typeof exports === 'object' ) {
    module.exports = factory();
  } else {
    root.GoogleMapsLoader = factory();
  }
})( typeof window !== 'undefined' ? window : null, function() {
  'use strict';

  var googleVersion = '3.18';

  var script = null;

  var google = null;

  var loading = false;

  var callbacks = [];

  var onLoadEvents = [];

  var originalCreateLoaderMethod = null;

  var GoogleMapsLoader = {};

  GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

  GoogleMapsLoader.KEY = null;

  GoogleMapsLoader.LIBRARIES = [];

  GoogleMapsLoader.CLIENT = null;

  GoogleMapsLoader.CHANNEL = null;

  GoogleMapsLoader.LANGUAGE = null;

  GoogleMapsLoader.REGION = null;

  GoogleMapsLoader.VERSION = googleVersion;

  GoogleMapsLoader.WINDOW_CALLBACK_NAME =
    '__google_maps_api_provider_initializator__';

  GoogleMapsLoader._googleMockApiObject = {};

  var defaultOptions = {
    callback: GoogleMapsLoader.WINDOW_CALLBACK_NAME,
    v: googleVersion
  };

  GoogleMapsLoader.defaultOptions = defaultOptions;

  GoogleMapsLoader._parseOptions = function( optionsObject ) {
    var options = [];

    Object.keys( optionsObject ).forEach( function( key ) {
      options.push([ key, optionsObject[key] ].join( '=' ));
    });

    return '?' + options.join( '&' );
  };

  GoogleMapsLoader.load = function( fn ) {
    if ( google === null ) {
      if ( loading === true ) {
        if ( fn ) {
          callbacks.push( fn );
        }
      } else {
        loading = true;

        window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function() {
          ready( fn );
        };

        GoogleMapsLoader.createLoader();
      }
    } else if ( fn ) {
      fn( google );
    }
  };

  GoogleMapsLoader.createLoader = function() {
    script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = GoogleMapsLoader.createUrl();

    document.body.appendChild( script );
  };

  GoogleMapsLoader.isLoaded = function() {
    return google !== null;
  };

  GoogleMapsLoader.createUrl = function() {
    var url = GoogleMapsLoader.URL;
    var params = JSON.parse( JSON.stringify( GoogleMapsLoader.defaultOptions ));

    if ( GoogleMapsLoader.VERSION ) {
      params.v = GoogleMapsLoader.VERSION;
    }

    if ( GoogleMapsLoader.KEY ) {
      params.key = GoogleMapsLoader.KEY;
    }

    if ( GoogleMapsLoader.LIBRARIES.length > 0 ) {
      params.libraries = GoogleMapsLoader.LIBRARIES.join( ',' );
    }

    if ( GoogleMapsLoader.CLIENT ) {
      params.client = GoogleMapsLoader.CLIENT;
    }

    if ( GoogleMapsLoader.CHANNEL ) {
      params.channel = GoogleMapsLoader.CHANNEL;
    }

    if ( GoogleMapsLoader.LANGUAGE ) {
      params.language = GoogleMapsLoader.LANGUAGE;
    }

    if ( GoogleMapsLoader.REGION ) {
      params.region = GoogleMapsLoader.REGION;
    }

    var paramString = GoogleMapsLoader._parseOptions( params );

    return url + paramString;
  };

  GoogleMapsLoader.release = function( fn ) {
    var release = function() {
      GoogleMapsLoader.KEY = null;
      GoogleMapsLoader.LIBRARIES = [];
      GoogleMapsLoader.CLIENT = null;
      GoogleMapsLoader.CHANNEL = null;
      GoogleMapsLoader.LANGUAGE = null;
      GoogleMapsLoader.REGION = null;
      GoogleMapsLoader.VERSION = googleVersion;

      google = null;
      loading = false;
      callbacks = [];
      onLoadEvents = [];

      if ( typeof window.google !== 'undefined' ) {
        delete window.google;
      }

      if (
        typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined'
      ) {
        delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
      }

      if ( originalCreateLoaderMethod !== null ) {
        GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
        originalCreateLoaderMethod = null;
      }

      if ( script !== null ) {
        script.parentElement.removeChild( script );
        script = null;
      }

      if ( fn ) {
        fn();
      }
    };

    if ( loading ) {
      GoogleMapsLoader.load( function() {
        release();
      });
    } else {
      release();
    }
  };

  GoogleMapsLoader.onLoad = function( fn ) {
    onLoadEvents.push( fn );
  };

  GoogleMapsLoader.makeMock = function() {
    originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

    GoogleMapsLoader.createLoader = function() {
      window.google = GoogleMapsLoader._googleMockApiObject;
      window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
    };
  };

  var ready = function( fn ) {
    var i;

    loading = false;

    if ( google === null ) {
      google = window.google;
    }

    for ( i = 0; i < onLoadEvents.length; i++ ) {
      onLoadEvents[i]( google );
    }

    if ( fn ) {
      fn( google );
    }

    for ( i = 0; i < callbacks.length; i++ ) {
      callbacks[i]( google );
    }

    callbacks = [];
  };

  return GoogleMapsLoader;
});

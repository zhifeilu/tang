/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
// Generated by CoffeeScript 1.6.3
/*
jQuery.Turbolinks ~ https://github.com/kossnocorp/jquery.turbolinks
jQuery plugin for drop-in fix binded events problem caused by Turbolinks

The MIT License
Copyright (c) 2012-2013 Sasha Koss & Rico Sta. Cruz
*/



(function() {
  var $, $document;

  $ = window.jQuery || (typeof require === "function" ? require('jquery') : void 0);

  $document = $(document);

  $.turbo = {
    version: '2.0.0',
    isReady: false,
    use: function(load, fetch) {
      return $document.off('.turbo').on("" + load + ".turbo", this.onLoad).on("" + fetch + ".turbo", this.onFetch);
    },
    addCallback: function(callback) {
      if ($.turbo.isReady) {
        return callback($);
      } else {
        return $document.on('turbo:ready', function() {
          return callback($);
        });
      }
    },
    onLoad: function() {
      $.turbo.isReady = true;
      return $document.trigger('turbo:ready');
    },
    onFetch: function() {
      return $.turbo.isReady = false;
    },
    register: function() {
      $(this.onLoad);
      return $.fn.ready = this.addCallback;
    }
  };

  $.turbo.register();

  $.turbo.use('page:load', 'page:fetch');

}).call(this);
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
(function() {
  this.Editor = (function() {
    function Editor(options) {
      var _this;
      this.options = options;
      this.editable = $(this.options.editable);
      this.readonly = this.options.readonly;
      this.selectEnd();
      this.sanitize = new Editor.Sanitize(this);
      this.formator = new Editor.Formator(this);
      this.undoManager = new Editor.UndoManager(this);
      if (this.options.toolbar) {
        this.toolbar = new Editor.Toolbar(this, this.options.toolbar, this.options.toolbarOptions);
        this.toolbar.detectState();
      }
      this.bindShortcuts();
      this.initParagraph();
      _this = this;
      this.editable.on("keyup mouseup", function() {
        return _this.storeRange();
      });
      this.editable.on({
        keyup: function(event) {
          return _this.keyup(event);
        },
        keydown: function(event) {
          return _this.keydown(event);
        },
        input: function(event) {
          return _this.input(event);
        },
        paste: function(event) {
          return _this.paste(event);
        }
      });
      this.is_chrome = navigator.userAgent.indexOf("Chrome") > -1;
      this.is_safari = navigator.userAgent.indexOf("Safari") > -1 && !this.is_chrome;
      if (this.is_chrome || this.is_safari) {
        this.editable.on("textInput", function() {
          return setTimeout((function() {
            _this.undoManager.save();
            return _this.editable.trigger("editor:change");
          }), 0);
        }).on("keydown", function(event) {
          switch (event.keyCode) {
            case 8:
            case 46:
              return _this.wordCount = _this.editable.html().length;
          }
        }).on("keyup", function(event) {
          switch (event.keyCode) {
            case 8:
            case 46:
              if (_this.editable.html().length < _this.wordCount) {
                return setTimeout((function() {
                  _this.undoManager.save();
                  return _this.editable.trigger("editor:change");
                }), 0);
              }
          }
        });
      } else {
        this.editable.on("input", function() {
          return setTimeout((function() {
            _this.undoManager.save();
            return _this.editable.trigger("editor:change");
          }), 0);
        });
      }
    }

    Editor.prototype.shortcuts = {
      bold: ["ctrl+b"],
      italic: ["ctrl+i"],
      image: ["ctrl+g"],
      strikeThrough: ["ctrl+d"],
      underline: ["ctrl+u"],
      link: ["ctrl+l"],
      orderedList: ["ctrl+7"],
      unorderedList: ["ctrl+8"],
      p: ["ctrl+0"],
      h1: ["ctrl+1"],
      h2: ["ctrl+2"],
      h3: ["ctrl+3"],
      h4: ["ctrl+4"],
      code: ["ctrl+k"],
      blockquote: ["ctrl+q"],
      undo: ["ctrl+z"],
      redo: ["ctrl+y", "ctrl+shift+z"]
    };

    Editor.prototype.bindShortcuts = function() {
      var _this;
      _this = this;
      return $.each(this.shortcuts, function(method, key) {
        if (_this.formator[method]) {
          return Mousetrap.bind(key, function(event) {
            event.preventDefault();
            if (!this.readonly) {
              if (!_this.hasRange()) {
                _this.restoreRange();
              }
              return _this.formator[method]();
            }
          });
        } else if (_this[method]) {
          return Mousetrap.bind(key, function(event) {
            event.preventDefault();
            if (!this.readonly) {
              return _this[method]();
            }
          });
        }
      });
    };

    Editor.prototype.setReadonly = function(readonly) {
      this.readonly = readonly;
      return this.editable.prop('contentEditable', !this.readonly);
    };

    Editor.prototype.paste = function(event) {
      return this.dirty = true;
    };

    Editor.prototype.input = function(event) {
      var _this;
      _this = this;
      if (_this.dirty) {
        _this.sanitize.run();
        return _this.dirty = false;
      }
    };

    Editor.prototype.selectContents = function(contents) {
      var end, range, selection, start;
      selection = window.getSelection();
      range = selection.getRangeAt(0);
      start = contents.first()[0];
      end = contents.last()[0];
      range.setStart(start, 0);
      range.setEnd(end, end.childNodes.length || end.length);
      selection.removeAllRanges();
      return selection.addRange(range);
    };

    Editor.prototype.keyup = function(event) {
      switch (event.keyCode) {
        case 8:
        case 46:
          return this.initParagraph();
      }
    };

    Editor.prototype.triggerInput = function() {
      if (this.is_chrome || this.is_safari) {
        return this.editable.trigger("textInput");
      }
    };

    Editor.prototype.keydown = function(event) {
      switch (event.keyCode) {
        case 8:
          return this.backspcae(event);
        case 13:
          return this.enter(event);
      }
    };

    Editor.prototype.backspcae = function(event) {
      if (this.editable.html() === "<p><br></p>") {
        return event.preventDefault();
      }
    };

    Editor.prototype.enter = function(event) {
      var $pre, isEnd, isLastLine, node, range, rangeAncestor, selection;
      if (document.queryCommandValue("formatBlock") === "pre") {
        event.preventDefault();
        selection = window.getSelection();
        range = selection.getRangeAt(0);
        rangeAncestor = range.commonAncestorContainer;
        $pre = $(rangeAncestor).closest("pre");
        range.deleteContents();
        isLastLine = $pre.find("code").contents().last()[0] === range.endContainer;
        isEnd = range.endContainer.length === range.endOffset;
        node = document.createTextNode("\n");
        range.insertNode(node);
        if (isLastLine && isEnd) {
          $pre.find("code").append(document.createTextNode("\n"));
        }
        range.setStartAfter(node);
        range.setEndAfter(node);
        selection.removeAllRanges();
        selection.addRange(range);
        return this.triggerInput();
      }
    };

    Editor.prototype.undo = function() {
      return this.undoManager.undo();
    };

    Editor.prototype.redo = function() {
      return this.undoManager.redo();
    };

    Editor.prototype.initParagraph = function() {
      if (this.editable.html() === "" || this.editable.html() === "<br>") {
        return this.formator.p();
      }
    };

    Editor.prototype.selectEnd = function() {
      var selection;
      selection = document.getSelection();
      selection.selectAllChildren(this.editable[0]);
      return selection.collapseToEnd();
    };

    Editor.prototype.storeRange = function() {
      var range, selection;
      selection = document.getSelection();
      range = selection.getRangeAt(0);
      return this.storedRange = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    };

    Editor.prototype.restoreRange = function() {
      var range, selection;
      selection = document.getSelection();
      range = document.createRange();
      if (this.storedRange) {
        range.setStart(this.storedRange.startContainer, this.storedRange.startOffset);
        range.setEnd(this.storedRange.endContainer, this.storedRange.endOffset);
        selection.removeAllRanges();
        return selection.addRange(range);
      } else {
        return this.selectEnd();
      }
    };

    Editor.prototype.hasRange = function() {
      var selection;
      selection = document.getSelection();
      return selection.rangeCount && $(selection.getRangeAt(0).commonAncestorContainer).closest(this.options.editable).length;
    };

    Editor.prototype.reset = function() {
      this.editable.html('');
      this.initParagraph();
      return this.selectEnd();
    };

    return Editor;

  })();

}).call(this);
(function() {
  this.Editor.Formator = (function() {
    function Formator(editor) {
      this.editor = editor;
      this.editable = editor.editable;
      this.exec("defaultParagraphSeparator", "p");
    }

    Formator.prototype.isCollapsed = function() {
      return document.getSelection().isCollapsed;
    };

    Formator.prototype.isBold = function() {
      return this.canBold() && (document.queryCommandValue("bold") === "true" || document.queryCommandState("bold"));
    };

    Formator.prototype.canBold = function() {
      return !this.isWraped("h1, h2, h3, h4, code");
    };

    Formator.prototype.bold = function() {
      if (this.canBold()) {
        this.exec("bold");
        if (!this.isCollapsed()) {
          return this.afterFormat();
        }
      }
    };

    Formator.prototype.isItalic = function() {
      return this.canItalic() && (document.queryCommandValue("italic") === "true" || document.queryCommandState("italic"));
    };

    Formator.prototype.canItalic = function() {
      return !this.isWraped("code");
    };

    Formator.prototype.italic = function() {
      if (this.canItalic()) {
        this.exec("italic");
        if (!this.isCollapsed()) {
          return this.afterFormat();
        }
      }
    };

    Formator.prototype.isStrikeThrough = function() {
      return this.canStrikeThrough() && (document.queryCommandValue("strikeThrough") === "true" || document.queryCommandState("strikeThrough"));
    };

    Formator.prototype.canStrikeThrough = function() {
      return !this.isWraped("code");
    };

    Formator.prototype.strikeThrough = function() {
      if (this.canStrikeThrough()) {
        this.exec("strikeThrough");
        if (!this.isCollapsed()) {
          return this.afterFormat();
        }
      }
    };

    Formator.prototype.isUnderline = function() {
      return this.canUnorderedList() && (document.queryCommandValue("underline") === "true" || document.queryCommandState("underline"));
    };

    Formator.prototype.canUnderline = function() {
      return !this.isWraped("code, a");
    };

    Formator.prototype.underline = function() {
      if (this.canUnderline()) {
        this.exec("underline");
        if (!this.isCollapsed()) {
          return this.afterFormat();
        }
      }
    };

    Formator.prototype.isOrderedList = function() {
      return this.canOrderedList() && document.queryCommandValue("insertOrderedList") === "true";
    };

    Formator.prototype.canOrderedList = function() {
      return !this.isWraped("h1, h2, h3, h4, code");
    };

    Formator.prototype.orderedList = function() {
      if (this.canOrderedList()) {
        if (this.isOrderedList()) {
          this.exec("insertOrderedList");
          this.p();
        } else {
          this.exec("insertOrderedList");
          if ($(this.commonAncestorContainer()).closest("p").length) {
            this.editor.storeRange();
            $(this.commonAncestorContainer()).closest("ol").unwrap("p");
            this.editor.restoreRange();
          }
        }
        return this.afterFormat();
      }
    };

    Formator.prototype.isUnorderedList = function() {
      return this.canUnorderedList() && document.queryCommandValue("insertUnorderedList") === "true";
    };

    Formator.prototype.canUnorderedList = function() {
      return !this.isWraped("h1, h2, h3, h4, code");
    };

    Formator.prototype.unorderedList = function() {
      if (this.canUnorderedList()) {
        if (this.isUnorderedList()) {
          this.exec("insertUnorderedList");
          this.p();
        } else {
          this.exec("insertUnorderedList");
          if ($(this.commonAncestorContainer()).closest("p").length) {
            this.editor.storeRange();
            $(this.commonAncestorContainer()).closest("ul").unwrap("p");
            this.editor.restoreRange();
          }
        }
        return this.afterFormat();
      }
    };

    Formator.prototype.isLink = function() {
      return this.canLink() && this.isWraped("a");
    };

    Formator.prototype.canLink = function() {
      return !this.isWraped("code");
    };

    Formator.prototype.link = function() {
      var url;
      url = prompt("Link url:", "");
      if (url && url !== "") {
        this.exec("createLink", url);
      } else {
        this.exec("unlink");
      }
      return this.afterFormat();
    };

    Formator.prototype.canImage = function() {
      return !this.isWraped("h1, h2, h3, h4, code");
    };

    Formator.prototype.image = function() {
      var url;
      url = prompt("Link url:", "");
      if (url && url !== "") {
        this.exec("insertImage", url);
      }
      return this.afterFormat();
    };

    Formator.prototype.isH1 = function() {
      return this.isWraped("h1");
    };

    Formator.prototype.canH1 = function() {
      return !this.isWraped("li, code");
    };

    Formator.prototype.h1 = function() {
      if (this.canH1()) {
        return this.formatHeader("h1");
      }
    };

    Formator.prototype.isH2 = function() {
      return this.isWraped("h2");
    };

    Formator.prototype.canH2 = function() {
      return !this.isWraped("li, code");
    };

    Formator.prototype.h2 = function() {
      if (this.canH2()) {
        return this.formatHeader("h2");
      }
    };

    Formator.prototype.isH3 = function() {
      if (this.canH3()) {
        return this.isWraped("h3");
      }
    };

    Formator.prototype.canH3 = function() {
      return !this.isWraped("li, code");
    };

    Formator.prototype.h3 = function() {
      if (this.canH3()) {
        return this.formatHeader("h3");
      }
    };

    Formator.prototype.isH4 = function() {
      return this.isWraped("h4");
    };

    Formator.prototype.canH4 = function() {
      return !this.isWraped("li, code");
    };

    Formator.prototype.h4 = function() {
      if (this.canH4()) {
        return this.formatHeader("h4");
      }
    };

    Formator.prototype.isP = function() {
      return this.isWraped("p");
    };

    Formator.prototype.canP = function() {
      return !this.isWraped("li, code");
    };

    Formator.prototype.p = function() {
      this.exec("formatBlock", "p");
      return this.afterFormat();
    };

    Formator.prototype.formatHeader = function(type) {
      if (document.queryCommandValue("formatBlock") === type) {
        return this.p();
      } else {
        this.exec("formatBlock", type);
        $(this.commonAncestorContainer()).closest(type).find(":not(i, strike, u, a, br)").each(function() {
          return $(this).replaceWith($(this).contents());
        });
        return this.afterFormat();
      }
    };

    Formator.prototype.isCode = function() {
      return this.isWraped("code");
    };

    Formator.prototype.canCode = function() {
      return true;
    };

    Formator.prototype.code = function() {
      var $code, $contents, $pre, end, hasBlock, isEmptyRange, isWholeBlock, range, rangeAncestor, selection, start;
      selection = window.getSelection();
      range = selection.getRangeAt(0);
      rangeAncestor = range.commonAncestorContainer;
      start = void 0;
      end = void 0;
      $contents = void 0;
      $code = $(rangeAncestor).closest("code");
      if ($code.length) {
        if ($code.closest("pre").length) {
          this.splitCode($code);
          $contents = $code.contents();
          if ($contents.length === 0) {
            $contents = $("<p><br></p>");
          }
          $code.closest("pre").replaceWith($contents);
          this.editor.selectContents($contents);
        } else {
          $contents = $code.contents();
          $code.replaceWith($code.contents());
          this.editor.selectContents($contents);
        }
      } else {
        isEmptyRange = range.toString() === "";
        isWholeBlock = range.toString() === $(range.startContainer).closest("p, h1, h2, h3, h4").text();
        hasBlock = range.cloneContents().querySelector("p, h1, h2, h3, h4");
        if (isEmptyRange || isWholeBlock || hasBlock) {
          start = $(range.startContainer).closest("p, h1, h2, h3, h4")[0];
          end = $(range.endContainer).closest("p, h1, h2, h3, h4")[0];
          range.setStartBefore(start);
          range.setEndAfter(end);
          $code = $("<code>").html(range.extractContents());
          $pre = $("<pre>").html($code);
          range.insertNode($pre[0]);
          if ($pre.next().length === 0) {
            $pre.after("<p><br></p>");
          }
        } else {
          $code = $("<code>").html(range.extractContents());
          range.insertNode($code[0]);
        }
        this.editor.sanitize.striptCode($code);
        selection.selectAllChildren($code[0]);
      }
      return this.afterFormat();
    };

    Formator.prototype.splitCode = function(code) {
      return code.html($.map(code.text().split("\n"), function(line) {
        if (line !== "") {
          return $("<p>").text(line);
        }
      }));
    };

    Formator.prototype.isBlockquote = function() {
      return this.isWraped("blockquote");
    };

    Formator.prototype.canBlockquote = function() {
      return true;
    };

    Formator.prototype.blockquote = function() {
      var $blockquote, $contents, end, range, rangeAncestor, selection, start;
      selection = window.getSelection();
      range = selection.getRangeAt(0);
      rangeAncestor = range.commonAncestorContainer;
      start = void 0;
      end = void 0;
      $blockquote = $(rangeAncestor).closest("blockquote");
      if ($blockquote.length) {
        $contents = $blockquote.contents();
        $blockquote.replaceWith($contents);
        this.editor.selectContents($contents);
      } else {
        start = $(range.startContainer).closest("p, h1, h2, h3, h4, pre")[0];
        end = $(range.endContainer).closest("p, h1, h2, h3, h4, pre")[0];
        range.setStartBefore(start);
        range.setEndAfter(end);
        $blockquote = $("<blockquote>");
        $blockquote.html(range.extractContents()).find("blockquote").each(function() {
          return $(this).replaceWith($(this).html());
        });
        range.insertNode($blockquote[0]);
        selection.selectAllChildren($blockquote[0]);
        if ($blockquote.next().length === 0) {
          $blockquote.after("<p><br></p>");
        }
      }
      return this.afterFormat();
    };

    Formator.prototype.isWraped = function(selector) {
      if (this.commonAncestorContainer()) {
        return $(this.commonAncestorContainer()).closest(selector).length !== 0;
      } else {
        return false;
      }
    };

    Formator.prototype.commonAncestorContainer = function() {
      var selection;
      selection = document.getSelection();
      if (selection.rangeCount !== 0) {
        return selection.getRangeAt(0).commonAncestorContainer;
      }
    };

    Formator.prototype.exec = function(command, arg) {
      return document.execCommand(command, false, arg);
    };

    Formator.prototype.afterFormat = function() {
      this.editor.undoManager.save();
      return this.editable.trigger("editor:change");
    };

    return Formator;

  })();

}).call(this);
(function() {
  this.Editor.Sanitize = (function() {
    function Sanitize(editor) {
      this.editor = editor;
      this.editable = this.editor.editable;
    }

    Sanitize.prototype.run = function() {
      this.sanitizeDiv();
      this.sanitizeTag();
      this.sanitizeAttr();
      this.sanitizeBlockElement();
      this.sanitizeHeader();
      this.sanitizeCode();
      return this.sanitizeList();
    };

    Sanitize.prototype.tagWhiteList = ["p", "br", "img", "a", "b", "i", "strike", "u", "h1", "h2", "h3", "h4", "pre", "code", "ol", "ul", "li", "blockquote"];

    Sanitize.prototype.attrWhiteList = {
      p: ["id"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      pre: ["id"],
      li: ["id"],
      a: ["href", "title"],
      img: ["src", "title", "alt"]
    };

    Sanitize.prototype.sanitizeDiv = function() {
      return this.editable.find("div").each(function() {
        return $(this).replaceWith($("<p>").append($(this).contents()));
      });
    };

    Sanitize.prototype.sanitizeTag = function() {
      return this.editable.find(":not(" + this.tagWhiteList.join() + ")").each(function() {
        var $element;
        $element = $(this);
        if ($element.contents().length) {
          return $element.replaceWith($element.contents());
        } else {
          return $element.remove();
        }
      });
    };

    Sanitize.prototype.sanitizeAttr = function() {
      var tags, _this;
      _this = this;
      tags = $.map(this.attrWhiteList, function(attrs, tag) {
        return tag;
      });
      this.editable.find(":not(" + tags.join() + ")").each(function() {
        var $element, attributes;
        $element = $(this);
        attributes = $.map(this.attributes, function(item) {
          return item.name;
        });
        return $.each(attributes, function(i, name) {
          return $element.removeAttr(name);
        });
      });
      return $.each(this.attrWhiteList, function(tag, attrList) {
        return _this.editable.find(tag).each(function() {
          var $element, attributes;
          $element = $(this);
          attributes = $.map(this.attributes, function(item) {
            return item.name;
          });
          return $.each(attributes, function(i, name) {
            if ($.inArray(name, attrList) === -1) {
              return $element.removeAttr(name);
            }
          });
        });
      });
    };

    Sanitize.prototype.sanitizeBlockElement = function() {
      var _this;
      _this = this;
      this.editable.find(this.blockElementSelector).each(function() {
        return _this.flattenBlock(this);
      });
      return this.editable.find("> blockquote").find(this.blockElementSelector).each(function() {
        return _this.flattenBlock(this);
      });
    };

    Sanitize.prototype.blockElementSelector = "> p, > h1, > h2, > h3, > h4";

    Sanitize.prototype.flattenBlock = function(element) {
      var hasInline, hasTextNode, _this;
      _this = this;
      hasTextNode = $(element).contents().filter(function() {
        return this.nodeType !== 1;
      }).length;
      hasInline = $(element).find("> :not(p, h1, h2, h3, h4, ul, ol, pre, blockquote)").length;
      if (hasTextNode || hasInline) {
        return this.flattenBlockStript(element);
      } else {
        $(element).children().each(function() {
          return _this.flattenBlock(this);
        });
        return $(element).replaceWith($(element).contents());
      }
    };

    Sanitize.prototype.flattenBlockStript = function(element) {
      if ($(element).is(":not(ul, ol)")) {
        return $(element).find(":not(code, a, img, b, strike, i, br)").each(function() {
          return $(this).replaceWith($(this).contents());
        });
      }
    };

    Sanitize.prototype.sanitizeHeader = function() {
      return this.editable.find("h1, h2, h3, h4").find(":not(i, strike, u, a)").each(function() {
        return $(this).replaceWith($(this).contents());
      });
    };

    Sanitize.prototype.sanitizeCode = function() {
      var _this;
      _this = this;
      this.editable.find("pre").each(function() {
        if ($(this).find("> code").length === 0) {
          return $(this).append($("<code>").append($(this).contents()));
        }
      });
      return this.editable.find("code").each(function() {
        return _this.striptCode(this);
      });
    };

    Sanitize.prototype.striptCode = function(code) {
      $(code).find("p, h1, h2, h3, h4, blockquote, pre").each(function() {
        return $(this).replaceWith($(this).text() + "\n");
      });
      return $(code).children().each(function() {
        return $(this).replaceWith($(this).text());
      });
    };

    Sanitize.prototype.sanitizeList = function() {
      var _this;
      _this = this;
      return this.editable.find("li").each(function() {
        var $li;
        $li = $(this);
        return $li.find(":not(code, a, img, b, strike, i, br)").each(function() {
          if ($(this).next().length) {
            $(this).append("<br>");
          }
          return $(this).replaceWith($(this).contents());
        });
      });
    };

    return Sanitize;

  })();

}).call(this);
(function() {
  this.Editor.Toolbar = (function() {
    function Toolbar(editor, toolbar, options) {
      var _base, _base1, _this;
      this.editor = editor;
      this.options = options != null ? options : {};
      this.toolbar = $(toolbar);
      (_base = this.options).activeClass || (_base.activeClass = 'actived');
      (_base1 = this.options).disableClass || (_base1.disableClass = 'disabled');
      _this = this;
      this.editor.editable.on("keyup mouseup", function() {
        return _this.detectState();
      });
      this.toolbar.on("click", "[data-command]", function(event) {
        event.preventDefault();
        if (!_this.editor.readonly) {
          return _this.command(this);
        }
      });
    }

    Toolbar.prototype.detectState = function() {
      this.detectButton();
      return this.detectBlocks();
    };

    Toolbar.prototype.detectButton = function() {
      var _this;
      _this = this;
      return _this.toolbar.find("[data-command]").each(function(index, element) {
        var canCommand, command, isCommand;
        command = $(element).data("command");
        if (command) {
          isCommand = "is" + command[0].toUpperCase() + command.substring(1);
          if (_this.editor.formator[isCommand]) {
            if (_this.editor.formator[isCommand]()) {
              $(element).addClass(_this.options.activeClass);
            } else {
              $(element).removeClass(_this.options.activeClass);
            }
          }
          canCommand = "can" + command[0].toUpperCase() + command.substring(1);
          if (_this.editor.formator[canCommand]) {
            if (_this.editor.formator[canCommand]()) {
              return $(element).removeClass(_this.options.disableClass);
            } else {
              return $(element).addClass(_this.options.disableClass);
            }
          }
        }
      });
    };

    Toolbar.prototype.detectBlocks = function() {
      var text, type;
      type = document.queryCommandValue("formatBlock");
      if (type === "pre") {
        type = "code";
      }
      text = this.toolbar.find("#format-block [data-command=" + type + "]").text();
      if (text === "") {
        text = this.toolbar.find("#format-block [data-command]:first").text();
      }
      return this.toolbar.find("#format-block .toolbar-button").text(text);
    };

    Toolbar.prototype.command = function(element) {
      if (!this.editor.hasRange()) {
        this.editor.restoreRange();
      }
      this.editor.formator[$(element).data("command")]();
      if (this.editor.hasRange()) {
        this.editor.storeRange();
      }
      return this.detectState();
    };

    return Toolbar;

  })();

}).call(this);
(function() {
  this.Editor.UndoManager = (function() {
    UndoManager.prototype.undoSize = 50;

    function UndoManager(editor) {
      this.editor = editor;
      this.editable = this.editor.editable;
      this.stashContents = this.currentContents();
      this.undoStack = [];
      this.redoStack = [];
    }

    UndoManager.prototype.save = function() {
      this.undoStack.push(this.stashContents);
      if (this.undoStack.length > this.undoSize) {
        this.undoStack.shift();
      }
      this.stashContents = this.currentContents();
      return this.redoStack = [];
    };

    UndoManager.prototype.undo = function() {
      var $contents;
      $contents = this.undoStack.pop();
      if ($contents) {
        this.redoStack.push(this.stashContents);
        this.stashContents = $contents.clone();
        this.applyContents($contents);
      }
      return this.editable.trigger("editor:change");
    };

    UndoManager.prototype.redo = function() {
      var $contents;
      $contents = this.redoStack.pop();
      if ($contents) {
        this.undoStack.push(this.stashContents);
        this.stashContents = $contents.clone();
        this.applyContents($contents);
      }
      return this.editable.trigger("editor:change");
    };

    UndoManager.prototype.hasUndo = function() {
      return this.undoStack.length > 0;
    };

    UndoManager.prototype.hasRedo = function() {
      return this.redoStack.length > 0;
    };

    UndoManager.prototype.currentContents = function() {
      var $container, $endContainer, $startContainer, contents, endOffset, range, startOffset;
      if (document.getSelection().rangeCount !== 0) {
        range = document.getSelection().getRangeAt(0);
        startOffset = range.startOffset;
        endOffset = range.endOffset;
        $container = void 0;
        $startContainer = $(range.startContainer);
        $endContainer = $(range.endContainer);
        if (range.startContainer === range.endContainer) {
          $container = $(range.startContainer);
          if ($container[0].nodeType === 3) {
            $container.wrap($("<span>").attr("data-range-start", range.startOffset).attr("data-range-end", range.endOffset));
          } else {
            $container.attr("data-range-start", range.startOffset).attr("data-range-end", range.endOffset);
          }
        } else {
          if ($startContainer[0].nodeType === 3) {
            $startContainer.wrap($("<span>").attr("data-range-start", range.startOffset));
          } else {
            $startContainer.attr("data-range-start", range.startOffset);
          }
          if ($endContainer[0].nodeType === 3) {
            $endContainer.wrap($("<span>").attr("data-range-end", range.endOffset));
          } else {
            $endContainer.attr("data-range-end", range.endOffset);
          }
        }
        contents = this.editable.contents().clone();
        if ($container) {
          if ($container[0].nodeType === 3) {
            $container.closest("span").replaceWith($container);
          } else {
            $container.removeAttr("data-range-start").removeAttr("data-range-end");
          }
        } else {
          if ($startContainer[0].nodeType === 3) {
            $startContainer.parent("span").replaceWith($startContainer);
          } else {
            $startContainer.removeAttr("data-range-start");
          }
          if ($endContainer[0].nodeType === 3) {
            $endContainer.parent("span").replaceWith($endContainer);
          } else {
            $endContainer.removeAttr("data-range-end");
          }
        }
        range.setStart($startContainer[0], startOffset);
        range.setEnd($endContainer[0], endOffset);
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);
        return contents;
      } else {
        return this.editable.contents().clone();
      }
    };

    UndoManager.prototype.applyContents = function($contents) {
      var $endContainer, $startContainer, endContainer, endOffset, range, startContainer, startOffset;
      this.editable.html($contents);
      $startContainer = this.editable.find("[data-range-start]");
      $endContainer = this.editable.find("[data-range-end]");
      if ($startContainer.length !== 0 && $endContainer.length !== 0) {
        startOffset = $startContainer.data("range-start");
        endOffset = $endContainer.data("range-end");
        startContainer = $startContainer[0];
        endContainer = $endContainer[0];
        if (startContainer === endContainer) {
          if ($startContainer.is("span")) {
            startContainer = endContainer = $startContainer.contents()[0];
            $startContainer.replaceWith(startContainer);
          } else {
            $startContainer.removeAttr("data-range-start");
            $endContainer.removeAttr("data-range-end");
          }
        } else {
          if ($startContainer.is("span")) {
            startContainer = $startContainer.contents()[0];
            $startContainer.replaceWith(startContainer);
          } else {
            $startContainer.removeAttr("data-range-start");
          }
          if ($endContainer.is("span")) {
            endContainer = $endContainer.contents()[0];
            $endContainer.replaceWith(endContainer);
          } else {
            $endContainer.removeAttr("data-range-end");
          }
        }
        range = document.createRange();
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        document.getSelection().removeAllRanges();
        return document.getSelection().addRange(range);
      }
    };

    return UndoManager;

  })();

}).call(this);
(function() {
  this.Editor.ImageUploader = (function() {
    function ImageUploader(editor) {
      var _this = this;
      this.editor = editor;
      this.editor.formator.image = function() {
        return _this.open();
      };
      this.modal = $('#image-uploader-modal');
      this.linkButton = $('#image-link-button');
      this.urlInput = $('#attachment_remote_file_url');
      this.linkForm = $('#image-link-form');
      this.uploadForm = $('#image-upload-form');
      this.bindActions();
    }

    ImageUploader.prototype.open = function() {
      return Dialog.show(this.modal);
    };

    ImageUploader.prototype.close = function() {
      return Dialog.hide(this.modal);
    };

    ImageUploader.prototype.insertImage = function(url) {
      this.editor.restoreRange();
      this.editor.formator.exec('insertImage', url);
      return this.editor.formator.afterFormat();
    };

    ImageUploader.prototype.bindActions = function() {
      var _this = this;
      this.linkButton.on('click', function(event) {
        event.preventDefault();
        if (_this.urlInput.val() !== '') {
          _this.insertImage(_this.urlInput.val());
          _this.close();
          return _this.resetLinkForm();
        }
      });
      this.urlInput.on('keyup', function() {
        if (_this.urlInput.val() !== '') {
          return _this.linkPreview();
        } else {
          return _this.resetLinkForm;
        }
      });
      this.linkForm.on('submit', function(event) {
        event.preventDefault();
        return $.ajax({
          url: _this.linkForm.attr('action'),
          data: _this.linkForm.serializeArray(),
          type: 'post',
          dataType: 'json'
        }).done(function(data) {
          _this.insertImage(data.files[0].url);
          _this.close();
          return _this.updateStrageStatus(data);
        }).fail(function(xhr) {
          return AlertMessage.show({
            type: 'error',
            text: JSON.parse(xhr.responseText).message
          });
        }).always(function() {
          return _this.resetLinkForm();
        });
      });
      return this.uploadForm.fileupload({
        dataType: 'json',
        dropZone: $('#image-upload-form .dropable, #editarea article'),
        add: function(event, data) {
          _this.uploadPreview(data);
          $('#image-upload .filename').text(data.files[0].name);
          $('#image-upload-form').off('submit');
          if ($('#image-modal').is(':hidden')) {
            return data.submit();
          } else {
            return $('#image-upload-form').on('submit', function(event) {
              event.preventDefault();
              return data.submit();
            });
          }
        },
        start: function() {
          $('#image-upload .message').hide();
          $('#image-upload .progress').show();
          $('#image-upload .dropable').addClass('start');
          return AlertMessage.show({
            type: 'loading',
            text: I18n.t('loading'),
            scope: 'image-upload'
          });
        },
        progressall: function(event, data) {
          var progress;
          progress = parseInt(data.loaded / data.total * 100, 10);
          return $('#image-upload .progress .bar').css('width', progress + '%');
        },
        fail: function(event, data) {
          return AlertMessage.show({
            type: 'error',
            text: JSON.parse(xhr.responseText).message
          });
        },
        done: function(event, data) {
          _this.insertImage(data.result.files[0].url);
          _this.close();
          _this.updateStrageStatus(data.result);
          return AlertMessage.show({
            type: 'success',
            text: I18n.t('success'),
            timeout: 1500
          });
        },
        always: function(event, data) {
          AlertMessage.remove('image-upload');
          return _this.resetUploadForm();
        }
      });
    };

    ImageUploader.prototype.updateStrageStatus = function(data) {
      $('#image-modal .storage-status .used').text(data.storage_status.used_human_size);
      return $('#image-modal .storage-status .limit').text(data.storage_status.limit_human_size);
    };

    ImageUploader.prototype.linkPreview = function() {
      $('#image-link-form .preview').css('background-image', 'url(' + $('#attachment_remote_file_url').val() + ')');
      return $('#image-link-form .message').hide();
    };

    ImageUploader.prototype.resetLinkForm = function() {
      $('#attachment_remote_file_url').val('');
      $('#image-link-form .preview').css('background-image', 'none');
      return $('#image-link-form .message').show();
    };

    ImageUploader.prototype.uploadPreview = function(data) {
      var reader;
      if (window.FileReader) {
        if (/(jpg|jpeg|gif|png)/i.test(data.files[0].name)) {
          reader = new FileReader();
          reader.onload = function(event) {
            $('#image-upload .message').hide();
            return $('#image-upload-form .dropable').css('background-image', 'url(' + event.target.result + ')');
          };
          return reader.readAsDataURL(data.files[0]);
        } else {
          $('#image-upload-form .dropable').css('background-image', 'none');
          return $('#image-upload .message').show();
        }
      }
    };

    ImageUploader.prototype.resetUploadForm = function() {
      $('#image-upload .filename').text('');
      $('#image-upload-form').off('submit');
      $('#image-upload .progress').hide();
      $('#image-upload .progress .bar').css('width', '0%');
      if (window.FileReader) {
        $('#image-upload-form .dropable').css('background-image', 'none');
      }
      $('#image-upload .message').show();
      return $('#image-upload .dropable').removeClass('start');
    };

    return ImageUploader;

  })();

}).call(this);
(function() {
  this.Editor.LinkCreator = (function() {
    function LinkCreator(editor) {
      var _this = this;
      this.editor = editor;
      this.editor.formator.link = function() {
        return _this.open();
      };
      this.modal = $('#link-creator-modal');
      this.input = this.modal.find('input[name=url]');
      this.bindActions();
    }

    LinkCreator.prototype.bindActions = function() {
      var _this = this;
      $("#link-form").on("submit", function(event) {
        var url;
        event.preventDefault();
        _this.editor.restoreRange();
        url = _this.input.val();
        if (!url.match(/\w+:\/\//)) {
          url = "http://" + url;
        }
        if (_this.editor.formator.isWraped('a')) {
          $(_this.editor.formator.commonAncestorContainer()).closest("a").prop('href', url);
        } else {
          _this.editor.formator.exec('createLink', url);
        }
        _this.editor.formator.afterFormat();
        _this.input.val('');
        return _this.close();
      });
      return $("#unlink-button").on("click", function(event) {
        event.preventDefault();
        _this.editor.restoreRange();
        if (_this.editor.formator.isWraped('a')) {
          document.getSelection().selectAllChildren($(_this.editor.formator.commonAncestorContainer()).closest("a")[0]);
          _this.editor.formator.exec('unlink');
          _this.editor.formator.afterFormat();
        }
        return _this.close();
      });
    };

    LinkCreator.prototype.open = function() {
      if (this.editor.formator.isWraped('a')) {
        this.input.val($(this.editor.formator.commonAncestorContainer()).closest("a").attr("href"));
      } else {
        this.input.val('');
      }
      Dialog.show(this.modal);
      return this.input.focus();
    };

    LinkCreator.prototype.close = function() {
      return Dialog.hide(this.modal);
    };

    return LinkCreator;

  })();

}).call(this);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
;
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/*!
 * modified for LayerSlider
 */




eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(j(e){j r(e){7(e J t.F)q e;k n=["2W","2V","O","1U"];k r=e.2U(0).2X()+e.2Y(1);7(e J t.F){q e}1k(k i=0;i<n.31;++i){k s=n[i]+r;7(s J t.F){q s}}}j i(){t.F[n.C]="";t.F[n.C]="Y(30)";q t.F[n.C]!==""}j f(e){7(E e==="1D"){4.2a(e)}q 4}j l(e,t,n){7(t===K){e.12(n)}L 7(t){e.12(t,n)}L{n()}}j c(t){k n=[];e.1j(t,j(t){t=e.2Z(t);t=e.H.1C[t]||e.2T[t]||t;t=d(t);7(e.2S(t,n)===-1){n.X(t)}});q n}j h(t,n,r,i){k s=c(t);7(e.1b[r]){r=e.1b[r]}k o=""+m(n)+" "+r;7(1B(i,10)>0){o+=" "+m(i)}k u=[];e.1j(s,j(e,t){u.X(t+" "+o)});q u.1n(", ")}j p(t,r){7(!r){e.2M[t]=K}e.H.1C[t]=n.C;e.W[t]={Q:j(n){k r=e(n).16("H:C");q r.Q(t)},G:j(n,r){k i=e(n).16("H:C");i.1u(t,r);e(n).16({"H:C":i})}}}j d(e){q e.1W(/([A-Z])/g,j(e){q"-"+e.21()})}j v(e,t){7(E e==="1D"&&!e.2L(/^[\\-0-9\\.]+$/)){q e}L{q""+e+t}}j m(t){k n=t;7(e.1H.1x[n]){n=e.1H.1x[n]}q v(n,"1U")}e.H={2K:"0.9.9",2N:K,1C:{2O:"1m",2R:"1m",2Q:"1m",2P:"1m",33:"1l",34:"1l",3j:"1l",3i:"1l"},20:K,1Y:27};k t=3h.3k("3l");k n={};k s=3o.3n.21().3m("3g")>-1;n.I=r("I");n.2b=r("2b");n.C=r("C");n.U=r("U");n.1Z=i();k o={I:"1N",2J:"3f",37:"36",35:"38",3a:"3e"};k u=n.1N=o[n.I]||D;1k(k a J n){7(n.1X(a)&&E e.1L[a]==="B"){e.1L[a]=n[a]}}t=D;e.1b={1F:"1d","J":"1d-J",1h:"1d-1h","J-1h":"1d-J-1h",3c:"w-z(0,1,.5,1)",3b:"w-z(.18, .3p, .2d, .19)",2h:"w-z(.2g,.2f,.1V,1)",2e:"w-z(.2I,.24,.1V,1)",2B:"w-z(.6,.2A,.2i,.2z)",2x:"w-z(.2y,.2C,.1Q,1)",2D:"w-z(.2H,.2G,.15,.1O)",2F:"w-z(.29,.1r,.2E,.2w)",2v:"w-z(.19,1,.22,1)",2n:"w-z(1,0,0,1)",2m:"w-z(.18,.2l,.1R,.2j)",2k:"w-z(.25,.46,.45,.2o)",2p:"w-z(.2u,.2c,.2t,.2s)",2q:"w-z(.2r,.2c,.3w,.22)",3W:"w-z(.1Q,.43,.44,1)",42:"w-z(.41,0,.26,1)",40:"w-z(.3Z,.1r,.3V,.3U)",4a:"w-z(.23,1,.32,1)",3X:"w-z(.1O,0,.3Y,1)",49:"w-z(.47,0,.4c,.4f)",4d:"w-z(.39,.4b,.4e,1)",48:"w-z(.3S,.1r,.18,.29)",3A:"w-z(.6,-.28,.3z,.24)",3B:"w-z(.26, .3C,.32,1.3D)",3q:"w-z(.1R,-.18,.3x,1.18)"};e.W["H:C"]={Q:j(t){q e(t).1P("C")||1S f},G:j(t,r){k i=r;7(!(i 3s f)){i=1S f(i)}7(n.C==="3r"&&!s){t.F[n.C]=i.1t(K)}L{t.F[n.C]=i.1t()}e(t).1P("C",i)}};e.W.C={G:e.W["H:C"].G};7(e.1y.3t<"1.8"){e.W.U={Q:j(e){q e.F[n.U]},G:j(e,t){e.F[n.U]=t}};e.W.I={Q:j(e){q e.F[n.I]},G:j(e,t){e.F[n.I]=t}}}p("1q");p("1s");p("N");p("1z");p("R");p("S");p("17");p("1i");p("Y");p("1o");p("1c");p("1p");p("1v");p("x",K);p("y",K);f.1E={1u:j(e,t){k n=E t==="1D"?t.1a(","):t.3u===1T?t:[t];n.3T(e);f.1E.G.V(4,n)},G:j(e){k t=1T.1E.3v.V(3E,[1]);7(4.1A[e]){4.1A[e].V(4,t)}L{4[e]=t.1n(",")}},Q:j(e){7(4.1w[e]){q 4.1w[e].V(4)}L{q 4[e]||0}},1A:{1s:j(e){4.17=v(e,"M")},1q:j(e,t){7(t===B){t=e}4.N=e+","+t},17:j(e){4.17=v(e,"M")},1i:j(e){4.1i=v(e,"M")},Y:j(e){4.Y=v(e,"M")},N:j(e,t){7(t===B){t=e}4.N=e+","+t},1z:j(e,t,n){7(t===B){t=e}7(n===B){n=e}4.1z=e+","+t+","+n},1p:j(e){4.1p=v(e,"M")},1v:j(e){4.1v=v(e,"M")},1c:j(e){4.1c=v(e,"T")},x:j(e){4.G("R",e,D)},y:j(e){4.G("R",D,e)},3F:j(e){4.G("S",e,D,D)},3O:j(e){4.G("S",D,e,D)},3N:j(e){4.G("S",D,D,e)},R:j(e,t){7(4.14===B){4.14=0}7(4.13===B){4.13=0}7(e!==D&&e!==B){4.14=v(e,"T")}7(t!==D&&t!==B){4.13=v(t,"T")}4.R=4.14+","+4.13},S:j(e,t,n){7(4.1f===B){4.1f=0}7(4.1g===B){4.1g=0}7(4.1e===B){4.1e=0}7(e!==D&&e!==B){4.1f=v(e,"T")}7(t!==D&&t!==B){4.1g=v(t,"T")}7(n!==D&&n!==B){4.1e=v(n,"T")}4.S=4.1f+","+4.1g+","+4.1e}},1w:{1s:j(){k e=4.17||"1M".1a("M")[0];q v(e,"M")},1q:j(){k e=(4.N||"1,1,1").1a(",");7(e[0]){e[0]=P(e[0])}7(e[1]){e[1]=P(e[1])}7(e[2]){e[2]=P(e[2])}q e[0]===e[1]===e[2]?e[0]:e},x:j(){q 4.14||0},y:j(){q 4.13||0},N:j(){k e=(4.N||"1,1,1").1a(",");7(e[0]){e[0]=P(e[0])}7(e[1]){e[1]=P(e[1])}7(e[2]){e[2]=P(e[2])}q e[0]===e[1]===e[2]?e[0]:e},1o:j(){k e=(4.1o||"0,0,0,1M").1a(",");1k(k t=0;t<=3;++t){7(e[t]){e[t]=P(e[t])}}7(e[3]){e[3]=v(e[3],"M")}q e}},2a:j(e){k t=4;e.1W(/([a-3P-3Q-9]+)\\((.*?)\\)/g,j(e,n,r){t.1u(n,r)})},1t:j(e){k t=[];1k(k r J 4){7(4.1X(r)){7(!n.1Z&&(r==="1i"||r==="Y"||r==="1c"||r==="U")){3R}7(r[0]!=="3M"){7(e&&r==="N"){t.X(r+"3d("+4[r]+",1)")}L 7(e&&r==="R"){t.X(r+"3d("+4[r]+",0)")}L{t.X(r+"("+4[r]+")")}}}}q t.1n(" ")}};e.1y.I=e.1y.H=j(t,r,i,s){k o=4;k a=0;k f=K;7(E r==="j"){s=r;r=B}7(E i==="j"){s=i;i=B}7(E t.1J!=="B"){i=t.1J;11 t.1J}7(E t.1I!=="B"){r=t.1I;11 t.1I}7(E t.1G!=="B"){s=t.1G;11 t.1G}7(E t.12!=="B"){f=t.12;11 t.12}7(E t.1K!=="B"){a=t.1K;11 t.1K}7(E r==="B"){r=e.1H.1x.1F}7(E i==="B"){i=e.1b.1F}r=m(r);k c=h(t,r,i,a);k p=e.H.20&&n.I;k d=p?1B(r,10)+1B(a,10):0;7(d===0){k v=j(e){o.16(t);7(s){s.V(o)}7(e){e()}};l(o,f,v);q o}k g={};k y=j(r){k i=27;k a=j(){7(i){o.3L(u,a)}7(d>0){o.1j(j(){4.F[n.I]=g[4]||D})}7(E s==="j"){s.V(o)}7(E r==="j"){r()}};7(d>0&&u&&e.H.1Y){i=K;o.3H(u,a)}L{3G.3I(a,d)}o.1j(j(){7(d>0){4.F[n.I]=c}e(4).16(t)})};k b=j(e){4.3J;y(e)};l(o,f,b);q 4};e.H.3K=h})(3y)',62,264,'||||this|||if||||||||||||function|var||||||return||||||cubic|||bezier||undefined|transform|null|typeof|style|set|transit|transition|in|true|else|deg|scale||parseFloat|get|translate|translate3d|px|transformOrigin|apply|cssHooks|push|rotateY|||delete|queue|_translateY|_translateX||css|rotate|55||split|cssEase|perspective|ease|_translate3dZ|_translate3dX|_translate3dY|out|rotateX|each|for|padding|margin|join|rotate3d|skewX|kmScale|05|kmRotate|toString|setFromString|skewY|getter|speeds|fn|scale3d|setter|parseInt|propertyMap|string|prototype|_default|complete|fx|duration|easing|delay|support|0deg|transitionEnd|86|data|165|68|new|Array|ms|355|replace|hasOwnProperty|useTransitionEnd|transform3d|enabled|toLowerCase|||045||175|false||95|parse|transitionDelay|03|675|easeInOutCubic|61|215|easeOutCubic|98|53|easeOutQuad|085|easeInQuad|easeInOutExpo|94|easeInOutQuad|easeInQuart|895|955|515|455|easeOutExpo|035|easeOutCirc|075|335|04|easeInCirc|82|easeInOutCirc|795|easeInExpo|135|785|645|MozTransition|version|match|cssNumber|modifiedForLayerSlider|marginLeft|marginTop|marginBottom|marginRight|inArray|cssProps|charAt|Webkit|Moz|toUpperCase|substr|camelCase|90deg|length||paddingLeft|paddingRight|WebkitTransition|oTransitionEnd|OTransition|webkitTransitionEnd||msTransition|easeInCubic|snap||MSTransitionEnd|transitionend|chrome|document|paddingTop|paddingBottom|createElement|div|indexOf|userAgent|navigator|055|easeInOutBack|WebkitTransform|instanceof|jquery|constructor|slice|685|265|jQuery|735|easeInBack|easeOutBack|885|275|arguments|t3dx|window|bind|setTimeout|offsetWidth|getTransitionValue|unbind|_|t3dz|t3dy|zA|Z0|continue|445|unshift|06|855|easeOutQuart|easeInOutQuint|07|755|easeInQuint|77|easeInOutQuart|84|||||easeInOutSine|easeInSine|easeOutQuint|575|745|easeOutSine|565|715'.split('|')))
;

/*
	* LayerSlider
	*
	* (c) 2011-2013 George Krupa, John Gera & Kreatura Media
	*
	* Plugin web:			http://kreaturamedia.com/
	* Licenses: 			http://codecanyon.net/licenses/
*/




eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('16 9E(e,t,n){10(28 e=="aE"){12 r=34("#"+e)}19 10(28 e=="9B"){12 r=e}12 i,s;2I(t){1j"78":i="bq 34 55";s="6J 6N 6O aS 4F 36 3k 7e 7d 4V 3k 7I aZ 9O an 8I 8m 36 2o 34 5X 5a 7G a aM d6 4t 3e 5O 5R\'t 2Q 3k 6I. <1T>9X ae 5r 3k 4g 6Q a4 2W a2 14 6I 4t 9R 2o \\"a5 7b a6 2W 3l\\" ag 3p 2o ac 9Q 9n 2o 9e 6P.</1T><br><br>4x 14 dd\'t 6K 3k 8T, 7M 9L 2W dg d4 7e 5k 4F-by-4F 2W 18 9M 5a 4F 7G 14 55. 4x 3R cS ak 2o dQ 5k, 7M 8Y 6V 2o 5k 8d 2W 6K 14 1j. 4x 1F 36 3k 7d 7G 14 8T, 7x dq be 3k 7I 4t 3R dv 8Y 6V 2o 8d 36 2o 7I. dt af 4Y c0 2W 5w c8 bJ 36 2o 34 5X.<br><br>4x bG 41 bF 4F 2W af 3R, 7M 9f a cb 3p 2o cc 6P 36 2o cB 5r ah.";1k;1j"9F":i="5F 34 55";s="6J 6N 6O 3R 9j 9J an 5F 2v ("+n+\') 36 2o 34 5X. 3e cC at cA 2v 1.7.0 4V cz. 4x 3R 9j 9J 2o 4g 2v 36 3e, 3R 5R 9L 9M 2o "34 cD" 5k 4Y 2o 5O 5k cI. 4x 3R cG\\\'t cH cv 2W do, 3R 5R 9f cj a ch cg 4Y ce ah cf cr. cs cp a a9 5O 6Q 9Y (4V a a9 cn 9Y 3p cl cd) 2W 6K 14 55.\';1k;1j"80":i="34 9N 55";s=\'6J 6N 6O 4F 36 3k 7e 7d cu cF 34 9N 4t 9O an 8I 8m 36 14 5X 5a 5R am cZ. 9X ae 5r 3k 4g 6Q a4 2W a2 14 6I 4t 9R 2o "a5 7b a6 2W 3l" ag 3p 3k ac 9Q 9n 2o 9e 6P.\';1k}r.1t("11-7q");r.3z(\'<p 1n="11-aH">!</p>\');r.3z(\'<p 1n="11-7q-aG">3e: \'+i+"</p>");r.3z(\'<p 1n="11-7q-6T">\'+s+"</p>")}(16(e){e.9x.2M=16(n){12 r="1.7.0";12 i=e.9x.78;12 s=e(14);12 o=16(e,t){12 n=e.1Y(".");12 r=t.1Y(".");2u(12 i=0;i<n.1o;++i){10(r.1o==i){1P 1e}10(1c(n[i])==1c(r[i])){aD}19 10(1c(n[i])>1c(r[i])){1P 1e}19{1P 1a}}10(n.1o!=r.1o){1P 1a}1P 1a};10(!o("1.8.0",i)){s.1t("11-9H")}10(!o(r,i)){9E(s,"9F",i)}19{10((28 n).3s("9B|3c")){1P 14.1X(16(e){3m t(14,n)})}19{10(n=="13"){12 u=e(14).13("3e").g;10(u){1P u}}19{1P 14.1X(16(t){12 r=e(14).13("3e");10(r){10(!r.g.2Y&&!r.g.3C){10(28 n=="3M"){10(n>0&&n<r.g.2E+1&&n!=r.g.2a){r.4k(n)}}19{2I(n){1j"1O":r.o.5B(r.g);r.1O("5P");1k;1j"1R":r.o.5K(r.g);r.1R("5P");1k;1j"23":10(!r.g.2G){r.o.a7(r.g);r.g.2V=1a;r.23()}1k}}}10(n=="4G"){r.d.6k()}10((r.g.2G||!r.g.2G&&r.g.2V)&&n=="1h"){r.o.a0(r.g);r.g.2V=1e;r.g.1H.18(\'2e[1l*="5c.4u"], 2e[1l*="5d.4v"]\').1X(16(){3a(e(14).13("5D"))});r.1h()}10(n=="9u 1h"){r.8D()}}})}}}};12 t=16(s,o){12 u=14;u.$9A=e(s).1t("11-2h");u.$9A.13("3e",u);u.2Q=16(){u.o=e.4I({},t.8Q,o);u.g=e.4I({},t.5J);u.g.4i=e(s).43("11-9H")?1e:1a;10(28 9K!="3c"){u.t=e.4I({},9K)}10(28 9w!="3c"){u.ct=e.4I({},9w)}10(!u.g.9k){u.g.9k=1a;u.4G();10(e("4e").18(\'9h[7g*="4g"]\').1o){u.g.6R=e("4e").18(\'9h[7g*="4g"]\').1f("7g").1Y("4g")[1]}10(e("4e").18(\'7a[1l*="5W"]\').1o){10(e("4e").18(\'7a[1l*="5W"]\').1f("1l").1w("?")!=-1){u.g.7c=e("4e").18(\'7a[1l*="5W"]\').1f("1l").1Y("?")[1].1Y("=")[1]}}u.d.aT("3e bu");u.d.aU(\'<a 2f="#">1O</a> | <a 2f="#">1R</a> | <a 2f="#">23</a> | <a 2f="#">1h</a> | <a 2f="#">9u 1h</a>\');u.d.3A.18("a").1X(16(){e(14).2k(16(t){t.38();e(s).2M(e(14).6T())})});u.d.aT("3e 2v bb");u.d.aU("7b 2v: <1T>"+u.g.2v+"</1T>");10(u.g.7c){u.d.aL("5O 2v: <1T>"+u.g.7c+"</1T>")}10(u.g.6R){u.d.aL("4g 2v: <1T>"+u.g.6R+"</1T>")}u.d.aL("34 2v: <1T>"+e().78+"</1T>");10(e(s).1f("4n")){u.d.aT("3e 2h");u.d.aU("#"+e(s).1f("4n"))}10(!u.o.2H||u.o.2H==""||!u.o.3O||u.o.3O==""){u.d.aT("aX aR 2H. aQ: aP 2H 4t / 4V 3O.");u.4A()}19{u.d.aT("b8 2W 2Q 6V 2H: "+u.o.2H,1a);e(s).1t("11-"+u.o.2H);12 n=u.o.3O+u.o.2H+"/2H.17";70=e("ad");10(!e("ad").1o){70=e("3l")}10(e(\'6w[2f="\'+n+\'"]\').1o){u.d.aU(\'b5 "\'+u.o.2H+\'" 41 b1 3w.\');r=e(\'6w[2f="\'+n+\'"]\');10(!u.g.3w){u.g.3w=1a;2i(16(){u.4A()},5v)}}19{10(2p.a8){2p.a8(n);12 r=e(\'6w[2f="\'+n+\'"]\')}19{12 r=e(\'<6w 5I="b3" 2f="\'+n+\'" 4d="6T/17" />\').1q(70)}}r.2Q(16(){10(!u.g.3w){u.d.aU("8j.2Q(); 73");u.g.3w=1a;2i(16(){u.4A()},5v)}});e(2Z).2Q(16(){10(!u.g.3w){u.d.aU("$(2Z).2Q(); 73");u.g.3w=1a;2i(16(){u.4A()},5v)}});2i(16(){10(!u.g.3w){u.d.aT("b2 b0: b4 8j.2Q(); 4V $(2Z).2Q(); b9 73");u.g.3w=1a;u.4A()}},3S)}}};u.4A=16(){10(!e("4e").1f("4n")){e("4e").1f("4n","11-5J")}19 10(!e("3l").1f("4n")){e("3l").1f("4n","11-5J")}u.g.1D=16(){10(u.g.4o&&u.g.3X){1P u.g.4o}19{1P e(s).1b()}};u.g.1G=16(){10(u.g.4J&&u.g.3X){1P u.g.4J}19{1P e(s).1d()}};10(e(s).18(".11-1Q").1o==1){u.o.6f=1e;u.o.7S=1e;u.o.6t=1e;u.o.63=1e;u.o.3Y=0;u.o.5U=1e;u.o.3Q=1a;u.o.2g=1;u.o.32="b7"}10(u.o.1b){u.g.6L=u.g.2C=""+u.o.1b}19{u.g.6L=u.g.2C=e(s)[0].1J.1b}10(u.o.1d){u.g.3W=""+u.o.1d}19{u.g.3W=e(s)[0].1J.1d}10(u.g.2C.1w("%")==-1&&u.g.2C.1w("1A")==-1){u.g.2C+="1A"}10(u.g.3W.1w("%")==-1&&u.g.3W.1w("1A")==-1){u.g.3W+="1A"}10(u.o.9b&&u.g.2C.1w("1A")!=-1&&u.g.3W.1w("1A")!=-1){u.g.3x=1a}19{u.g.3x=1e}e(s).18(\'*[1n*="11-s"], *[1n*="11-bg"]\').1X(16(){10(!e(14).2s().43("11-1Q")){e(14).b6(e(14).2s())}});e(s).18(".11-1Q").1X(16(){e(14).30(\':8b([1n*="11-"])\').1X(16(){e(14).5w()})});e(s).18(\'.11-1Q, *[1n*="11-s"]\').1X(16(){10(e(14).1f("5I")||e(14).1f("1J")){10(e(14).1f("5I")){12 t=e(14).1f("5I").3b().1Y(";")}19{12 t=e(14).1f("1J").3b().1Y(";")}2u(x=0;x<t.1o;x++){3j=t[x].1Y(":");10(3j[0].1w("3N")!=-1){3j[1]=u.8F(3j[1])}12 n="";10(3j[2]){n=":"+e.54(3j[2])}10(3j[0]!=" "&&3j[0]!=""){e(14).13(e.54(3j[0]),e.54(3j[1])+n)}}}12 r=e(14);r.13("4a",r[0].1J.1i);r.13("3P",r[0].1J.1u);10(e(14).41("a")&&e(14).30().1o>0){r=e(14).30()}12 i=r.1b();12 s=r.1d();10(r[0].1J.1b&&r[0].1J.1b.1w("%")!=-1){i=r[0].1J.1b}10(r[0].1J.1d&&r[0].1J.1d.1w("%")!=-1){s=r[0].1J.1d}r.13("31",i);r.13("33",s);r.13("77",r.17("26-1i"));r.13("74",r.17("26-1I"));r.13("71",r.17("26-1u"));r.13("72",r.17("26-1s"));10(!u.g.1N){12 o=28 3Z(r.17("2B"))=="3M"?1x.5s(3Z(r.17("2B"))*1Z)/1Z:1;e(14).13("6l",o)}10(r.17("3h-1i-1b").1w("1A")==-1){r.13("6y",r[0].1J.8x)}19{r.13("6y",r.17("3h-1i-1b"))}10(r.17("3h-1I-1b").1w("1A")==-1){r.13("6C",r[0].1J.8s)}19{r.13("6C",r.17("3h-1I-1b"))}10(r.17("3h-1u-1b").1w("1A")==-1){r.13("5N",r[0].1J.8h)}19{r.13("5N",r.17("3h-1u-1b"))}10(r.17("3h-1s-1b").1w("1A")==-1){r.13("65",r[0].1J.8t)}19{r.13("65",r.17("3h-1s-1b"))}r.13("8e",r.17("8c-88"));r.13("8a",r.17("89-1d"))});10(2p.7m.8v){2u(12 t=0;t<e(s).18(".11-1Q").1o;t++){10(e(s).18(".11-1Q").3G(t).13("aY")==2p.7m.8v.1Y("#")[1]){u.o.2g=t+1}}}e(s).18(\'*[1n*="11-7k-"]\').1X(16(){12 t=e(14).1f("1n").1Y(" ");2u(12 n=0;n<t.1o;n++){10(t[n].1w("11-7k-")!=-1){12 r=1c(t[n].1Y("11-7k-")[1]);e(14).17({aO:"aN"}).2k(16(t){t.38();e(s).2M(r)})}}});u.g.2E=e(s).18(".11-1Q").1o;10(u.o.5S&&u.g.2E>2){u.o.2g=="2t";u.o.7Z=1e}19{u.o.5S=1e}10(u.o.2g=="2t"){u.o.2g=1x.29(1x.2t()*u.g.2E+1)}u.o.2g=u.o.2g<u.g.2E+1?u.o.2g:1;u.o.2g=u.o.2g<1?1:u.o.2g;u.g.47=1;10(u.o.4r){u.g.47=0}12 n=2p.7m.2f.1w("aW:")==-1?"":"aV:";e(s).18(\'2e[1l*="5c.4u"], 2e[1l*="4u.be"]\').1X(16(){e(14).2s().1t("11-6s-1Q");10(e(14).2s(\'[1n*="11-s"]\')){12 t=e(14);e.8y(n+"//bt.8V.6E/bs/99/bv/"+e(14).1f("1l").1Y("92/")[1].1Y("?")[0]+"?v=2&bw=98&97=?",16(e){t.13("6o",1c(e["bA"]["bz$bx"]["bp$2l"]["bo"])*3S)});12 r=e("<1g>").1t("11-5g").1q(e(14).2s());e("<22>").1q(r).1t("11-3U").1f("1l",n+"//22.8V.6E/aK/"+e(14).1f("1l").1Y("92/")[1].1Y("?")[0]+"/"+u.o.8R);e("<1g>").1q(r).1t("11-94");e(14).2s().17({1b:e(14).1b(),1d:e(14).1d()}).2k(16(){u.g.2Y=1a;10(u.g.3q){10(u.o.3Q!=1e){u.g.3q=1e}u.g.2V=1a}19{u.g.2V=u.g.2G}10(u.o.3Q!=1e){u.1h()}u.g.52=1a;e(14).18("2e").1f("1l",e(14).18("2e").13("4m"));e(14).18(".11-5g").1C(u.g.v.d).2U(u.g.v.7z,16(){10(u.o.3Q=="1U"&&u.g.2V==1a){12 e=2i(16(){u.23()},t.13("6o")-u.g.v.d);t.13("5D",e)}u.g.2Y=1e;10(u.g.3g==1a){u.3L(u.g.1H,16(){u.g.3g=1e})}})});12 i="&";10(e(14).1f("1l").1w("?")==-1){i="?"}10(e(14).1f("1l").1w("3u=0")!=-1){e(14).13("4m",e(14).1f("1l").2j("3u=0","3u=1"))}19 10(e(14).1f("1l").1w("3u")==-1){e(14).13("4m",e(14).1f("1l")+i+"3u=1")}e(14).13("31",e(14).1f("1b"));e(14).13("33",e(14).1f("1d"));e(14).1f("1l","")}});e(s).18(\'2e[1l*="5d.4v"]\').1X(16(){e(14).2s().1t("11-6s-1Q");10(e(14).2s(\'[1n*="11-s"]\')){12 t=e(14);12 r=e("<1g>").1t("11-5g").1q(e(14).2s());e.8y(n+"//4v.6E/99/bh/6s/"+e(14).1f("1l").1Y("6s/")[1].1Y("?")[0]+".98?97=?",16(n){e("<22>").1q(r).1t("11-3U").1f("1l",n[0]["bf"]);t.13("6o",1c(n[0]["2l"])*3S);e("<1g>").1q(r).1t("11-94")});e(14).2s().17({1b:e(14).1b(),1d:e(14).1d()}).2k(16(){u.g.2Y=1a;10(u.g.3q){10(u.o.3Q!=1e){u.g.3q=1e}u.g.2V=1a}19{u.g.2V=u.g.2G}10(u.o.3Q!=1e){u.1h()}u.g.52=1a;e(14).18("2e").1f("1l",e(14).18("2e").13("4m"));e(14).18(".11-5g").1C(u.g.v.d).2U(u.g.v.7z,16(){10(u.o.3Q=="1U"&&u.g.2V==1a){12 e=2i(16(){u.23()},t.13("6o")-u.g.v.d);t.13("5D",e)}u.g.2Y=1e;10(u.g.3g==1a){u.3L(u.g.1H,16(){u.g.3g=1e})}})});12 i="&";10(e(14).1f("1l").1w("?")==-1){i="?"}10(e(14).1f("1l").1w("3u=0")!=-1){e(14).13("4m",e(14).1f("1l").2j("3u=0","3u=1"))}19 10(e(14).1f("1l").1w("3u")==-1){e(14).13("4m",e(14).1f("1l")+i+"3u=1")}e(14).13("31",e(14).1f("1b"));e(14).13("33",e(14).1f("1d"));e(14).1f("1l","")}});10(u.o.4r){u.o.2g=u.o.2g-1==0?u.g.2E:u.o.2g-1}u.g.2a=u.o.2g;u.g.1H=e(s).18(".11-1Q:3G("+(u.g.2a-1)+")");e(s).18(".11-1Q").bi(\'<1g 1n="11-27"></1g>\');e("<1g>").1t("11-3E-bj").5G(e(s));10(u.o.8r){u.g.3K=e("<1g>").1t("11-bn-4M").1q(e(s).18(".11-27"))}10(u.o.9d&&!u.g.1N){u.g.2R=e("<1g>").1t("11-bm-4M").1q(e(s).18(".11-27"));u.g.2R.3z(e(\'<1g 1n="11-ct-1i"><1g 1n="11-ct-3t"><1g 1n="11-ct-95"><1g 1n="11-ct-96"></1g></1g></1g></1g><1g 1n="11-ct-1I"><1g 1n="11-ct-3t"><1g 1n="11-ct-95"><1g 1n="11-ct-96"></1g></1g></1g></1g><1g 1n="11-ct-bl"></1g>\'))}u.g.3f=e("<1g>").17({9V:-1,1y:"1F"}).1t("11-8S-2h").1q(e(s));e("<1g>").1t("11-8S-bk").1q(u.g.3f);10(e(s).17("3i")=="bB"){e(s).17("3i","8G")}10(u.o.5Q){e(s).18(".11-27").17({aw:"4P("+u.o.5Q+")"})}19{e(s).18(".11-27").17({ap:u.o.82})}10(u.o.82=="7U"&&u.o.5Q==1e){e(s).18(".11-27").17({48:"1F 7U !ao"})}10(u.g.3x&&u.g.7L()!=1a&&u.o.93&&(28 4l(2p,"8B")!="3c"||28 4l(2p,"8A")!="3c")){12 r=e("<a>").17("1y","1F").1t("11-6B").2k(16(){u.8H()}).1q(e(s).18(".11-27"));e(s).1M(16(){10(u.g.1N){r.17({1y:"2b"})}19{r.1h(1a,1a).2x(2n)}},16(){10(u.g.1N){r.17({1y:"1F"})}19{r.1h(1a,1a).2U(2n)}});2p.6D("aq",16(){10(!2p.6B){u.58()}19{}},1e);2p.6D("ar",16(){10(!2p.as){u.58()}19{}},1e);2p.6D("au",16(){10(!2p.al){u.58()}19{}},1e)}10(u.o.7S){e(\'<a 1n="11-1m-1O" 2f="#" />\').2k(16(t){t.38();e(s).2M("1O")}).1q(e(s));e(\'<a 1n="11-1m-1R" 2f="#" />\').2k(16(t){t.38();e(s).2M("1R")}).1q(e(s));10(u.o.8n){e(s).18(".11-1m-1O, .11-1m-1R").17({1y:"1F"});e(s).1M(16(){10(!u.g.6X){10(u.g.1N){e(s).18(".11-1m-1O, .11-1m-1R").17("1y","2b")}19{e(s).18(".11-1m-1O, .11-1m-1R").1h(1a,1a).2x(2n)}}},16(){10(u.g.1N){e(s).18(".11-1m-1O, .11-1m-1R").17("1y","1F")}19{e(s).18(".11-1m-1O, .11-1m-1R").1h(1a,1a).2U(2n)}})}}10(u.o.6t||u.o.63){12 i=e(\'<1g 1n="11-1s-1m-2J" />\').1q(e(s));u.g.2S=i;10(u.o.32=="4j"){i.1t("11-8P-4B")}10(u.o.63&&u.o.32!="4j"){e(\'<5n 1n="11-1s-4f" />\').1q(e(s).18(".11-1s-1m-2J"));10(u.o.32=="1M"){12 o=e(\'<1g 1n="11-1z-1M"><1g 1n="11-1z-1M-27"><1g 1n="11-1z-1M-bg"></1g><1g 1n="11-1z-1M-22"><22></1g><5n></5n></1g></1g>\').1q(e(s).18(".11-1s-4f"))}2u(x=1;x<u.g.2E+1;x++){12 a=e(\'<a 2f="#" />\').1q(e(s).18(".11-1s-4f")).2k(16(t){t.38();e(s).2M(e(14).5u()+1)});10(u.o.32=="1M"){e(s).18(".11-1z-1M, .11-1z-1M-22").17({1b:u.o.7H,1d:u.o.5m});12 f=e(s).18(".11-1z-1M");12 l=f.18("22").17({1d:u.o.5m});12 c=e(s).18(".11-1z-1M-27").17({21:"2O",1y:"2b"});a.1M(16(){12 t=e(s).18(".11-1Q").3G(e(14).5u());10(t.18(".11-6b").1o){12 n=t.18(".11-6b").1f("1l")}19 10(t.18(".11-3U").1o){12 n=t.18(".11-3U").1f("1l")}19 10(t.18(".11-bg").1o){12 n=t.18(".11-bg").1f("1l")}19{12 n=u.o.3O+u.o.2H+"/6Z.5T"}e(s).18(".11-1z-1M-22").17({1i:1c(f.17("26-1i")),1u:1c(f.17("26-1u"))});l.2Q(16(){10(e(14).1b()==0){l.17({3i:"8G",2T:"0 1U",1i:"1U"})}19{l.17({3i:"av",2z:-e(14).1b()/2,1i:"50%"})}}).1f("1l",n);f.17({1y:"2b"}).1h().20({1i:e(14).3i().1i+(e(14).1b()-f.4S())/2},7f,"5Z");c.17({1y:"1F",21:"2A"}).1h().2x(7f)},16(){c.1h().2U(7f,16(){f.17({21:"2O",1y:"2b"})})})}}10(u.o.32=="1M"){o.1q(e(s).18(".11-1s-4f"))}e(s).18(".11-1s-4f a:3G("+(u.o.2g-1)+")").1t("11-1m-1S")}10(u.o.6t){12 h=e(\'<a 1n="11-1m-23" 2f="#" />\').2k(16(t){t.38();e(s).2M("23")}).5G(e(s).18(".11-1s-1m-2J"));12 p=e(\'<a 1n="11-1m-1h" 2f="#" />\').2k(16(t){t.38();e(s).2M("1h")}).1q(e(s).18(".11-1s-1m-2J"))}19 10(u.o.32!="4j"){e(\'<5n 1n="11-1m-8z 11-1m-aI" />\').5G(e(s).18(".11-1s-1m-2J"));e(\'<5n 1n="11-1m-8z 11-1m-aB" />\').1q(e(s).18(".11-1s-1m-2J"))}10(u.o.6c&&u.o.32!="4j"){i.17({1y:"1F"});e(s).1M(16(){10(!u.g.6X){10(u.g.1N){i.17("1y","2b")}19{i.1h(1a,1a).2x(2n)}}},16(){10(u.g.1N){i.17("1y","1F")}19{i.1h(1a,1a).2U(2n)}})}}10(u.o.32=="4j"){u.g.3B=e(\'<1g 1n="11-1z-2J"></1g>\').1q(e(s));12 o=e(\'<1g 1n="11-1z"><1g 1n="11-1z-27"><1g 1n="11-1z-1K-2h"><1g 1n="11-1z-1K"></1g></1g></1g></1g>\').1q(u.g.3B);u.g.4B=e(s).18(".11-1z-1K-2h");10(!("64"3p 2Z)){u.g.4B.1M(16(){e(14).1t("11-1z-1K-1M")},16(){e(14).2X("11-1z-1K-1M");u.79()}).aA(16(t){12 n=1c(t.az-e(14).8o().1i)/e(14).1b()*(e(14).1b()-e(14).18(".11-1z-1K").1b());e(14).18(".11-1z-1K").1h().17({2z:n})})}19{u.g.4B.1t("11-ay")}e(s).18(".11-1Q").1X(16(){12 t=e(14).5u()+1;10(e(14).18(".11-6b").1o){12 n=e(14).18(".11-6b").1f("1l")}19 10(e(14).18(".11-3U").1o){12 n=e(14).18(".11-3U").1f("1l")}19 10(e(14).18(".11-bg").1o){12 n=e(14).18(".11-bg").1f("1l")}10(n){12 r=e(\'<a 2f="#" 1n="11-3v-\'+t+\'"><22 1l="\'+n+\'"></a>\')}19{12 r=e(\'<a 2f="#" 1n="11-6Z 11-3v-\'+t+\'"><22 1l="\'+u.o.3O+u.o.2H+\'/6Z.5T"></a>\')}r.1q(e(s).18(".11-1z-1K"));10(!("64"3p 2Z)){r.1M(16(){e(14).30().1h().5V(2n,u.o.7w/1Z)},16(){10(!e(14).30().43("11-3v-1S")){e(14).30().1h().5V(2n,u.o.7v/1Z)}})}r.2k(16(n){n.38();e(s).2M(t)})});10(h&&p){12 d=u.g.2S=e(\'<1g 1n="11-1s-1m-2J 11-aC-4B"></1g>\').1q(e(s));h.81().2k(16(t){t.38();e(s).2M("23")}).1q(d);p.81().2k(16(t){t.38();e(s).2M("1h")}).1q(d)}10(u.o.6c){u.g.3B.17("1y","1F");10(d){u.g.2S=d.17("1y")=="2b"?d:e(s).18(".11-8P-4B");u.g.2S.17("1y","1F")}e(s).1M(16(){e(s).1t("11-1M");10(!u.g.6X){10(u.g.1N){u.g.3B.17("1y","2b");10(u.g.2S){u.g.2S.17("1y","2b")}}19{u.g.3B.1h(1a,1a).2x(2n);10(u.g.2S){u.g.2S.1h(1a,1a).2x(2n)}}}},16(){e(s).2X("11-1M");10(u.g.1N){u.g.3B.17("1y","1F");10(u.g.2S){u.g.2S.17("1y","1F")}}19{u.g.3B.1h(1a,1a).2U(2n);10(u.g.2S){u.g.2S.1h(1a,1a).2U(2n)}}})}}u.g.3y=e(\'<1g 1n="11-3y"></1g>\').1q(e(s));10(u.g.3y.17("1y")=="2b"&&!u.g.3y.18("22").1o){u.g.67=16(){u.g.3y.17({1y:"1F",21:"2A"}).2x(3I,16(){u.g.67=1e})};u.g.4p=e("<22>").1f("1l",u.o.3O+u.o.2H+"/3y.5T").1q(u.g.3y);u.g.8u=28 1c(e(s).17("26-1s"))=="3M"?1c(e(s).17("26-1s")):0}u.7i();10(u.o.8M&&e(s).18(".11-1Q").1o>1){e("3l").6a("aJ",16(e){10(!u.g.2Y&&!u.g.3C){10(e.5a==37){u.o.5B(u.g);u.1O("5P")}19 10(e.5a==39){u.o.5K(u.g);u.1R("5P")}}})}10("64"3p 2Z&&e(s).18(".11-1Q").1o>1&&u.o.8C){e(s).18(".11-27").6a("db",16(e){12 t=e.4D?e.4D:e.8K.4D;10(t.1o==1){u.g.6g=u.g.5t=t[0].8J}});e(s).18(".11-27").6a("dc",16(e){12 t=e.4D?e.4D:e.8K.4D;10(t.1o==1){u.g.5t=t[0].8J}10(1x.40(u.g.6g-u.g.5t)>45){e.38()}});e(s).18(".11-27").6a("d9",16(t){10(1x.40(u.g.6g-u.g.5t)>45){10(u.g.6g-u.g.5t>0){u.o.5K(u.g);e(s).2M("1R")}19{u.o.5B(u.g);e(s).2M("1O")}}})}10(u.o.8L==1a&&e(s).18(".11-1Q").1o>1){e(s).18(".11-27").1M(16(){u.o.a1(u.g);10(u.g.2G){u.g.3q=1a;u.1h();10(u.g.3K){u.g.3K.1h()}10(u.g.2R){u.g.2R.18(".11-ct-3t").1h()}u.g.3F=(3m 4H).4E()}},16(){10(u.g.3q==1a){u.23();u.g.3q=1e}})}u.7h();10(u.o.1p){u.g.1p=e("<22>").1t("11-d7").1q(e(s)).1f("1J",u.o.8N).17({21:"2O",1y:"d8"}).2Q(16(){12 t=0;10(!u.g.1p){t=3S}2i(16(){u.g.1p.13("31",u.g.1p.1b());u.g.1p.13("33",u.g.1p.1d());10(u.g.1p.17("1i")!="1U"){u.g.1p.13("4a",u.g.1p[0].1J.1i)}10(u.g.1p.17("1I")!="1U"){u.g.1p.13("4X",u.g.1p[0].1J.1I)}10(u.g.1p.17("1u")!="1U"){u.g.1p.13("3P",u.g.1p[0].1J.1u)}10(u.g.1p.17("1s")!="1U"){u.g.1p.13("5p",u.g.1p[0].1J.1s)}10(u.o.7W!=1e){e("<a>").1q(e(s)).1f("2f",u.o.7W).1f("de",u.o.8O).17({dj:"1F",dk:"1F"}).3z(u.g.1p)}u.g.1p.17({1y:"1F",21:"2A"});u.6M()},t)}).1f("1l",u.o.1p)}e(2Z).3g(16(){u.g.3g=1a;10(!u.g.2Y){u.3L(u.g.1H,16(){10(u.g.2w){u.g.2w.5e()}u.g.3g=1e});10(u.g.1p){u.6M()}}});u.g.8W=1a;10(u.o.4r==1a){10(u.o.6f){u.g.2G=1a;e(s).18(".11-1m-23").1t("11-1m-23-1S")}19{e(s).18(".11-1m-1h").1t("11-1m-1h-1S")}u.1R()}19{u.59(u.g.1H,16(){u.g.1H.2x(3S,16(){u.g.3C=1e;e(14).1t("11-1S");10(u.o.7R){e(14).1C(e(14).13("4Q")+25).di(16(){e(14).18(".11-3U").2k();e(14).7p()})}u.g.1H.18(\' > *[1n*="11-s"]\').1X(16(){10(e(14).13("6m")>0){12 t=e(14);t.13("66",2i(16(){u.7K(t)},t.13("6m")))}})});u.7l(u.g.2a);10(u.o.6f){u.g.3C=1e;u.23()}19{e(s).18(".11-1m-1h").1t("11-1m-1h-1S")}})}u.o.9I(e(s))};u.8H=16(){10(!u.g.2Y&&!u.g.3C){10(4l(2p,"8B")||4l(2p,"8A")){4l(2p,"dh");u.58()}19{u.g.4o=u.g.1D();u.g.4J=u.g.1G();u.g.53=u.g.1B;4l(e(s)[0],"df");e(s).1t("11-2h-6B")}}};u.58=16(){u.g.3X=1a;e(s).2X("11-2h-6B")};u.23=16(){10(u.g.2G){10(u.g.2c=="1O"&&u.o.7Z){u.1O()}19{u.1R()}}19{u.g.2G=1a;10(!u.g.2Y&&!u.g.3C){u.4M()}}e(s).18(".11-1m-23").1t("11-1m-23-1S");e(s).18(".11-1m-1h").2X("11-1m-1h-1S")};u.4M=16(){12 t=e(s).18(".11-1S").13("6u")?1c(e(s).18(".11-1S").13("6u")):u.o.7F;10(!u.o.4r&&!e(s).18(".11-1S").13("6u")){12 n=e(s).18(".11-1Q:3G("+(u.o.2g-1)+")").13("6u");t=n?n:u.o.7F}3a(u.g.3T);10(u.g.3F){10(!u.g.49){u.g.49=(3m 4H).4E()}10(u.g.49>u.g.3F){u.g.3F=(3m 4H).4E()}10(!u.g.2P){u.g.2P=t}u.g.2P-=u.g.3F-u.g.49;u.g.3F=1e;u.g.49=(3m 4H).4E()}19{u.g.2P=t;u.g.49=(3m 4H).4E()}u.g.2P=1c(u.g.2P);u.g.3T=2Z.2i(16(){u.g.49=u.g.3F=u.g.2P=1e;u.23()},u.g.2P);10(u.g.3K){u.g.3K.20({1b:u.g.1D()},u.g.2P,"61",16(){e(14).17({1b:0})})}10(u.g.2R){12 r=u.g.2R.18(".11-ct-1I .11-ct-3t");12 i=u.g.2R.18(".11-ct-1i .11-ct-3t");10(u.g.2R.17("1y")=="1F"){r.17({1L:0});i.17({1L:0});u.g.2R.2x(d5)}12 o=16(){i.20({1L:62},t/2,"61")};12 a=r;12 f=u.g.2P-t/2;10(u.g.2P<t/2){a=i;f=u.g.2P;o=16(){}}a.1h(1a,1a).20({1L:62},f,"61",16(){o()})}};u.1h=16(){u.g.3F=(3m 4H).4E();10(u.g.3K){u.g.3K.1h()}10(u.g.2R){u.g.2R.18(".11-ct-3t").1h()}10(!u.g.3q&&!u.g.2V){e(s).18(".11-1m-1h").1t("11-1m-1h-1S");e(s).18(".11-1m-23").2X("11-1m-23-1S")}3a(u.g.3T);u.g.2G=1e};u.8D=16(){e(s).18("*").1h(1a,1e).7p();10(!u.g.3q&&!u.g.2V){e(s).18(".11-1m-1h").1t("11-1m-1h-1S");e(s).18(".11-1m-23").2X("11-1m-23-1S")}3a(u.g.3T);u.g.2G=1e};u.cT=16(){e(s).18("*").1h();3a(u.g.3T);u.4k(u.g.2a,u.g.2c)};u.8F=16(t){10(e.54(t.3b())=="cU"||e.54(t.3b())=="61"){1P t.3b()}19{1P t.2j("cR","cO").2j("cP","cQ").2j("cV","cW").2j("d2","d3").2j("d1","d0").2j("cX","cY").2j("bC","dm").2j("dl","dK").2j("dL","dI").2j("dF","dG").2j("dH","dM").2j("56","dN").2j("dS","dT")}};u.1O=16(e){10(u.g.2a<2){u.g.47+=1}10(u.g.47>u.o.3Y&&u.o.3Y>0&&!e){u.g.47=0;u.1h();10(u.o.5U==1e){u.o.3Y=0}}19{12 t=u.g.2a<2?u.g.2E:u.g.2a-1;u.g.2c="1O";u.4k(t,u.g.2c)}};u.1R=16(e){10(!u.o.5S){10(!(u.g.2a<u.g.2E)){u.g.47+=1}10(u.g.47>u.o.3Y&&u.o.3Y>0&&!e){u.g.47=0;u.1h();10(u.o.5U==1e){u.o.3Y=0}}19{12 t=u.g.2a<u.g.2E?u.g.2a+1:1;u.g.2c="1R";u.4k(t,u.g.2c)}}19 10(!e){12 t=u.g.2a;12 n=16(){t=1x.29(1x.2t()*u.g.2E)+1;10(t==u.g.2a){n()}19{u.g.2c="1R";u.4k(t,u.g.2c)}};n()}19 10(e){12 t=u.g.2a<u.g.2E?u.g.2a+1:1;u.g.2c="1R";u.4k(t,u.g.2c)}};u.4k=16(t,n){u.g.49=u.g.3F=u.g.2P=1e;10(u.g.3K){u.g.3K.1h().1C(2n).20({1b:0},8U)}10(u.g.2R){u.g.2R.1C(2n).2U(3I).18(".11-ct-3t").1h().1C(2n).20({1L:0},8U)}10(u.g.52==1a){u.g.52=1e;u.g.2G=u.g.2V;u.g.1H.18(\'2e[1l*="5c.4u"], 2e[1l*="5d.4v"]\').1X(16(){e(14).2s().18(".11-5g").2x(u.g.v.83,16(){e(14).2s().18("2e").1f("1l","")})})}e(s).18(\'2e[1l*="5c.4u"], 2e[1l*="5d.4v"]\').1X(16(){3a(e(14).13("5D"))});3a(u.g.3T);u.g.5x=t;u.g.1v=e(s).18(".11-1Q:3G("+(u.g.5x-1)+")");10(!n){10(u.g.2a<u.g.5x){u.g.2c="1R"}19{u.g.2c="1O"}}12 r=0;10(e(s).18(\'2e[1l*="5c.4u"], 2e[1l*="5d.4v"]\').1o>0){r=u.g.v.83}3a(u.g.7n);u.g.7n=2i(16(){12 e=16(){10(u.g.3X){2i(16(){e()},3I)}19{u.59(u.g.1v,16(){u.20()})}};e()},r)};u.59=16(t,n){u.g.3C=1a;10(u.g.8W){e(s).17({21:"2A"})}10(u.o.59){12 r=[];12 i=0;10(t.17("48-4w")!="1F"&&t.17("48-4w").1w("4P")!=-1){12 o=t.17("48-4w");o=o.3s(/4P\\((.*)\\)/)[1].2j(/"/91,"");r.4y(o)}t.18("22").1X(16(){r.4y(e(14).1f("1l"))});t.18("*").1X(16(){10(e(14).17("48-4w")!="1F"&&e(14).17("48-4w").1w("4P")!=-1){12 t=e(14).17("48-4w");t=t.3s(/4P\\((.*)\\)/)[1].2j(/"/91,"");r.4y(t)}});10(r.1o==0){e(".11-1z-2J, .11-1m-1R, .11-1m-1O, .11-1s-1m-2J").17({21:"2A"});u.3L(t,n)}19{10(u.g.1N){u.g.3f.17("1y","2b")}19{u.g.3f.1C(dw).2x(2n)}2u(x=0;x<r.1o;x++){e("<22>").2Q(16(){10(++i==r.1o){u.g.3f.1h(1a,1a).17({1y:"1F"});e(".11-1z-2J, .11-1m-1R, .11-1m-1O, .11-1s-1m-2J").17({21:"2A"});u.3L(t,n)}}).1f("1l",r[x])}}}19{e(".11-1z-2J, .11-1m-1R, .11-1m-1O, .11-1s-1m-2J").17({21:"2A"});u.3L(t,n)}};u.3L=16(t,n){t.17({21:"2O",1y:"2b"});10(u.g.67){u.g.67()}u.7h();10(u.o.32=="4j"){u.8g()}t.30().1X(16(){12 t=e(14);12 n=t.13("4a")?t.13("4a"):"0";12 r=t.13("3P")?t.13("3P"):"0";10(t.41("a")&&t.30().1o>0){t.17({1y:"2b"});t=t.30()}12 i="1U";12 s="1U";10(t.13("31")){10(28 t.13("31")=="3M"){i=1c(t.13("31"))*u.g.1B}19 10(t.13("31").1w("%")!=-1){i=t.13("31")}}10(t.13("33")){10(28 t.13("33")=="3M"){s=1c(t.13("33"))*u.g.1B}19 10(t.13("33").1w("%")!=-1){s=t.13("33")}}12 o=t.13("77")?1c(t.13("77"))*u.g.1B:0;12 a=t.13("74")?1c(t.13("74"))*u.g.1B:0;12 f=t.13("71")?1c(t.13("71"))*u.g.1B:0;12 l=t.13("72")?1c(t.13("72"))*u.g.1B:0;12 c=t.13("6y")?1c(t.13("6y"))*u.g.1B:0;12 h=t.13("6C")?1c(t.13("6C"))*u.g.1B:0;12 p=t.13("5N")?1c(t.13("5N"))*u.g.1B:0;12 d=t.13("65")?1c(t.13("65"))*u.g.1B:0;12 v=t.13("8e");12 m=t.13("8a");10(u.g.3x||u.o.4h>0){10(t.41("22")&&!t.43("11-bg")){t.17({1b:"1U",1d:"1U"});10((i==0||i=="1U")&&28 s=="3M"&&s!=0){i=s/t.1d()*t.1b()}10((s==0||s=="1U")&&28 i=="3M"&&i!=0){s=i/t.1b()*t.1d()}10(i=="1U"){i=t.1b()*u.g.1B}10(s=="1U"){s=t.1d()*u.g.1B}t.17({1b:i,1d:s})}10(!t.41("22")){t.17({1b:i,1d:s,"8c-88":1c(v)*u.g.1B+"1A","89-1d":1c(m)*u.g.1B+"1A"})}10(t.41("1g")&&t.18("2e").13("4m")){12 g=t.18("2e");g.1f("1b",1c(g.13("31"))*u.g.1B).1f("1d",1c(g.13("33"))*u.g.1B);t.17({1b:1c(g.13("31"))*u.g.1B,1d:1c(g.13("33"))*u.g.1B})}t.17({26:f+"1A "+a+"1A "+l+"1A "+o+"1A ",8x:c+"1A",8s:h+"1A",8h:p+"1A",8t:d+"1A"})}10(!t.43("11-bg")){12 y=t;10(t.2s().41("a")){t=t.2s()}12 b=u.o.7N>0?(u.g.1D()-u.o.7N)/2:0;b=b<0?0:b;10(n.1w("%")!=-1){t.17({1i:u.g.1D()/1Z*1c(n)-y.1b()/2-o-c})}19 10(b>0||u.g.3x||u.o.4h>0){t.17({1i:b+1c(n)*u.g.1B})}10(r.1w("%")!=-1){t.17({1u:u.g.1G()/1Z*1c(r)-y.1d()/2-f-p})}19 10(u.g.3x||u.o.4h>0){t.17({1u:1c(r)*u.g.1B})}}19{t.17({1b:"1U",1d:"1U"});i=t.1b();s=t.1d();12 w=u.g.1B;10(u.g.2C.1w("%")!=-1){10(u.g.1D()>i){w=u.g.1D()/i;10(u.g.1G()>s*w){w=u.g.1G()/s}}19 10(u.g.1G()>s){w=u.g.1G()/s;10(u.g.1D()>i*w){w=u.g.1D()/i}}}t.17({1b:1x.5s(i*w),1d:1x.5s(s*w),2z:-1x.5s(i*w)/2+"1A",2N:-1x.5s(s*w)/2+"1A"})}});t.17({1y:"1F",21:"2A"});u.7i();n();e(14).7p();10(u.g.4o&&u.g.3X){u.g.4o=1e;u.g.4J=1e;u.g.53=1e;u.g.3X=1e}};u.7i=16(){10(u.g.4p){12 e=16(){10(u.g.4p.1d()>0){10(u.g.8u>0){u.g.3y.17({1d:u.g.4p.1d()/2})}19{u.g.3y.17({1d:u.g.4p.1d(),2N:-u.g.4p.1d()/2})}}19{2i(16(){e()},50)}};e()}};u.7h=16(){10(u.o.4h>0){10(e(2Z).1b()<u.o.4h){u.g.3x=1a;u.g.2C=u.o.4h+"1A"}19{u.g.3x=1e;u.g.2C=u.g.6L;u.g.1B=1}}10(u.g.3x){12 t=e(s).2s();10(u.g.53&&u.g.3X){e(s).17({1b:u.g.4o});u.g.1B=u.g.53;e(s).17({1d:u.g.4J})}19{e(s).17({1b:t.1b()-1c(e(s).17("26-1i"))-1c(e(s).17("26-1I"))});u.g.1B=e(s).1b()/1c(u.g.2C);e(s).17({1d:u.g.1B*1c(u.g.3W)})}}19{u.g.1B=1;e(s).17({1b:u.g.2C,1d:u.g.3W})}10(e(s).5y(".11-5o-5q-2h").1o){e(s).5y(".11-5o-5q-8k").17({1d:e(s).5l(1a)});e(s).5y(".11-5o-5q-2h").17({1d:e(s).5l(1a)});e(s).5y(".11-5o-5q-8k").17({1b:e(2Z).1b(),1i:-e(s).5y(".11-5o-5q-2h").8o().1i});10(u.g.2C.1w("%")!=-1){12 n=1c(u.g.2C);12 r=e("3l").1b()/1Z*n-(e(s).4S()-e(s).1b());e(s).1b(r)}}e(s).18(".11-27, .11-7j-2h").17({1b:u.g.1D(),1d:u.g.1G()});10(u.g.1H&&u.g.1v){u.g.1H.17({1b:u.g.1D(),1d:u.g.1G()});u.g.1v.17({1b:u.g.1D(),1d:u.g.1G()})}19{e(s).18(".11-1Q").17({1b:u.g.1D(),1d:u.g.1G()})}};u.6M=16(){u.g.1p.17({1b:u.g.1p.13("31")*u.g.1B,1d:u.g.1p.13("33")*u.g.1B});10(u.g.1N){u.g.1p.17("1y","2b")}19{u.g.1p.2x(2n)}12 t=6x=6q=5z="1U";10(u.g.1p.13("4a")&&u.g.1p.13("4a").1w("%")!=-1){t=u.g.1D()/1Z*1c(u.g.1p.13("4a"))-u.g.1p.1b()/2+1c(e(s).17("26-1i"))}19{t=1c(u.g.1p.13("4a"))*u.g.1B}10(u.g.1p.13("4X")&&u.g.1p.13("4X").1w("%")!=-1){6x=u.g.1D()/1Z*1c(u.g.1p.13("4X"))-u.g.1p.1b()/2+1c(e(s).17("26-1I"))}19{6x=1c(u.g.1p.13("4X"))*u.g.1B}10(u.g.1p.13("3P")&&u.g.1p.13("3P").1w("%")!=-1){6q=u.g.1G()/1Z*1c(u.g.1p.13("3P"))-u.g.1p.1d()/2+1c(e(s).17("26-1u"))}19{6q=1c(u.g.1p.13("3P"))*u.g.1B}10(u.g.1p.13("5p")&&u.g.1p.13("5p").1w("%")!=-1){5z=u.g.1G()/1Z*1c(u.g.1p.13("5p"))-u.g.1p.1d()/2+1c(e(s).17("26-1s"))}19{5z=1c(u.g.1p.13("5p"))*u.g.1B}u.g.1p.17({1i:t,1I:6x,1u:6q,1s:5z})};u.8g=16(){u.7o("5r");12 t=u.g.2C.1w("%")==-1?1c(u.g.2C):u.g.1D();e(s).18(".11-1z-1K a").17({1b:1c(u.o.7H*u.g.1B),1d:1c(u.o.5m*u.g.1B)});e(s).18(".11-1z-1K a:42").17({2T:0});e(s).18(".11-1z-1K").17({1d:1c(u.o.5m*u.g.1B)});12 n=e(s).18(".11-1z");12 r=u.o.5C.1w("%")==-1?1c(u.o.5C):1c(t/1Z*1c(u.o.5C));n.17({1b:r*1x.29(u.g.1B*1Z)/1Z});10(n.1b()>e(s).18(".11-1z-1K").1b()){n.17({1b:e(s).18(".11-1z-1K").1b()})}u.7o("9W")};u.7l=16(t){12 n=t?t:u.g.5x;e(s).18(".11-1z-1K a:8b(.11-3v-"+n+")").30().1X(16(){e(14).2X("11-3v-1S").1h().5V(7Q,u.o.7v/1Z)});e(s).18(".11-1z-1K a.11-3v-"+n).30().1t("11-3v-1S").1h().5V(7Q,u.o.7w/1Z)};u.79=16(){10(!e(s).18(".11-1z-1K-2h").43("11-1z-1K-1M")){12 t=e(s).18(".11-3v-1S").1o?e(s).18(".11-3v-1S").2s():1e;10(t){12 n=t.3i().1i+t.1b()/2;12 r=e(s).18(".11-1z-1K-2h").1b()/2-n;r=r<e(s).18(".11-1z-1K-2h").1b()-e(s).18(".11-1z-1K").1b()?e(s).18(".11-1z-1K-2h").1b()-e(s).18(".11-1z-1K").1b():r;r=r>0?0:r;e(s).18(".11-1z-1K").20({2z:r},7T,"5Z")}}};u.7o=16(t){10(u.o.6c&&!e(s).43("11-1M")){2I(t){1j"5r":u.g.3B.17({21:"2O",1y:"2b"});1k;1j"9W":u.g.3B.17({21:"2A",1y:"1F"});1k}}};u.20=16(){10(e(s).18(".11-1Q").1o>1){u.g.2Y=1a}u.g.3C=1e;3a(u.g.3T);3a(u.g.7n);u.g.ab=u.g.1H;u.o.9U(u.g);10(u.o.32=="4j"){u.7l();10(!("64"3p 2Z)){u.79()}}u.g.1v.1t("11-9P");12 t=6Y=6n=6W=6d=76=6e=75=6v=bD=6z=bE="1U";12 o=6S=u.g.1D();12 a=6U=u.g.1G();12 f=u.g.2c=="1O"?u.g.1H:u.g.1v;12 l=f.13("3n")?f.13("3n"):u.o.7P;12 c=u.g.7t[u.g.2c][l];10(c=="1i"||c=="1I"){o=6n=6S=6e=0;6z=0}10(c=="1u"||c=="1s"){a=t=6U=6d=0;6v=0}2I(c){1j"1i":6Y=6d=0;6v=-u.g.1D();1k;1j"1I":t=76=0;6v=u.g.1D();1k;1j"1u":6W=6e=0;6z=-u.g.1G();1k;1j"1s":6n=75=0;6z=u.g.1G();1k}u.g.1H.17({1i:t,1I:6Y,1u:6n,1s:6W});u.g.1v.17({1b:6S,1d:6U,1i:6d,1I:76,1u:6e,1s:75});12 h=u.g.1H.13("6j")?1c(u.g.1H.13("6j")):u.o.7Y;12 p=u.g.1H.13("4C")?1c(u.g.1H.13("4C")):u.o.5A;12 d=u.g.1H.13("4z")?u.g.1H.13("4z"):u.o.5H;12 v=u.g.1v.13("4Q")?1c(u.g.1v.13("4Q")):u.o.87;12 m=u.g.1v.13("6h")?1c(u.g.1v.13("6h")):u.o.7s;12 g=u.g.1v.13("6i")?u.g.1v.13("6i"):u.o.7A;12 y=16(){u.g.1H.1C(h+p/15).20({1b:o,1d:a},p,d,16(){b()})};12 b=16(){u.g.ab.18(\' > *[1n*="11-s"]\').1h(1a,1a);u.o.7O(u.g);u.g.1H=u.g.1v;u.g.2a=u.g.5x;e(s).18(".11-1Q").2X("11-1S");e(s).18(".11-1Q:3G("+(u.g.2a-1)+")").1t("11-1S").2X("11-9P");e(s).18(".11-1s-4f a").2X("11-1m-1S");e(s).18(".11-1s-4f a:3G("+(u.g.2a-1)+")").1t("11-1m-1S");10(u.g.2G){u.4M()}u.g.2Y=1e;10(u.g.3g==1a){u.3L(u.g.1H,16(){u.g.3g=1e})}};12 w=16(t){u.g.1H.18(\' > *[1n*="11-s"]\').1X(16(){12 n=e(14).13("3n")?e(14).13("3n"):c;12 r,i;2I(n){1j"1i":r=-u.g.1D();i=0;1k;1j"1I":r=u.g.1D();i=0;1k;1j"1u":i=-u.g.1G();r=0;1k;1j"1s":i=u.g.1G();r=0;1k}12 s=e(14).13("6r")?e(14).13("6r"):1e;2I(s){1j"1i":r=u.g.1D();i=0;1k;1j"1I":r=-u.g.1D();i=0;1k;1j"1u":i=u.g.1G();r=0;1k;1j"1s":i=-u.g.1G();r=0;1k}12 o=1c(e(14).1f("1n").1Y("11-s")[1]);10(o==-1){12 a=1c(e(14).17("1i"));12 f=1c(e(14).17("1u"));10(i<0){i=-(u.g.1G()-f+1)}19 10(i>0){i=f+e(14).5l()+1}10(r<0){r=-(u.g.1D()-a+1)}19 10(r>0){r=a+e(14).4S()+1}12 l=1}19{12 h=u.g.1H.13("6p")?1c(u.g.1H.13("6p")):u.o.7J;12 l=o*h}12 p=e(14).13("6j")?1c(e(14).13("6j")):u.o.7Y;12 d=e(14).13("4C")?1c(e(14).13("4C")):u.o.5A;12 v=e(14).13("4z")?e(14).13("4z"):u.o.5H;10(t){p=0;d=t}12 m="1F";10(!u.g.1N&&u.g.4i){m=e(14).13("69")?e(14).13("69"):0}12 g="1F";10(!u.g.1N&&u.g.4i){g=e(14).13("68")?e(14).13("68"):1}10(e(14).13("66")){3a(e(14).13("66"))}10(s=="4c"||!s&&n=="4c"){10(!u.g.1N){e(14).1h(1a,1e).1C(p).20({2B:0,1L:m,1W:g},d,v,16(){e(14).17({21:"2O",2B:e(14).13("6l")})})}19{e(14).1h(1a,1a).1C(p).2U(d,v,16(){e(14).17({21:"2O",1y:"2b"})})}}19{e(14).1h(1a,1e).1C(p).20({1L:m,1W:g,2z:-r*l,2N:-i*l},d,v)}})};12 E=16(){u.g.1v.1C(h+v).20({1b:u.g.1D(),1d:u.g.1G()},m,g)};12 S=16(){10(u.g.3o){h=0}u.g.1v.18(\' > *[1n*="11-s"]\').1X(16(){12 t=e(14).13("3n")?e(14).13("3n"):c;12 n,r;2I(t){1j"1i":n=-u.g.1D();r=0;1k;1j"1I":n=u.g.1D();r=0;1k;1j"1u":r=-u.g.1G();n=0;1k;1j"1s":r=u.g.1G();n=0;1k;1j"4c":r=0;n=0;1k}12 i=1c(e(14).1f("1n").1Y("11-s")[1]);10(i==-1){12 s=1c(e(14).17("1i"));12 o=1c(e(14).17("1u"));10(r<0){r=-(o+e(14).5l()+1)}19 10(r>0){r=u.g.1G()-o+1}10(n<0){n=-(s+e(14).4S()+1)}19 10(n>0){n=u.g.1D()-s+1}12 a=1}19{12 f=u.g.1v.13("9r")?1c(u.g.1v.13("9r")):u.o.9v;12 a=i*f}12 l=e(14).13("4Q")?1c(e(14).13("4Q")):u.o.87;12 p=e(14).13("6h")?1c(e(14).13("6h")):u.o.7s;12 d=e(14).13("6i")?e(14).13("6i"):u.o.7A;12 m=e(14);12 g=16(){10(u.o.7R==1a){m.18(".11-3U").2k()}10(m.13("6m")>0){m.13("66",2i(16(){u.7K(m)},m.13("6m")))}};12 y="1F";10(!u.g.1N&&u.g.4i){y=e(14).13("9t")?e(14).13("9t"):0}12 b="1F";10(!u.g.1N&&u.g.4i){b=e(14).13("9g")?e(14).13("9g"):1}10(t=="4c"){10(!u.g.1N){e(14).17({1V:"1L("+y+"1E) 1W("+b+")","-4R-1V":"1L("+y+"1E) 1W("+b+")","-3E-1V":"1L("+y+"1E) 1W("+b+")","-o-1V":"1L("+y+"1E) 1W("+b+")","-4U-1V":"1L("+y+"1E) 1W("+b+")",2B:0,21:"2A",2z:0,2N:0}).1h().1C(h+v+l).20({1W:1,1L:0,2B:e(14).13("6l")},p,d,16(){g()})}19{e(14).17({1y:"1F",21:"2A",2z:0,2N:0}).1h(1a,1a).1C(h+v+l).2x(p,d,16(){g()})}}19{10(!u.g.1N){e(14).17({2B:e(14).13("6l")})}e(14).17({1V:"1L("+y+"1E) 1W("+b+")","-4R-1V":"1L("+y+"1E) 1W("+b+")","-3E-1V":"1L("+y+"1E) 1W("+b+")","-o-1V":"1L("+y+"1E) 1W("+b+")","-4U-1V":"1L("+y+"1E) 1W("+b+")",2z:n*a,2N:r*a,1y:"2b",21:"2A"});e(14).1h().1C(h+v+l).20({2z:0,2N:0,1W:1,1L:0},p,d,16(){g()})}})};12 x=16(){10(n(e(s))&&28 e.80!="3c"&&(u.g.1v.13("4q")||u.g.1v.13("5i"))){10(u.g.1v.13("4q")&&u.g.1v.13("5i")){12 t=1x.29(1x.2t()*2);12 r=[["3d",u.g.1v.13("4q")],["9i",u.g.1v.13("5i")]];N(r[t][0],r[t][1])}19 10(u.g.1v.13("4q")){N("3d",u.g.1v.13("4q"))}19{N("9i",u.g.1v.13("5i"))}}19{10(u.g.1v.13("5h")&&u.g.1v.13("5j")){12 t=1x.29(1x.2t()*2);12 r=[["2d",u.g.1v.13("5h")],["9l",u.g.1v.13("5j")]];N(r[t][0],r[t][1])}19 10(u.g.1v.13("5h")){N("2d",u.g.1v.13("5h"))}19 10(u.g.1v.13("5j")){N("9l",u.g.1v.13("5j"))}19{N("2d","6A")}}};12 T=16(){10(n(e(s))&&4N.1w("3d")!=-1){N("3d",4N.1Y(":")[1])}19{10(4N.1w("3d")!=-1){N("2d","6A")}19{N("2d",4N.1Y(":")[1])}}};12 N=16(e,t){12 n=e.1w("cw")==-1?u.t:u.ct;12 r="3d",s,o;10(e.1w("2d")!=-1){r="2d"}10(t.1w("42")!=-1){o=n["t"+r].1o-1;s="42"}19 10(t.1w("6A")!=-1){o=1x.29(1x.2t()*i(n["t"+r]));s="2t 4Y 6A"}19{12 a=t.1Y(",");12 f=a.1o;o=1c(a[1x.29(1x.2t()*f)])-1;s="2t 4Y cx"}C(r,n["t"+r][o])};12 C=16(t,n){12 i=e(s).18(".11-27");12 o=u.g.1H.18(\'*[1n*="11-s"]\').1o>0?3S:0;12 a=n.86.3b().1w("cy")==-1?1e:1a;12 f=28 n.4O=="3M"?n.4O:1x.29(1x.2t()*(n.4O[1]-n.4O[0]+1))+n.4O[0];12 l=28 n.4T=="3M"?n.4T:1x.29(1x.2t()*(n.4T[1]-n.4T[0]+1))+n.4T[0];10(u.g.7L()==1a&&u.o.8l==1a||u.g.1N&&u.o.8i==1a){10(f>=15){f=7}19 10(f>=5){f=4}19 10(f>=4){f=3}19 10(f>2){f=2}10(l>=15){l=7}19 10(l>=5){l=4}19 10(l>=4){l=3}19 10(l>2){l=2}10(l>2&&f>2){l=2;10(f>4){f=4}}}12 c=e(s).18(".11-27").1b()/f;12 h=e(s).18(".11-27").1d()/l;10(!u.g.2w){u.g.2w=e("<1g>").1t("11-7j-2h").1t("11-3V-2O").17({1b:i.1b(),1d:i.1d()}).5G(i)}19{u.g.2w.5e().17({1b:i.1b(),1d:i.1d()})}12 p=i.1b()-1x.29(c)*f;12 d=i.1d()-1x.29(h)*l;12 v=[];v.9y=16(){12 e=14.1o,t,n,r;10(e==0)1P 1e;8Z(--e){t=1x.29(1x.2t()*(e+1));n=14[e];r=14[t];14[e]=r;14[t]=n}1P 14};2u(12 m=0;m<f*l;m++){v.4y(m)}2I(n.3H.cE){1j"5M":v.5M();1k;1j"9z-7D":v=r(l,f,"7D");1k;1j"9z-5M":v=r(l,f,"5M");1k;1j"2t":v.9y();1k}12 g=u.g.1H.18(".11-bg");12 y=u.g.1v.18(".11-bg");10(g.1o==0&&y.1o==0){t="2d";n=e.4I(1a,{},u.t["cK"][0]);n.1r.2l=1;n.3H.1C=0}10(t=="3d"){u.g.3o=o+(f*l-1)*n.3H.1C;12 E=0;10(n.2K&&n.2K.2l){E+=n.2K.2l}10(n.24&&n.24.2l){E+=n.24.2l}10(n.3r&&n.3r.2l){E+=n.3r.2l}u.g.3o+=E;12 x=0;10(n.2K&&n.2K.1C){x+=n.2K.1C}10(n.24&&n.24.1C){x+=n.24.1C}10(n.3r&&n.3r.1C){x+=n.3r.1C}u.g.3o+=x}19{u.g.3o=o+(f*l-1)*n.3H.1C+n.1r.2l;u.g.4s=e("<1g>").1t("11-cL").1q(u.g.2w);u.g.7V=e("<1g>").1t("11-cJ").1q(u.g.2w)}12 T=u.g.2c;2u(12 N=0;N<f*l;N++){12 C=N%f==0?p:0;12 k=N>(l-1)*f-1?d:0;12 L=e("<1g>").1t("11-7j-3H").17({1b:1x.29(c)+C,1d:1x.29(h)+k}).1q(u.g.2w);12 A,O;10(t=="3d"){L.1t("11-3d-2h");12 M=1x.29(c)+C;12 3D=1x.29(h)+k;12 D;10(n.24.57=="a3"){10(1x.40(n.24.1r.2q)>90&&n.3H.9C!="9G"){D=1x.29(M/7)+C}19{D=M}}19{10(1x.40(n.24.1r.2m)>90&&n.3H.9C!="9G"){D=1x.29(3D/7)+k}19{D=3D}}12 P=M/2;12 H=3D/2;12 B=D/2;12 j=16(t,n,r,i,s,o,u,a,f){e("<1g>").1t(t).17({1b:r,1d:i,1V:"5f("+s+"1A, "+o+"1A, "+u+"1A) 2m("+a+"1E) 2q("+f+"1E) 4Z(5b) 4K(1, 1, 1)","-o-1V":"5f("+s+"1A, "+o+"1A, "+u+"1A) 2m("+a+"1E) 2q("+f+"1E) 4Z(5b) 4K(1, 1, 1)","-4R-1V":"5f("+s+"1A, "+o+"1A, "+u+"1A) 2m("+a+"1E) 2q("+f+"1E) 4Z(5b) 4K(1, 1, 1)","-4U-1V":"5f("+s+"1A, "+o+"1A, "+u+"1A) 2m("+a+"1E) 2q("+f+"1E) 4Z(5b) 4K(1, 1, 1)","-3E-1V":"5f("+s+"1A, "+o+"1A, "+u+"1A) 2m("+a+"1E) 2q("+f+"1E) 4Z(5b) 4K(1, 1, 1)"}).1q(n)};j("11-3d-3J",L,0,0,0,0,-B,0,0);12 F=0;12 I=0;12 q=0;10(n.24.57=="ci"&&1x.40(n.24.1r.2m)>90){j("11-3d-56",L.18(".11-3d-3J"),M,3D,-P,-H,-B,62,0)}19{j("11-3d-56",L.18(".11-3d-3J"),M,3D,-P,-H,-B,0,62)}j("11-3d-1s",L.18(".11-3d-3J"),M,D,-P,H-B,0,-90,0);j("11-3d-1u",L.18(".11-3d-3J"),M,D,-P,-H-B,0,90,0);j("11-3d-9p",L.18(".11-3d-3J"),M,3D,-P,-H,B,0,0);j("11-3d-1i",L.18(".11-3d-3J"),D,3D,-P-B,-H,0,0,-90);j("11-3d-1I",L.18(".11-3d-3J"),D,3D,P-B,-H,0,0,90);A=L.18(".11-3d-9p");10(n.24.57=="a3"){10(1x.40(n.24.1r.2q)>90){O=L.18(".11-3d-56")}19{O=L.18(".11-3d-1i, .11-3d-1I")}}19{10(1x.40(n.24.1r.2m)>90){O=L.18(".11-3d-56")}19{O=L.18(".11-3d-1u, .11-3d-1s")}}12 R=o+v[N]*n.3H.1C;12 U=u.g.2w.18(".11-3d-2h:3G("+N+") .11-3d-3J");10(n.2K&&n.2K.1r){n.2K.1r.1C=n.2K.1r.1C?n.2K.1r.1C+R:R;U.1r(n.2K.1r,n.2K.2l,n.2K.3N)}19{n.24.1r.1C=n.24.1r.1C?n.24.1r.1C+R:R}U.1r(n.24.1r,n.24.2l,n.24.3N);10(n.3r){U.1r(e.4I({},{4K:1},n.3r.1r),n.3r.2l,n.3r.3N)}}19{12 z=2L=2y=2D="1U";12 W=51=1;10(n.1r.57=="2t"){12 X=["1u","1s","1I","1i"];12 V=X[1x.29(1x.2t()*X.1o)]}19{12 V=n.1r.57}10(n.86.3b().1w("9o")!=-1&&N%2==0){10(T=="1O"){T="1R"}19{T="1O"}}10(T=="1O"){2I(V){1j"1u":V="1s";1k;1j"1s":V="1u";1k;1j"1i":V="1I";1k;1j"1I":V="1i";1k;1j"6G":V="6F";1k;1j"6H":V="7r";1k;1j"7r":V="6H";1k;1j"6F":V="6G";1k}}2I(V){1j"1u":z=2y=-L.1d();2L=2D=0;1k;1j"1s":z=2y=L.1d();2L=2D=0;1k;1j"1i":z=2y=0;2L=2D=-L.1b();1k;1j"1I":z=2y=0;2L=2D=L.1b();1k;1j"6G":z=L.1d();2y=0;2L=L.1b();2D=0;1k;1j"6H":z=L.1d();2y=0;2L=-L.1b();2D=0;1k;1j"7r":z=-L.1d();2y=0;2L=L.1b();2D=0;1k;1j"6F":z=-L.1d();2y=0;2L=-L.1b();2D=0;1k}u.g.2r=n.1r.aa?n.1r.aa:1;10(a==1a&&u.g.2r!=1){z=z/2;2y=2y/2;2L=2L/2;2D=2D/2}2I(n.1r.4d){1j"4c":z=2y=2L=2D=0;W=0;51=1;1k;1j"co":W=0;51=1;10(u.g.2r==1){2y=2D=0}1k}10((n.1r.3t||n.1r.2m||n.1r.2q||u.g.2r!=1)&&!u.g.1N&&n.1r.4d!="1K"){L.17({3V:"2A"})}19{L.17({3V:"2O"})}10(a==1a){u.g.4s.17({3V:"2A"})}19{u.g.4s.17({3V:"2O"})}10(n.1r.4d=="1K"||a==1a){12 J=L.1q(u.g.4s);12 K=L.81().1q(u.g.7V);A=e("<1g>").1t("11-cm").1q(J)}19{12 K=L.1q(u.g.7V)}O=e("<1g>").1t("11-cq").1q(K).17({1u:-z,1i:-2L,ck:"2b",2B:W});12 Q=o+v[N]*n.3H.1C;10(u.g.8E&&28 e.80!="3c"){12 G=n.1r.3t?n.1r.3t:0;12 Y=n.1r.2m?n.1r.2m:0;12 Z=n.1r.2q?n.1r.2q:0;10(T=="1O"){G=-G;Y=-Y;Z=-Z}10(Y!=0||Z!=0||G!=0||u.g.2r!=1){O.17({1V:"1L("+G+"1E) 2m("+Y+"1E) 2q("+Z+"1E) 1W("+u.g.2r+","+u.g.2r+")","-o-1V":"1L("+G+"1E) 2m("+Y+"1E) 2q("+Z+"1E) 1W("+u.g.2r+","+u.g.2r+")","-4R-1V":"1L("+G+"1E) 2m("+Y+"1E) 2q("+Z+"1E) 1W("+u.g.2r+","+u.g.2r+")","-4U-1V":"1L("+G+"1E) 2m("+Y+"1E) 2q("+Z+"1E) 1W("+u.g.2r+","+u.g.2r+")","-3E-1V":"1L("+G+"1E) 2m("+Y+"1E) 2q("+Z+"1E) 1W("+u.g.2r+","+u.g.2r+")"})}O.1r({1C:Q,1u:0,1i:0,2B:51,1L:0,2m:0,2q:0,1W:1},n.1r.2l,n.1r.3N);10((n.1r.4d=="1K"||a==1a)&&n.86.3b().1w("9o")==-1){12 84=0;10(G!=0){84=-G}A.1r({1C:Q,1u:2y,1i:2D,1L:84,1W:u.g.2r,2B:W},n.1r.2l,n.1r.3N)}}19{O.1C(Q).20({1u:0,1i:0,2B:51},n.1r.2l,n.1r.3N);10(n.1r.4d=="1K"){A.1C(Q).20({1u:2y,1i:2D},n.1r.2l,n.1r.3N)}}}10(g.1o){10(t=="3d"||t=="2d"&&(n.1r.4d=="1K"||a==1a)){A.3z(e("<22>").1f("1l",g.1f("1l")).17({1b:g[0].1J.1b,1d:g[0].1J.1d,2z:i.1b()/2+3Z(g.17("2T-1i"))-1c(L.3i().1i),2N:i.1d()/2+3Z(g.17("2T-1u"))-1c(L.3i().1u)}))}19 10(u.g.4s.30().1o==0){u.g.4s.3z(e("<22>").1f("1l",g.1f("1l")).17({1b:g[0].1J.1b,1d:g[0].1J.1d,2z:i.1b()/2+3Z(g.17("2T-1i")),2N:i.1d()/2+3Z(g.17("2T-1u"))}))}}10(y.1o){O.3z(e("<22>").1f("1l",y.1f("1l")).17({1b:y[0].1J.1b,1d:y[0].1J.1d,2z:i.1b()/2+3Z(y.17("2T-1i"))-1c(L.3i().1i),2N:i.1d()/2+3Z(y.17("2T-1u"))-1c(L.3i().1u)}))}}12 7C=u.g.1H;12 2F=u.g.1v;2F.18(".11-bg").17({21:"2O"});w(o);2i(16(){7C.17({1b:0});u.g.2w.2X("11-3V-2O")},o);12 7B=1c(2F.13("5Y"))?1c(2F.13("5Y")):0;12 7x=u.g.3o+7B>0?u.g.3o+7B:0;2i(16(){10(u.g.3g==1a){u.g.2w.5e();7C.2X("11-1S");u.3L(2F,16(){u.g.3g=1e})}S();10(2F.18(".11-bg").1o<1||2F.18(".11-bg").1o>0&&2F.18(".11-bg").1f("1l").3b().1w("5T")!=-1){u.g.2w.2U(3I,16(){e(14).5e().6k()})}2F.17({1b:u.g.1D(),1d:u.g.1G()})},7x);2i(16(){u.g.2w.1t("11-3V-2O");2F.1t("11-1S");10(2F.18(".11-bg").1o){2F.18(".11-bg").17({1y:"1F",21:"2A"});10(u.g.1N){2F.18(".11-bg").17("1y","2b");2i(16(){b()},3I)}19{2F.18(".11-bg").2x(3I,16(){b()})}}19{b()}},u.g.3o)};7E=(u.g.1v.13("4q")||u.g.1v.13("5h"))&&u.t||(u.g.1v.13("5i")||u.g.1v.13("5j"))&&u.ct?"3m":"5F";10(u.o.4r&&!u.g.9D){10(u.g.2E==1){12 h=0;u.o.7O(u.g)}19{12 k=1c(u.g.1v.13("5Y"))?1c(u.g.1v.13("5Y")):0;12 L=7E=="3m"?0:p;2i(16(){b()},L+1x.40(k))}u.g.3o=1a;S();u.g.1v.17({1b:u.g.1D(),1d:u.g.1G()});10(!u.g.1N){u.g.1v.18(".11-bg").17({1y:"1F"}).2x(3I)}u.g.9D=1a;u.g.3C=1e}19{2I(7E){1j"5F":u.g.3o=1e;10(u.g.2w){u.g.2w.5e()}y();w();E();S();1k;1j"3m":10(28 4N!="3c"){T()}19{x()}1k}}};u.7K=16(e){12 t=u.g.1H;10(u.g.2c!="1O"&&u.g.1v){t=u.g.1v}12 n=t.13("3n")?t.13("3n"):u.o.7P;12 r=u.g.7t[u.g.2c][n];12 i=e.13("3n")?e.13("3n"):r;12 s,o;2I(i){1j"1i":s=-u.g.1D();o=0;1k;1j"1I":s=u.g.1D();o=0;1k;1j"1u":o=-u.g.1G();s=0;1k;1j"1s":o=u.g.1G();s=0;1k}12 a=e.13("6r")?e.13("6r"):1e;2I(a){1j"1i":s=u.g.1D();o=0;1k;1j"1I":s=-u.g.1D();o=0;1k;1j"1u":o=u.g.1G();s=0;1k;1j"1s":o=-u.g.1G();s=0;1k}12 f=1c(e.1f("1n").1Y("11-s")[1]);10(f==-1){12 l=1c(e.17("1i"));12 c=1c(e.17("1u"));10(o<0){o=-(u.g.1G()-c+1)}19 10(o>0){o=c+e.5l()+1}10(s<0){s=-(u.g.1D()-l+1)}19 10(s>0){s=l+e.4S()+1}12 h=1}19{12 p=u.g.1H.13("6p")?1c(u.g.1H.13("6p")):u.o.7J;12 h=f*p}12 d=e.13("4C")?1c(e.13("4C")):u.o.5A;12 v=e.13("4z")?e.13("4z"):u.o.5H;12 m="1F";10(!u.g.1N&&u.g.4i){m=e.13("69")?e.13("69"):0}12 g="1F";10(!u.g.1N&&u.g.4i){g=e.13("68")?e.13("68"):1}10(a=="4c"||!a&&i=="4c"){10(!u.g.1N){e.20({2B:0,1L:m,1W:g},d,v)}19{e.2U(d,v)}}19{e.20({1L:m,1W:g,2z:-s*h,2N:-o*h},d,v)}};u.4G=16(){u.d={3A:e("<1g>"),aT:16(t){e("<9s>"+t+"</9s>").1q(u.d.3A)},9q:16(){e("<4b>").1q(u.d.3A)},aU:16(t){e("<4b><3f>"+t+"</3f></4b>").1q(u.d.3A)},aL:16(t){e("<3f>"+t+"</3f>").1q(u.d.3A.18("4b:42"))},7u:16(t){e("<4b>").1q(u.d.3A.18("4b:42 3f:42"))},aF:16(e){u.d.3A.18("4b:42 3f:42").1M(16(){e.17({3h:"bO bN bM",2N:1c(e.17("2T-1u"))-2,2z:1c(e.17("2T-1i"))-2})},16(){e.17({3h:"9a",2N:1c(e.17("2T-1u"))+2,2z:1c(e.17("2T-1i"))+2})})},6k:16(){10(!e("3l").18(".11-4G-7X").1o){10(!u.d.aj){u.d.aT("bP bQ");u.d.9q();2u(12 t 3p u.o){u.d.aL(t+": <1T>"+u.o[t]+"</1T>")}u.d.aT("3e bS");u.d.aU("bR 36 bL ak: <1T>"+e(s).18(".11-1Q").1o+"</1T>");e(s).18(\'.11-27 .11-1Q, .11-27 *[1n*="11-s"]\').1X(16(){10(e(14).43("11-1Q")){u.d.aU("<1T>ai "+(e(14).5u()+1)+"</1T>");u.d.7u();u.d.aL("<1T>ai "+(e(14).5u()+1)+" 9Z:</1T><br><br>")}19{u.d.aU("    bK ( "+e(14).9T("9S")+" )");u.d.aF(e(14));u.d.7u();u.d.aL("<1T>"+e(14).9T("9S")+" 1Q 9Z:</1T><br><br>");u.d.aL("bH / 1n: <1T>"+e(14).1f("1n")+"</1T>")}e.1X(e(14).13(),16(e,t){u.d.aL(e+": <1T>"+t+"</1T>")})});u.d.aj=1a}12 n=e("<1g>").1t("11-4G-7X").17({3i:"bI",9V:"bT",1u:"4W",1I:"4W",1b:"bU",26:"c6",48:"c5","3h-c4":"4W",1d:e(2Z).1d()-60,2B:0,85:5v}).1q(e("3l")).20({85:0,2B:.9},7T,"5Z").2k(16(t){10(t.8w&&t.8q){e(14).20({85:5v,2B:0},7T,"5Z",16(){e(14).5w()})}});12 r=e("<1g>").17({1b:"1Z%",1d:"1Z%",3V:"1U"}).1q(n);12 i=e("<1g>").17({1b:"1Z%"}).1q(r).3z(u.d.3A)}},c7:16(){e("3l").18(".11-4G-7X").5w()}};e(s).2k(16(e){10(e.8w&&e.8q){u.d.6k()}})};u.2Q()};12 n=16(t){12 n=e("<1g>"),r=1e,i=1e,s=["ca","c9","c3","c2","bX"];1V=["bW","bV","bY","bZ","c1"];2u(12 o=s.1o-1;o>=0;o--){r=r?r:n[0].1J[s[o]]!=3c}2u(12 o=1V.1o-1;o>=0;o--){n.17("1V-1J","8p-3d");i=i?i:n[0].1J[1V[o]]=="8p-3d"}10(r&&n[0].1J[s[4]]!=3c){n.1f("4n","11-cN").1q(t);r=n[0].dJ===3&&n[0].dr===9;n.5w()}1P r&&i};12 r=16(e,t,n){12 r=[];10(n=="7D"){2u(12 i=0;i<e;i++){2u(12 s=0;s<t;s++){r.4y(i+s*e)}}}19{2u(12 i=e-1;i>-1;i--){2u(12 s=t-1;s>-1;s--){r.4y(i+s*e)}}}1P r};12 i=16(e){12 t=0;2u(12 n 3p e){10(e.dU(n)){++t}}1P t};12 s=16(){8f=16(e){e=e.3b();12 t=/(9c)[ \\/]([\\w.]+)/.4L(e)||/(3E)[ \\/]([\\w.]+)/.4L(e)||/(dy)(?:.*2v|)[ \\/]([\\w.]+)/.4L(e)||/(5E) ([\\w.]+)/.4L(e)||e.1w("dx")<0&&/(dz)(?:.*? dA:([\\w.]+)|)/.4L(e)||[];1P{7y:t[1]||"",2v:t[2]||"0"}};12 e=8f(44.46),t={};10(e.7y){t[e.7y]=1a;t.2v=e.2v}10(t.9c){t.3E=1a}19 10(t.3E){t.dC=1a}1P t};4l=16(e,t){12 n=["3E","dB","4U","4R","o",""];12 r=0,i,s;8Z(r<n.1o&&!e[i]){i=t;10(n[r]==""){i=i.8X(0,1).3b()+i.8X(1)}i=n[r]+i;s=28 e[i];10(s!="3c"){n=[n[r]];1P s=="16"?e[i]():e[i]}r++}};t.5J={2v:"4.6.0",7L:16(){10(44.46.3s(/dp/i)||44.46.3s(/dn/i)||44.46.3s(/ds/i)||44.46.3s(/du/i)||44.46.3s(/dD/i)||44.46.3s(/dE/i)||44.46.3s(/dP dO/i)){1P 1a}19{1P 1e}},dR:16(e){10(e.17("26-1s")=="1U"||e.17("26-1s")=="1F"||e.17("26-1s")==0||e.17("26-1s")=="9a"){1P 1a}19{1P 1e}},8E:!s().5E||s().5E&&s().2v>9?1a:1e,1N:s().5E&&s().2v<9?1a:1e,4o:1e,4J:1e,53:1e,3X:1e,3q:1e,52:1e,2G:1e,2Y:1e,2E:5L,2c:"1R",3T:5L,1D:5L,1G:5L,7t:{1O:{1i:"1I",1I:"1i",1u:"1s",1s:"1u"},1R:{1i:"1i",1I:"1I",1u:"1u",1s:"1s"}},v:{d:3I,7z:7Q,83:3I}};t.8Q={6f:1a,2g:1,7Z:1a,8M:1a,59:1a,7S:1a,6t:1a,63:1a,2H:"da",3O:"/5W/cM/",8L:1a,82:"7U",5Q:1e,4r:1a,1p:1e,8N:"1i: -4W; 1u: -4W;",7W:1e,8O:"ax",8C:1a,3Y:0,5U:1a,7R:1a,3Q:"1U",8R:"bc.bd",9b:1a,5S:1e,4h:0,7N:0,32:"1M",7H:1Z,5m:60,5C:"60%",7w:35,7v:1Z,8n:1a,6c:1e,8r:1e,9d:1a,8l:1a,8i:1a,93:1e,9I:16(e){},a7:16(e){},a0:16(e){},a1:16(e){},9U:16(e){},7O:16(e){},5B:16(e){},5K:16(e){},7P:"1I",7F:ba,9v:.45,7J:.45,7s:3S,5A:3S,7A:"9m",5H:"9m",87:0,7Y:0}})(34)',62,863,'||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||if|ls|var|data|this||function|css|find|else|true|width|parseInt|height|false|attr|div|stop|left|case|break|src|nav|class|length|yourLogo|appendTo|transition|bottom|addClass|top|nextLayer|indexOf|Math|display|thumbnail|px|ratio|delay|sliderWidth|deg|none|sliderHeight|curLayer|right|style|slide|kmRotate|hover|ie78|prev|return|layer|next|active|strong|auto|transform|kmScale|each|split|100|animate|visibility|img|start|animation||padding|inner|typeof|floor|curLayerIndex|block|prevNext||iframe|href|firstLayer|container|setTimeout|replace|click|duration|rotateX|300|the|document|rotateY|scale2D|parent|random|for|version|ltContainer|fadeIn|T2|marginLeft|visible|opacity|sliderOriginalWidth|L2|layersNum|nt|autoSlideshow|skin|switch|wrapper|before|L1|layerSlider|marginTop|hidden|curSlideTime|load|circleTimer|bottomWrapper|margin|fadeOut|originalAutoSlideshow|to|removeClass|isAnimating|window|children|originalWidth|thumbnailNavigation|originalHeight|jQuery||of||preventDefault||clearTimeout|toLowerCase|undefined||LayerSlider|li|resize|border|position|param|your|body|new|slidedirection|totalDuration|in|paused|after|match|rotate|autoplay|thumb|loaded|responsiveMode|shadow|append|history|thumbsWrapper|isLoading|_|webkit|pausedSlideTime|eq|tile|500|box|barTimer|makeResponsive|number|easing|skinsPath|originalTop|autoPauseSlideshow|you|1e3|slideTimer|videopreview|overflow|sliderOriginalHeight|goingNormal|loops|parseFloat|abs|is|last|hasClass|navigator||userAgent|nextLoop|background|startSlideTime|originalLeft|ul|fade|type|html|slidebuttons|WordPress|responsiveUnder|enableCSS3|always|change|lsPrefixes|videoSrc|id|normalWidth|shadowImg|transition3d|animateFirstLayer|curTiles|and|youtu|vimeo|image|If|push|easingout|init|thumbnails|durationout|touches|getTime|one|debug|Date|extend|normalHeight|scale3d|exec|timer|LSCustomTransition|cols|url|delayin|ms|outerWidth|rows|moz|or|10px|originalRight|from|rotateZ||O2|pausedByVideo|normalRatio|trim|issue|back|direction|escFullScreen|imgPreload|which|0deg|www|player|empty|translate3d|vpcontainer|transition2d|customtransition3d|customtransition2d|plugin|outerHeight|tnHeight|span|wp|originalBottom|fullwidth|on|round|touchEndX|index|150|remove|nextLayerIndex|closest|oB|durationOut|cbPrev|tnContainerWidth|videoTimer|msie|old|prependTo|easingOut|rel|global|cbNext|null|reverse|originalBorderTop|WP|clicked|globalBGImage|can|randomSlideshow|png|forceLoopNum|fadeTo|layerslider|library|timeshift|easeInOutQuad||linear|180|navButtons|ontouchstart|originalBorderBottom|showUntilTimer|showShadow|scaleout|rotateout|bind|tn|hoverBottomNav|nextLayerLeft|nextLayerTop|autoStart|touchStartX|durationin|easingin|delayout|show|originalOpacity|showuntil|curLayerTop|videoDuration|parallaxout|oT|slideoutdirection|video|navStartStop|slidedelay|layerMarginLeft|link|oR|originalBorderLeft|layerMarginTop|all|fullscreen|originalBorderRight|addEventListener|com|bottomright|topleft|topright|slider|It|solve|sliderOriginalWidthRU|resizeYourLogo|looks|like|section|admin|wpVersion|nextLayerWidth|text|nextLayerHeight|with|curLayerBottom|forceHideControls|curLayerRight|nothumb|cssContainer|originalPaddingTop|originalPaddingBottom|fired|originalPaddingRight|nextLayerBottom|nextLayerRight|originalPaddingLeft|jquery|scrollThumb|script|JS|lswpVersion|plugins|other|250|content|resizeSlider|resizeShadow|lt|linkto|changeThumb|location|changeTimer|bottomNavSizeHelper|dequeue|error|bottomleft|durationIn|slideDirections|aUU|tnInactiveOpacity|tnActiveOpacity|it|browser|fo|easingIn|rt|tt|forward|transitionType|slideDelay|causes|tnWidth|theme|parallaxOut|sublayerShowUntil|isMobile|please|sublayerContainer|cbAnimStop|slideDirection|750|autoPlayVideos|navPrevNext|600|transparent|nextTiles|yourLogoLink|console|delayOut|twoWaySlideshow|transit|clone|globalBGColor|fi|et|marginRight|name|delayIn|size|line|originalLineHeight|not|font|author|originalFontSize|uaMatch|resizeThumb|borderTopWidth|optimizeForIE78|curSkin|helper|optimizeForMobile|copy|hoverPrevNext|offset|preserve|altKey|showBarTimer|borderRightWidth|borderBottomWidth|shadowBtmMod|hash|shiftKey|borderLeftWidth|getJSON|sides|IsFullScreen|FullScreen|touchNav|forcestop|cssTransitions|ieEasing|relative|goFullScreen|extra|clientX|originalEvent|pauseOnHover|keybNav|yourLogoStyle|yourLogoTarget|above|options|youtubePreview|loading|problem|450|youtube|showSlider|substr|contact|while||gi|embed|allowFullScreenMode|playvideo|hider|half|callback|json|api|0px|responsive|chrome|showCircleTimer|Troubleshooting|write|scalein|meta|custom3d|are|initialized|custom2d|easeInOutQuint|under|mirror|front|aeU|parallaxin|h1|rotatein|force|parallaxIn|layerSliderCustomTransitions|fn|randomize|col|el|object|depth|firstLayerAnimated|lsShowNotice|oldjquery|large|norotate|cbInit|using|layerSliderTransitions|try|out|Transit|loads|animating|Settings|enable|tagName|prop|cbAnimStart|zIndex|off|Please|account|properties|cbStop|cbPause|edit|horizontal|area|Put|includes|cbStart|createStyleSheet|temporary|scale|stopLayer|Global|head|navigate|help|option|CodeCanyon|SLIDE|putData|found|webkitIsFullScreen|cause||important|backgroundColor|fullscreenchange|mozfullscreenchange|mozFullScreen||webkitfullscreenchange|absolute|backgroundImage|_blank|touchscroll|pageX|mousemove|sideright|below|continue|string||title|exclam|sideleft|keydown|vi||Javascript|pointer|cursor|mistyped|Possibilities|without|that|||http|file|Loading|deeplink|itself|mode|already|Fallback|stylesheet|Neither|Skin|insertBefore|disabled|Trying|were|4e3|information|maxresdefault|jpg||thumbnail_large||v2|wrapAll|hack|indicator|center|circle|bar|seconds|yt|multiple||feeds|gdata|controls|videos|alt|group||media|entry|static|quint|layerMarginRight|layerMarginBottom|no|there|distance|fixed|duplicates|Layer|slides|red|solid|2px|Init|code|Number|Content|10000000000|300px|OTransformStyle|transformStyle|WebkitPerspective|msTransformStyle|MozTransformStyle|them|WebkitTransformStyle|MozPerspective|msPerspective|radius|black|20px|hide|any|OPerspective|perspective|comment|comments|cases|our|profile|message|private|vertical|us|dispay|some|curtile|FTP|mixed|need|nexttile|page|We||also|what|custom|specified|carousel|newer|least|item|requires|Updater|sequence|uses|don|know|depository|nexttiles|t2d|curtiles|skins|test3d|easeInOut|easein|easeIn|easeinout|have|restart|swing|easeout|easeOut|cubic|Cubic|issues|Quart|quart|quad|Quad|every|350|conflict|yourlogo|bock|touchend|glass|touchstart|touchmove|doesn|target|RequestFullScreen|disable|CancelFullScreen|queue|textDecoration|outline|sine|Quint|webOS||Android|must|offsetLeft|iPhone|Ask|iPad|should|400|compatible|opera|mozilla|rv|khtml|safari|iPod|BlackBerry|circ|Circ|elastic|Expo|offsetHeight|Sine|expo|Elastic|Back|Phone|Windows|corresponding|isHideOn3D|bounce|Bounce|hasOwnProperty'.split('|'),0,{}))
;

/*
	* 2D & 3D Transitions for LayerSlider
	*
	* (c) 2011-2013 George Krupa, John Gera & Kreatura Media
	*
	* Plugin web:			http://kreaturamedia.com/
	* Licenses: 			http://codecanyon.net/licenses/
*/




eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('23 26={1W:[{j:"13 M E",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"1e",b:F,h:"r"}},{j:"13 M r",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"1e",b:F,h:"E"}},{j:"13 M N",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"1e",b:F,h:"K"}},{j:"13 M K",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"1e",b:F,h:"N"}},{j:"20",d:1,g:1,f:{e:0,i:"n"},c:{o:"14",a:"1e",b:F,h:"r"}},{j:"Z R n",d:[2,4],g:[4,7],f:{e:1j,i:"n"},c:{o:"14",a:"z",b:F,h:"r"}},{j:"Z R B",d:[2,4],g:[4,7],f:{e:1j,i:"B"},c:{o:"14",a:"z",b:F,h:"r"}},{j:"Z R 1k-n",d:[2,4],g:[4,7],f:{e:1j,i:"1k-n"},c:{o:"14",a:"z",b:F,h:"r"}},{j:"Z R 1k-B",d:[2,4],g:[4,7],f:{e:1j,i:"1k-B"},c:{o:"14",a:"z",b:F,h:"r"}},{j:"Z R (k)",d:[2,4],g:[4,7],f:{e:1j,i:"k"},c:{o:"14",a:"z",b:F,h:"r"}},{j:"1x 1G M E",d:1,g:1r,f:{e:25,i:"B"},c:{o:"14",a:"22",b:T,h:"r"}},{j:"1x 1G M r",d:1,g:1r,f:{e:25,i:"n"},c:{o:"14",a:"v",b:T,h:"r"}},{j:"1x 1G M N",d:1r,g:1,f:{e:25,i:"1k-B"},c:{o:"14",a:"v",b:T,h:"r"}},{j:"1x 1G M K",d:1r,g:1,f:{e:25,i:"1k-n"},c:{o:"14",a:"v",b:T,h:"r"}},{j:"1x Y M E",d:1,g:25,f:{e:1j,i:"B"},c:{o:"X",a:"v",b:1g,h:"r"}},{j:"1x Y M r",d:1,g:25,f:{e:1j,i:"n"},c:{o:"X",a:"v",b:1g,h:"E"}},{j:"1x 1U M N",d:25,g:1,f:{e:1j,i:"1k-B"},c:{o:"X",a:"v",b:1g,h:"K"}},{j:"1x Y M K",d:25,g:1,f:{e:1j,i:"1k-n"},c:{o:"X",a:"v",b:1g,h:"N"}},{j:"13 R m E (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"X",a:"z",b:1l,h:"E"}},{j:"13 R m r (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"X",a:"z",b:1l,h:"r"}},{j:"13 R m N (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"X",a:"z",b:1l,h:"N"}},{j:"13 R m K (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"X",a:"z",b:1l,h:"K"}},{j:"13 k R m k 1P",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"X",a:"z",b:1l,h:"k"}},{j:"13 d m E (n)",d:[7,11],g:1,f:{e:1a,i:"n"},c:{o:"X",a:"v",b:p,h:"E"}},{j:"13 d m E (B)",d:[7,11],g:1,f:{e:1a,i:"B"},c:{o:"X",a:"v",b:p,h:"E"}},{j:"13 d m E (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"X",a:"v",b:p,h:"E"}},{j:"13 d m r (n)",d:[7,11],g:1,f:{e:1a,i:"n"},c:{o:"X",a:"v",b:p,h:"r"}},{j:"13 d m r (B)",d:[7,11],g:1,f:{e:1a,i:"B"},c:{o:"X",a:"v",b:p,h:"r"}},{j:"13 d m r (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"X",a:"v",b:p,h:"r"}},{j:"13 d M K m N (n)",d:[7,11],g:1,f:{e:1a,i:"n"},c:{o:"X",a:"v",b:p,h:"N"}},{j:"13 d M K m N (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"X",a:"v",b:p,h:"N"}},{j:"13 d M N m K (B)",d:[7,11],g:1,f:{e:1a,i:"B"},c:{o:"X",a:"v",b:p,h:"K"}},{j:"13 d M N m K (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"X",a:"v",b:p,h:"K"}},{j:"13 O m N (n)",d:1,g:[12,16],f:{e:q,i:"n"},c:{o:"X",a:"v",b:p,h:"N"}},{j:"13 O m N (B)",d:1,g:[12,16],f:{e:q,i:"B"},c:{o:"X",a:"v",b:p,h:"N"}},{j:"13 O m N (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"X",a:"v",b:p,h:"N"}},{j:"13 O m K (n)",d:1,g:[12,16],f:{e:q,i:"n"},c:{o:"X",a:"v",b:p,h:"K"}},{j:"13 O m K (B)",d:1,g:[12,16],f:{e:q,i:"B"},c:{o:"X",a:"v",b:p,h:"K"}},{j:"13 O m K (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"X",a:"v",b:p,h:"K"}},{j:"13 O M r m E (n)",d:1,g:[12,16],f:{e:q,i:"n"},c:{o:"X",a:"v",b:p,h:"E"}},{j:"13 O M r m E (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"X",a:"v",b:p,h:"E"}},{j:"13 O M E m r (B)",d:1,g:[12,16],f:{e:q,i:"B"},c:{o:"X",a:"v",b:p,h:"r"}},{j:"13 O M E m r (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"X",a:"v",b:p,h:"r"}},{j:"Z u Y R m E (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"E"}},{j:"Z u Y R m r (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"r"}},{j:"Z u Y R m N (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"N"}},{j:"Z u Y R m K (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"K"}},{j:"Z u Y k R m k 1P",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"k"}},{j:"Z u Y R M K-r (n)",d:[2,4],g:[4,7],f:{e:1f,i:"n"},c:{o:"Q",a:"z",b:1l,h:"1Y"}},{j:"Z u Y R M N-E (B)",d:[2,4],g:[4,7],f:{e:1f,i:"B"},c:{o:"Q",a:"z",b:1l,h:"24"}},{j:"Z u Y R M K-E (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"1T"}},{j:"Z u Y R M N-r (k)",d:[2,4],g:[4,7],f:{e:1f,i:"k"},c:{o:"Q",a:"z",b:1l,h:"1X"}},{j:"Z u Y d m E (n)",d:[7,11],g:1,f:{e:1a,i:"n"},c:{o:"Q",a:"v",b:p,h:"E"}},{j:"Z u Y d m E (B)",d:[7,11],g:1,f:{e:1a,i:"B"},c:{o:"Q",a:"v",b:p,h:"E"}},{j:"Z u Y d m E (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"Q",a:"v",b:p,h:"E"}},{j:"Z u Y d m r (n)",d:[7,11],g:1,f:{e:1a,i:"n"},c:{o:"Q",a:"v",b:p,h:"r"}},{j:"Z u Y d m r (B)",d:[7,11],g:1,f:{e:1a,i:"B"},c:{o:"Q",a:"v",b:p,h:"r"}},{j:"Z u Y d m r (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"Q",a:"v",b:p,h:"r"}},{j:"Z u Y d M K m N (n)",d:[7,11],g:1,f:{e:1a,i:"n"},c:{o:"Q",a:"v",b:p,h:"N"}},{j:"Z u Y d M K m N (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"Q",a:"v",b:p,h:"N"}},{j:"Z u Y d M N m K (B)",d:[7,11],g:1,f:{e:1a,i:"B"},c:{o:"Q",a:"v",b:p,h:"K"}},{j:"Z u Y d M N m K (k)",d:[7,11],g:1,f:{e:1a,i:"k"},c:{o:"Q",a:"v",b:p,h:"K"}},{j:"Z u Y O m N (n)",d:1,g:[12,16],f:{e:q,i:"n"},c:{o:"Q",a:"v",b:p,h:"N"}},{j:"Z u Y O m N (B)",d:1,g:[12,16],f:{e:q,i:"B"},c:{o:"Q",a:"v",b:p,h:"N"}},{j:"Z u Y O m N (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"Q",a:"v",b:p,h:"N"}},{j:"Z u Y O m K (n)",d:1,g:[12,16],f:{e:q,i:"n"},c:{o:"Q",a:"v",b:p,h:"K"}},{j:"Z u Y O m K (B)",d:1,g:[12,16],f:{e:q,i:"B"},c:{o:"Q",a:"v",b:p,h:"K"}},{j:"Z u Y O m K (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"Q",a:"v",b:p,h:"K"}},{j:"Z u Y O M r m E (n)",d:1,g:[12,16],f:{e:q,i:"n"},c:{o:"Q",a:"v",b:p,h:"E"}},{j:"Z u Y O M r m E (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"Q",a:"v",b:p,h:"E"}},{j:"Z u Y O M E m r (B)",d:1,g:[12,16],f:{e:q,i:"B"},c:{o:"Q",a:"v",b:p,h:"r"}},{j:"Z u Y O M E m r (k)",d:1,g:[12,16],f:{e:q,i:"k"},c:{o:"Q",a:"v",b:p,h:"r"}},{j:"1t",d:1,g:1,f:{e:0,i:"n"},c:{o:"Q",a:"1e",b:T,h:"r",1h:.5}},{j:"1t d",d:4,g:1,f:{e:1f,i:"n"},c:{o:"Q",a:"1e",b:T,h:"r",1h:.5}},{j:"1t g",d:1,g:4,f:{e:1f,i:"n"},c:{o:"Q",a:"1e",b:T,h:"r",1h:.5}},{j:"1t R A",d:3,g:4,f:{e:1r,i:"n"},c:{o:"Q",a:"1e",b:T,h:"r",1h:.5,y:w}},{j:"1t R G",d:3,g:4,f:{e:1r,i:"n"},c:{o:"Q",a:"1e",b:T,h:"K",1h:.5,x:-w}},{j:"1t-1H R A",d:3,g:4,f:{e:15,i:"n"},c:{o:"Q",a:"1e",b:T,h:"r",1h:.5,y:w}},{j:"1t-1H R G",d:3,g:4,f:{e:15,i:"n"},c:{o:"Q",a:"1e",b:T,h:"K",1h:.5,x:-w}},{j:"1t 1H d",d:4,g:1,f:{e:1f,i:"n"},c:{o:"Q",a:"1e",b:T,h:"E",1h:.5}},{j:"1t 1H g",d:1,g:4,f:{e:1f,i:"n"},c:{o:"Q",a:"1e",b:T,h:"r",1h:.5}},{j:"1b f M r",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"z",b:T,h:"E",y:w}},{j:"1b f M E",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"z",b:T,h:"r",y:-w}},{j:"1b f M K",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"z",b:T,h:"N",x:-w}},{j:"1b f M N",d:1,g:1,f:{e:0,i:"n"},c:{o:"X",a:"z",b:T,h:"K",x:w}},{j:"1b R M r",d:[3,4],g:[3,4],f:{e:19,i:"n"},c:{o:"14",a:"z",b:T,h:"r",y:w}},{j:"1b R M E",d:[3,4],g:[3,4],f:{e:19,i:"B"},c:{o:"14",a:"z",b:T,h:"r",y:-w}},{j:"1b R M K",d:[3,4],g:[3,4],f:{e:19,i:"n"},c:{o:"14",a:"z",b:T,h:"r",x:-w}},{j:"1b R M N",d:[3,4],g:[3,4],f:{e:19,i:"B"},c:{o:"14",a:"z",b:T,h:"r",x:w}},{j:"1b d M K",d:[6,12],g:1,f:{e:19,i:"n"},c:{o:"14",a:"z",b:T,h:"r",x:w}},{j:"1b d M N",d:[6,12],g:1,f:{e:19,i:"B"},c:{o:"14",a:"z",b:T,h:"r",x:-w}},{j:"1b g M r",d:1,g:[6,12],f:{e:19,i:"n"},c:{o:"14",a:"z",b:T,h:"r",y:-w}},{j:"1b g M E",d:1,g:[6,12],f:{e:19,i:"B"},c:{o:"14",a:"z",b:T,h:"r",y:w}},{j:"1u d M r",d:[3,10],g:1,f:{e:19,i:"n"},c:{o:"14",a:"z",b:T,h:"r",y:w}},{j:"1u d M E",d:[3,10],g:1,f:{e:19,i:"B"},c:{o:"14",a:"z",b:T,h:"r",y:-w}},{j:"1u g M K",d:1,g:[3,10],f:{e:19,i:"n"},c:{o:"14",a:"z",b:T,h:"r",x:-w}},{j:"1u g M N",d:1,g:[3,10],f:{e:19,i:"B"},c:{o:"14",a:"z",b:T,h:"r",x:w}},{j:"1u u 1z f M r",d:1,g:1,f:{e:q,i:"n"},c:{o:"Q",a:"z",b:T,h:"E",1h:.1,1y:-w,y:w}},{j:"1u u 1z f M E",d:1,g:1,f:{e:q,i:"n"},c:{o:"Q",a:"z",b:T,h:"r",1h:.1,1y:w,y:-w}},{j:"1u u 1z R M r",d:[3,4],g:[3,4],f:{e:19,i:"n"},c:{o:"Q",a:"z",b:T,h:"E",1y:-1v}},{j:"1u u 1z R M E",d:[3,4],g:[3,4],f:{e:19,i:"n"},c:{o:"Q",a:"z",b:T,h:"r",1y:-1v}},{j:"1u u 1z R M k",d:[3,4],g:[3,4],f:{e:19,i:"k"},c:{o:"Q",a:"z",b:T,h:"k",1y:-1v}},{j:"D f 1M",d:1,g:1,f:{e:0,i:"n"},c:{o:"14",a:"z",b:T,h:"r",1h:.1}},{j:"D f M 1L",d:1,g:1,f:{e:0,i:"n"},c:{o:"14",a:"z",b:T,h:"r",1h:2}},{j:"D R k",d:[3,4],g:[3,4],f:{e:1r,i:"k"},c:{o:"14",a:"z",b:T,h:"r",1h:.1}},{j:"D R M 1L k",d:[3,4],g:[3,4],f:{e:1r,i:"k"},c:{o:"14",a:"z",b:T,h:"r",1h:2}},{j:"D 1M u 1z R k",d:[3,4],g:[3,4],f:{e:1r,i:"k"},c:{o:"14",a:"z",b:T,h:"r",1h:.1,1y:w}},{j:"D u 1z R M 1L k",d:[3,4],g:[3,4],f:{e:1r,i:"k"},c:{o:"14",a:"z",b:T,h:"r",1h:2,1y:-w}},{j:"1B-Y R 21",d:3,g:4,f:{e:15,i:"n"},c:{o:"X",a:"v",b:1Z,h:"1T"}},{j:"1B-Y d A",d:6,g:1,f:{e:0,i:"n"},c:{o:"Q",a:"z",b:T,h:"r"}},{j:"1B-Y d G",d:6,g:1,f:{e:0,i:"n"},c:{o:"Q",a:"z",b:T,h:"K"}},{j:"1B-Y g A",d:1,g:8,f:{e:0,i:"n"},c:{o:"Q",a:"z",b:T,h:"r"}},{j:"1B-Y g G",d:1,g:8,f:{e:0,i:"n"},c:{o:"Q",a:"z",b:T,h:"K"}}],1V:[{j:"1c f m E (l&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{y:1E},a:"1K",b:F,h:"A"},C:{c:{y:l},a:"z",b:F,h:"A"}},{j:"1c f m r (l&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{y:-1E},a:"1K",b:F,h:"A"},C:{c:{y:-l},a:"z",b:F,h:"A"}},{j:"1c f m N (l&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{x:-1E},a:"1K",b:1w,h:"G"},C:{c:{x:-l},a:"z",b:1w,h:"G"}},{j:"1c f m K (l&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{x:1E},a:"1K",b:1w,h:"G"},C:{c:{x:l},a:"z",b:1w,h:"G"}},{j:"1c R m E (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"n"},s:{c:{y:l},a:"v",b:F,h:"A"}},{j:"1c R m r (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"B"},s:{c:{y:-l},a:"v",b:F,h:"A"}},{j:"1c R m N (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1k-n"},s:{c:{x:-l},a:"v",b:F,h:"G"}},{j:"1c R m K (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1k-B"},s:{c:{x:l},a:"v",b:F,h:"G"}},{j:"1D S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},s:{c:{y:l},a:"v",b:1I,h:"A"}},{j:"1C S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},s:{c:{x:l},a:"v",b:1I,h:"G"}},{j:"D u S R m E (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"n"},L:{c:{I:.1A},b:1m,a:"18"},s:{c:{y:l},a:"H",b:F,h:"A"},C:{b:1g,a:"H"}},{j:"D u S R m r (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"B"},L:{c:{I:.1A},b:1m,a:"18"},s:{c:{y:-l},a:"H",b:F,h:"A"},C:{b:1g,a:"H"}},{j:"D u S R m N (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1k-n"},L:{c:{I:.1A},b:1m,a:"18"},s:{c:{x:-l},a:"H",b:F,h:"G"},C:{b:1g,a:"H"}},{j:"D u S R m K (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1k-B"},L:{c:{I:.1A},b:1m,a:"18"},s:{c:{x:l},a:"H",b:F,h:"G"},C:{b:1g,a:"H"}},{j:"D u A S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},L:{c:{I:.1A,x:1j},b:1m,a:"18"},s:{c:{y:l},a:"H",b:1I,h:"A"},C:{c:{x:0},b:1g,a:"H"}},{j:"D u G S R k (l&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},L:{c:{I:.1A,y:-15},b:1m,a:"18"},s:{c:{x:l},a:"H",b:1I,h:"G"},C:{c:{y:0},b:1g,a:"H"}},{j:"1c d m E (l&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},s:{c:{y:l},a:"v",b:1d,h:"A"}},{j:"1c d m r (l&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},s:{c:{y:-l},a:"v",b:1d,h:"A"}},{j:"1c d m N (l&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},s:{c:{x:-l},a:"v",b:F,h:"G"}},{j:"1c d m K (l&#t;)",d:[5,9],g:1,f:{e:q,i:"B"},s:{c:{x:l},a:"v",b:F,h:"G"}},{j:"1D S d k (l&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},s:{c:{y:l},a:"v",b:1d,h:"A"}},{j:"1C S d k (l&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},s:{c:{x:-l},a:"v",b:1d,h:"G"}},{j:"1C S d k (1F&#t;)",d:[3,7],g:1,f:{e:1S,i:"k"},s:{c:{x:-1F},a:"v",b:1Q,h:"G"}},{j:"D u S d m E (l&#t;)",d:[5,9],g:1,f:{e:19,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:l},a:"H",b:1n,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u S d m r (l&#t;)",d:[5,9],g:1,f:{e:19,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:-l},a:"H",b:1n,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u S d m N (l&#t;)",d:[5,9],g:1,f:{e:19,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"v",b:p,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u S d m K (l&#t;)",d:[5,9],g:1,f:{e:19,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:l},a:"v",b:p,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u A S d k (l&#t;)",d:[5,9],g:1,f:{e:19,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:l},a:"H",b:1n,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u G S d k (l&#t;)",d:[5,9],g:1,f:{e:19,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"H",b:p,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"1c O m E (l&#t;)",d:1,g:[5,9],f:{e:q,i:"n"},s:{c:{y:l},a:"v",b:1d,h:"A"}},{j:"1c O m r (l&#t;)",d:1,g:[5,9],f:{e:q,i:"n"},s:{c:{y:-l},a:"v",b:1d,h:"A"}},{j:"1c O m N (l&#t;)",d:1,g:[5,9],f:{e:q,i:"n"},s:{c:{x:-l},a:"v",b:F,h:"G"}},{j:"1c O m K (l&#t;)",d:1,g:[5,9],f:{e:q,i:"B"},s:{c:{x:l},a:"v",b:F,h:"G"}},{j:"1D S O k (l&#t;)",d:1,g:[5,9],f:{e:q,i:"k"},s:{c:{y:l},a:"v",b:1d,h:"A"}},{j:"1C S O k (l&#t;)",d:1,g:[5,9],f:{e:q,i:"k"},s:{c:{x:-l},a:"v",b:1d,h:"G"}},{j:"1D S O k (1F&#t;)",d:1,g:[4,9],f:{e:1S,i:"k"},s:{c:{y:1F},a:"v",b:1Q,h:"A"}},{j:"D u S O m E (l&#t;)",d:1,g:[7,11],f:{e:19,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:l},a:"v",b:p,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u S O m r (l&#t;)",d:1,g:[7,11],f:{e:19,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:-l},a:"v",b:p,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u S O m N (l&#t;)",d:1,g:[7,11],f:{e:19,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"H",b:1n,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u S O m K (l&#t;)",d:1,g:[7,11],f:{e:q,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:l},a:"H",b:1n,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u A S O k (l&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:l},a:"H",b:p,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u G S O k (l&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"H",b:1n,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"1R 1N 1O u S m E (l&#t;)",d:1,g:[7,11],f:{e:q,i:"n"},L:{c:{I:.P,x:-1j},b:p,a:"z"},s:{c:{x:1j,y:l},a:"v",b:F,h:"A"},C:{c:{x:0,e:W},a:"z",b:p}},{j:"1R 1N 1O u S m r (l&#t;)",d:1,g:[7,11],f:{e:q,i:"B"},L:{c:{I:.P,x:-1j},b:p,a:"z"},s:{c:{x:1j,y:-l},a:"v",b:F,h:"A"},C:{c:{x:0,e:W},a:"z",b:p}},{j:"1b 1s m E (w&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{y:w},a:"v",b:1d,h:"A"}},{j:"1b 1s m r (w&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{y:-w},a:"v",b:1d,h:"A"}},{j:"1b 1s m N (w&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{x:-w},a:"v",b:1d,h:"G"}},{j:"1b 1s m K (w&#t;)",d:1,g:1,f:{e:q,i:"n"},s:{c:{x:w},a:"v",b:1d,h:"G"}},{j:"D u 17 1s m E (w&#t;)",d:1,g:1,f:{e:q,i:"k"},s:{c:{I:.8,x:1j,y:1v},a:"1e",b:1w,h:"A"},C:{c:{x:0,y:w},b:1w,a:"1e"}},{j:"D u 17 1s m r (w&#t;)",d:1,g:1,f:{e:q,i:"k"},s:{c:{I:.8,x:1j,y:-1v},a:"1e",b:1w,h:"A"},C:{c:{x:0,y:-w},b:1w,a:"1e"}},{j:"D u 17 1o m E (w&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"n"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{y:w},a:"H",b:F,h:"A"},C:{b:1g,a:"H"}},{j:"D u 17 1o m r (w&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"B"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{y:-w},a:"H",b:F,h:"A"},C:{b:1g,a:"H"}},{j:"D u 17 1o m N (w&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1k-n"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{x:-w},a:"H",b:F,h:"G"},C:{b:1g,a:"H"}},{j:"D u 17 1o m K (w&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"1k-B"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{x:w},a:"H",b:F,h:"G"},C:{b:1g,a:"H"}},{j:"D u A 17 1o k (w&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},L:{c:{I:.1i,x:-15},b:1p,a:"18"},s:{c:{y:q},a:"H",b:1p,h:"A"},C:{c:{y:w,x:0},b:1p,a:"H"}},{j:"D u G 17 1o k (w&#t;)",d:[2,4],g:[4,7],f:{e:q,i:"k"},L:{c:{I:.1i,y:15},b:1p,a:"18"},s:{c:{x:q},a:"H",b:1p,h:"G"},C:{c:{x:w,y:0},b:1p,a:"H"}},{j:"1b d m E (w&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},s:{c:{y:w},a:"v",b:1d,h:"A"}},{j:"1b d m r (w&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},s:{c:{y:-w},a:"v",b:1d,h:"A"}},{j:"1D 17 d k (w&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},s:{c:{y:w},a:"v",b:1d,h:"A"}},{j:"D u 17 d m E (w&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},L:{c:{I:.P,x:3},b:p,a:"J"},s:{c:{y:w},a:"H",b:F,h:"A"},C:{c:{e:W,x:0},a:"J",b:p}},{j:"D u 17 d m r (w&#t;)",d:[5,9],g:1,f:{e:q,i:"B"},L:{c:{I:.P,x:3},b:p,a:"J"},s:{c:{y:-w},a:"H",b:F,h:"A"},C:{c:{e:W,x:0},a:"J",b:p}},{j:"D u 17 d m N (w&#t;)",d:[5,9],g:1,f:{e:q,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-w},a:"H",b:F,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u 17 d m K (w&#t;)",d:[5,9],g:1,f:{e:q,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:w},a:"H",b:F,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u A 17 d k (w&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},L:{c:{I:.P,x:3},b:p,a:"J"},s:{c:{y:w},a:"H",b:F,h:"A"},C:{c:{e:W,x:0},a:"J",b:p}},{j:"D u G 17 d k (w&#t;)",d:[5,9],g:1,f:{e:q,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-w},a:"H",b:F,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u A 17 1J d m E (w&#t;)",d:[7,11],g:1,f:{e:q,i:"n"},s:{c:{I:.P,x:5,y:1v},a:"18",b:F,h:"A"},C:{c:{x:0,y:w},a:"18",b:F}},{j:"D u A 17 1J d m r (w&#t;)",d:[7,11],g:1,f:{e:q,i:"B"},s:{c:{I:.P,x:5,y:-1v},a:"18",b:F,h:"A"},C:{c:{x:0,y:-w},a:"18",b:F}},{j:"1b O m N (w&#t;)",d:1,g:[5,9],f:{e:q,i:"n"},s:{c:{x:-w},a:"v",b:F,h:"G"}},{j:"1b O m K (w&#t;)",d:1,g:[5,9],f:{e:q,i:"B"},s:{c:{x:w},a:"v",b:F,h:"G"}},{j:"1C 17 O k (w&#t;)",d:1,g:[5,9],f:{e:q,i:"k"},s:{c:{x:-w},a:"v",b:F,h:"G"}},{j:"D u 17 O m N (w&#t;)",d:1,g:[7,11],f:{e:q,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-w},a:"H",b:F,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u 17 O m K (w&#t;)",d:1,g:[7,11],f:{e:q,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:w},a:"H",b:F,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u 17 O m E (w&#t;)",d:1,g:[7,11],f:{e:q,i:"n"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:w},a:"H",b:F,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u 17 O m r (w&#t;)",d:1,g:[7,11],f:{e:q,i:"B"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:-w},a:"H",b:F,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u A 17 O k (w&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:w},a:"H",b:F,h:"A"},C:{c:{e:W},a:"J",b:p}},{j:"D u G 17 O k (w&#t;)",d:1,g:[7,11],f:{e:q,i:"k"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-w},a:"H",b:F,h:"G"},C:{c:{e:W},a:"J",b:p}},{j:"D u G 17 1J O m E (w&#t;)",d:1,g:[7,11],f:{e:q,i:"n"},s:{c:{I:.P,x:1v,y:-5},a:"18",b:F,h:"G"},C:{c:{x:w,y:0},a:"18",b:F}},{j:"D u G 17 1J O m r (w&#t;)",d:1,g:[7,11],f:{e:q,i:"B"},s:{c:{I:.P,x:-1v,y:-5},a:"18",b:F,h:"G"},C:{c:{x:-w,y:0},a:"18",b:F}},{j:"1c 1s m E (l&#t;, U V)",d:1,g:1,f:{e:q,i:"n",V:"U"},s:{c:{y:l},a:"v",b:1d,h:"A"}},{j:"1c 1s m r (l&#t;, U V)",d:1,g:1,f:{e:q,i:"n",V:"U"},s:{c:{y:-l},a:"v",b:1d,h:"A"}},{j:"1c 1s m N (l&#t;, U V)",d:1,g:1,f:{e:q,i:"n",V:"U"},s:{c:{x:-l},a:"v",b:1d,h:"G"}},{j:"1c 1s m K (l&#t;, U V)",d:1,g:1,f:{e:q,i:"n",V:"U"},s:{c:{x:l},a:"v",b:1d,h:"G"}},{j:"D u S 1o m E (l&#t;, U V)",d:[2,4],g:[4,7],f:{e:q,i:"n",V:"U"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{y:l},a:"H",b:F,h:"A"},C:{b:1g,a:"H"}},{j:"D u S 1o m r (l&#t;, U V)",d:[2,4],g:[4,7],f:{e:q,i:"B",V:"U"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{y:-l},a:"H",b:F,h:"A"},C:{b:1g,a:"H"}},{j:"D u S 1o m N (l&#t;, U V)",d:[2,4],g:[4,7],f:{e:q,i:"1k-n",V:"U"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{x:-l},a:"H",b:F,h:"G"},C:{b:1g,a:"H"}},{j:"D u S 1o m K (l&#t;, U V)",d:[2,4],g:[4,7],f:{e:q,i:"1k-B",V:"U"},L:{c:{I:.P},b:1m,a:"18"},s:{c:{x:l},a:"H",b:F,h:"G"},C:{b:1g,a:"H"}},{j:"D u A S 1o k (l&#t;, U V)",d:[2,4],g:[4,7],f:{e:q,i:"k",V:"U"},L:{c:{I:.1i},b:1p,a:"18"},s:{c:{y:l},a:"H",b:1p,h:"A"},C:{b:1p,a:"H"}},{j:"D u G S 1o k (l&#t;, U V)",d:[2,4],g:[4,7],f:{e:q,i:"k",V:"U"},L:{c:{I:.1i},b:1p,a:"18"},s:{c:{x:l},a:"H",b:1p,h:"G"},C:{b:1p,a:"H"}},{j:"D u S d m E (l&#t;, U V)",d:[5,9],g:1,f:{e:1i,i:"n",V:"U"},L:{c:{I:.P,x:3},b:p,a:"J"},s:{c:{y:l},a:"v",b:1n,h:"A"},C:{c:{e:W,x:0},a:"z",b:1q}},{j:"D u S d m r (l&#t;, U V)",d:[5,9],g:1,f:{e:1i,i:"B",V:"U"},L:{c:{I:.P,x:3},b:p,a:"J"},s:{c:{y:-l},a:"v",b:1n,h:"A"},C:{c:{e:W,x:0},a:"z",b:1q}},{j:"D u S d m N (l&#t;, U V)",d:[5,9],g:1,f:{e:1i,i:"n",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"H",b:F,h:"G"},C:{c:{e:W},a:"z",b:1q}},{j:"D u S d m K (l&#t;, U V)",d:[5,9],g:1,f:{e:1i,i:"B",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:l},a:"H",b:F,h:"G"},C:{c:{e:W},a:"z",b:1q}},{j:"D u A S d k (l&#t;, U V)",d:[5,9],g:1,f:{e:1i,i:"k",V:"U"},L:{c:{I:.P,x:3},b:p,a:"J"},s:{c:{y:l},a:"v",b:1n,h:"A"},C:{c:{e:W,x:0},a:"z",b:1q}},{j:"D u G S d k (l&#t;, U V)",d:[5,9],g:1,f:{e:1i,i:"k",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"H",b:F,h:"G"},C:{c:{e:W},a:"z",b:1q}},{j:"D u S O m N (l&#t;, U V)",d:1,g:[7,11],f:{e:1i,i:"n",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"v",b:1n,h:"G"},C:{c:{e:W},a:"z",b:1q}},{j:"D u S O m K (l&#t;, U V)",d:1,g:[7,11],f:{e:1i,i:"B",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:l},a:"v",b:1n,h:"G"},C:{c:{e:W},a:"z",b:1q}},{j:"D u S O m E (l&#t;, U V)",d:1,g:[7,11],f:{e:1i,i:"n",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:l},a:"H",b:F,h:"A"},C:{c:{e:W},a:"z",b:1q}},{j:"D u S O m r (l&#t;, U V)",d:1,g:[7,11],f:{e:1i,i:"B",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:-l},a:"H",b:F,h:"A"},C:{c:{e:W},a:"z",b:1q}},{j:"D u A S O k (l&#t;, U V)",d:1,g:[7,11],f:{e:1i,i:"k",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{y:l},a:"H",b:F,h:"A"},C:{c:{e:W},a:"z",b:1q}},{j:"D u G S O k (l&#t;, U V)",d:1,g:[7,11],f:{e:1i,i:"k",V:"U"},L:{c:{I:.P},b:p,a:"J"},s:{c:{x:-l},a:"v",b:1n,h:"G"},C:{c:{e:W},a:"z",b:1q}}]}',62,131,'||||||||||easing|duration|transition|rows|delay|tile|cols|direction|sequence|name|random|180|to|forward|type|600|75|left|animation|176|and|easeInOutQuart|90|rotateX|rotateY|easeOutQuart|horizontal|reverse|after|Scaling|right|1e3|vertical|easeInOutBack|scale3d|easeOutBack|top|before|from|bottom|columns|85|mixed|tiles|spinning|750|large|depth|200|slide|sliding|Fading||||Sliding|fade|||turning|easeInOutQuint|55|100|Turning|Spinning|1500|easeInOutQuad|50|350|scale|65|30|col|500|450|1200|cuboids|700|400|35|cuboid|Carousel|Flying|45|800|Smooth|rotate|rotating|95|Mirror|Vertical|Horizontal|91|540|fading|mirror|1300|drunk|easeInQuart|out|in|colums|scaling|directions|2e3|Drunk|150|topright|sliging|t3d|t2d|bottomleft|topleft|850|Crossfading|diagonal|linear|var|bottomright||layerSliderTransitions'.split('|')))
;
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//






$('document').ready(function(){
  if ($('body').hasClass('logged')) {
    $('.admin').show();
  };


  //Calling the layer slider
  $("#layerslider").layerSlider({
    autoStart               : true,
    responsive              : true,
    responsiveUnder         : 1170,
    sublayerContainer       : 1170,
    firstLayer              : 1,
    twoWaySlideshow         : true,
    randomSlideshow         : false,
    keybNav                 : true,
    touchNav                : true,
    imgPreload              : true,
    navPrevNext             : true,
    navStartStop            : false,
    navButtons              : false,
    thumbnailNavigation     : 'disable',
    tnWidth                 : 100,
    tnHeight                : 60,
    tnContainerWidth        : '60%',
    tnActiveOpacity         : 35,
    tnInactiveOpacity       : 100,
    hoverPrevNext           : true,
    hoverBottomNav          : false,
    skin                    : 'grove',
    skinsPath               : '/assets/skins/',
    pauseOnHover            : true,
    globalBGColor           : 'transparent',
    globalBGImage           : false,
    animateFirstLayer       : false,
    yourLogo                : false,
    yourLogoStyle           : 'position: absolute; z-index: 1001; left: 10px; top: 10px;',
    yourLogoLink            : false,
    yourLogoTarget          : '_blank',
    loops                   : 0,
    forceLoopNum            : true,
    autoPlayVideos          : true,
    autoPauseSlideshow      : 'auto',
    youtubePreview          : 'maxresdefault.jpg',
    showBarTimer        : false,
    showCircleTimer     : false,
 
    // you can change this settings separately by layers or sublayers with using html style attribute
 
    slideDirection          : 'right',
    slideDelay              : 4000,
    durationIn              : 1000,
    durationOut             : 1000,
    easingIn                : 'easeInOutQuint',
    easingOut               : 'easeInOutQuint',
    delayIn                 : 1,
    delayOut                : 1
  });
});

var fs      = require ('fs');
var path    = require('path');
var parser  = require('xml2js');

const PLUGIN_NAME         = "cordova-google-api-version";
const GRADLE_FILENAME     = path.resolve(process.cwd(), 'platforms', 'android', PLUGIN_NAME, 'properties.gradle');
const PROPERTIES_TEMPLATE = 'ext {GOOGLE_API_VERSION = "<VERSION>"}'

// 1. Parse cordova.xml file and fetch this plugin's <variable name="GOOGLE_API_VERSION" />
fs.readFile(path.resolve(process.cwd(), 'config.xml'), function(err, data) {
  var json = parser.parseString(data, function(err, result) {
    if (err) {
      return console.log(PLUGIN_NAME, " ERROR: ", err);
    }
    var plugins = result.widget.plugin;
    for (var n=0,len=plugins.length;n<len;n++) {
      var plugin = plugins[n];
      if (plugin.$.name === PLUGIN_NAME) {
        if (!plugin.variable.length) { 
          return console.log(PLUGIN_NAME, ' ERROR: FAILED TO FIND <variable name="GOOGLE_API_VERSION" /> in config.xml');
        }
        // 2.  Update .gradle file.
        setGradleGoogleApiVersion(plugin.variable.pop().$.value);
        break;
      }
    }
  });
});

/**
* Write properties.gradle with:
*
ext {
  GOOGLE_API_VERSION = '<VERSION>'
}
*
*/
function setGradleGoogleApiVersion(version) {
  console.log(PLUGIN_NAME, " GOOGLE_API_VERSION: ", version);
  fs.writeFile(GRADLE_FILENAME, PROPERTIES_TEMPLATE.replace(/<VERSION>/, version), 'utf8', function (err) {
     if (err) return console.log(PLUGIN_NAME, " FAILED TO WRITE ", GRADLE_FILENAME, " > ", GOOGLE_API_VERSION, err);
  });
}






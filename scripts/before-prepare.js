var fs = require ('fs');
var path = require('path');
var glob = require("glob")
var parser = require('xml2js');

const PLUGIN_NAME = "cordova-google-api-version";
const GRADLE_FILENAME = path.resolve(process.cwd(), 'platforms', 'android', PLUGIN_NAME, '*.gradle');

//var sourcePath = path.resolve(__dirname, 'build-extras.gradle');
var configFilePath = path.resolve(process.cwd(), 'config.xml');
var destPath = 

// 1. Parse cordova.xml file and fetch this plugin's <variable name="GOOGLE_API_VERSION" />
fs.readFile(configFilePath, function(err, data) {
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
        var googleApiVersion = plugin.variable.pop().$.value;
        // 2.  Update .gradle file.
        setGradleGoogleApiVersion(googleApiVersion);
        break;
      }
    }
  });
});

/**
* Replace gradle variable GOOGLE_API_VERSION with value fetched from cordova config.xml
*
* platforms/android/cordova-google-api-version/cordova-google-api-version.gradle
* 
* def GOOGLE_API_VERSION = '<VERSION_READ_FROM_CONFIG.XML>'
*
*/
function setGradleGoogleApiVersion(version) {
  console.log(PLUGIN_NAME, " GOOGLE_API_VERSION: ", version);
  // The plugin *should* have just one .gradle file in android/PLUGIN_NAME/
  glob(GRADLE_FILENAME, function (er, files) {
    var filename = files.pop();
    fs.readFile(filename, 'utf8', function (err,data) {
      if (err) {
        return console.log(PLUGIN_NAME, " ERROR: ", err);
      }
      // Replace the gradle variable def GOOGLE_API_VERSION = '<VERSION>'

      var result = data.replace(/def\s+GOOGLE_API_VERSION\s+=.*/, "def GOOGLE_API_VERSION = '" + version + "'");      

      fs.writeFile(filename, result, 'utf8', function (err) {
         if (err) return console.log(PLUGIN_NAME, " FAILED TO SET GOOGLE_API_VERSION: ", err);
      });
    });
  });
}






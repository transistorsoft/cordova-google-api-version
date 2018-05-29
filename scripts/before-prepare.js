var fs      = require ('fs');
var path    = require('path');

const PLUGIN_NAME         = "cordova-google-api-version";
const GRADLE_FILENAME     = path.resolve(process.cwd(), 'platforms', 'android', PLUGIN_NAME, 'properties.gradle');
const PROPERTIES_TEMPLATE = 'ext {GOOGLE_API_VERSION = "<VERSION>"}'

// 1. Parse android.json file for play services version.
const androidJson = require(`${process.cwd()}/platforms/android/android.json`) || {};
const installedPlugins = androidJson.installed_plugins;
if (installedPlugins) {
    const pluginVariables = installedPlugins[PLUGIN_NAME];
    if (pluginVariables && pluginVariables.GOOGLE_API_VERSION) {
        setGradleGoogleApiVersion(pluginVariables.GOOGLE_API_VERSION);
    } else {
        console.log(PLUGIN_NAME, ' ERROR: FAILED TO FIND <variable name="GOOGLE_API_VERSION" /> in config.xml');
    }
}

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






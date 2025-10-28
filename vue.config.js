/*const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})*/

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',   // Damit der Server von außen erreichbar ist
    port: 8080,        // Optional: Port festlegen
    // open: true,     // Optional: öffnet automatisch den Browser
    // https: false,  // Optional: HTTPS aktivieren
    allowedHosts: 'all' // optional, erlaubt Zugriff von beliebigen Hosts
  }
})

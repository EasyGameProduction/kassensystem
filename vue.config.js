/*const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})*/

module.exports = {
  outputDir: 'dist', // Output-Verzeichnis für build
  devServer: {
    host: 'localhost',
    //host: '0.0.0.0',
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
  },
}

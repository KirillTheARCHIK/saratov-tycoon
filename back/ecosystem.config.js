module.exports = {
  apps : [{
    name   : "saratov-tycoon-back",
    script : "./src/index.js",
    watch: true,
    watch_delay: 2000,
    ignore_watch : ["./node_modules"],
  }]
}

var hbs     = require('express-hbs'),
    _       = require('lodash'),
    cheerio = require('cheerio');


registerHelper = function () {

  hbs.registerHelper('toc', function toc(options) {

    options = options || {};
    options.hash = options.hash || {};

    var toc = [];
    var $ = cheerio.load(this.html);
    var startLevel = options.hash.start || 1;
    var maxDepth = options.hash.end || 4;

    var getHeadlines = function(start, end, current, elem) {
      if(current === end) { return; }
      if(_.isUndefined(current)) {
        $('h' + start).each(function(i, elem) {
          toc.push($(elem).text());
          getHeadlines(start, end, start + 1, elem);
        });
      } else {
        $(elem).nextUntil('h' + current - 1,'h' + current).each(function(i, elem) {
          toc.push($(elem).text());
          getHeadlines(start, end, current + 1, elem);
        });
      }
    }

    getHeadlines(startLevel, maxDepth);

    return new hbs.handlebars.SafeString('<li>' + toc.join('</li><li>') + '</li>');

  });

};

module.exports = registerHelper;
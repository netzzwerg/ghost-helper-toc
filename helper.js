var hbs     = require('express-hbs'),
    _       = require('lodash'),
    cheerio = require('cheerio');


registerHelper = function () {

  //
  // ### Table of Contents helper
  //
  // @param  {Object} options object,
  // start is the starting level and
  // end the max depth of the headline level
  //
  // *Usage example:*
  // `{{toc}}`
  // `{{toc start="1" end="3"}}`
  //
  // Defaults to start="1"
  // Defaults to end="4"
  //
  // **returns** SafeString content html.
  //
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
          toc.push('<li><a href="#' + $(elem).attr('id') + '">' + $(elem).text() + '</a></li>');
          getHeadlines(start, end, start + 1, elem);
        });
      } else {
        toc.push('<ul>');
        $(elem).nextUntil('h' + current - 1,'h' + current).each(function(i, elem) {
          toc.push('<li><a href="#' + $(elem).attr('id') + '">' + $(elem).text() + '</a></li>');
          getHeadlines(start, end, current + 1, elem);
        });
        toc.push('</ul>');
      }
    }

    getHeadlines(startLevel, maxDepth);

    return new hbs.handlebars.SafeString('<li>' + toc.join('</li><li>') + '</li>');

  });

};

module.exports = registerHelper;
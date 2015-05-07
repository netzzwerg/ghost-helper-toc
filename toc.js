'use strict';

var hbs     = require('express-hbs'),
    _       = require('lodash'),
    registerHelper,
    cheerio = require('cheerio');


var registerHelper = function () {

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
  hbs.registerHelper('toc', function(options) {

    var options = options || {};
        options.hash = options.hash || {};

    var toc = [];
    var $ = cheerio.load(this.html);
    var startLevel = options.hash.start || 1;
    var maxDepth = options.hash.end || 4;

    var getHeadlines = function(start, end, current, elem) {
      if(parseInt(current) > parseInt(end)) { return; }
      if(_.isUndefined(current)) {
        $('h' + start).each(function(i, elem) {
          toc.push('<li><a href="#' + $(elem).attr('id') + '">' + $(elem).text() + '</a></li>');
          getHeadlines(start, end, parseInt(start) + 1, elem);
        });
      } else {
        var $subHeaders = $(elem).nextUntil('h' + (parseInt(current) - 1), 'h' + current);
        if($subHeaders.length !== 0) {
          toc.push('<ul>');
          $subHeaders.each(function(i, elem) {
            toc.push('<li><a href="#' + $(elem).attr('id') + '">' + $(elem).text() + '</a></li>');
            getHeadlines(start, end, parseInt(current) + 1, elem);
          });
          toc.push('</ul>');
        }
      }
    };

    // Ignore the cases where no header with startLevel exists
    while(startLevel <= maxDepth && $('h' + startLevel).length === 0){
      startLevel++;
    }

    if (startLevel <= maxDepth) {
      getHeadlines(startLevel, maxDepth);
    }

    return new hbs.handlebars.SafeString(toc.join(' '));

  });

};

module.exports = registerHelper;

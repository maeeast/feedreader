/* global Handlebars */
var allFeeds = [
    { name: 'Udacity Blog', url: 'http://blog.udacity.com/feed' },
    { name: 'CSS Tricks', url: 'http://feeds.feedburner.com/CssTricks' },
    { name: 'HTML5 Rocks', url: 'http://feeds.feedburner.com/html5rocks' },
    { name: 'Linear Digressions', url: 'http://feeds.feedburner.com/udacity-linear-digressions' }
];

// Demo mode is opt-in. A failed live request never substitutes sample data.
var demoMode = /(?:\?|&)demo=1(?:&|$)/.test(window.location.search);

function loadFeed(id, cb) {
    var feed = allFeeds[id];

    function reportError(message) {
        $('.feed').empty();
        $('.feed-status').text(message);
        if (cb) {
            cb(new Error(message));
        }
    }

    if (!feed) {
        reportError('Unknown feed selection.');
        return;
    }

    $('.feed-status').text('Loading feed…');
    // Both modes use asynchronous requests and the same rendering code.
    // Demo fixtures replace the external data source, not loadFeed itself.
    $.ajax(demoMode ? {
        url: 'fixtures/feed-' + id + '.json',
        dataType: 'json',
        timeout: 15000
    } : {
        type: 'POST',
        url: 'https://rsstojson.udacity.com/parseFeed',
        data: JSON.stringify({ url: feed.url }),
        contentType: 'application/json',
        dataType: 'json',
        timeout: 15000
    }).done(function(result) {
        if (!result || !result.feed || !Array.isArray(result.feed.entries)) {
            reportError('The feed service returned an invalid response.');
            return;
        }
        var container = $('.feed'),
            template = Handlebars.compile($('.tpl-entry').html());

        $('.header-title').text(feed.name);
        container.empty();
        result.feed.entries.forEach(function(entry) {
            container.append(template(entry));
        });
        $('.feed-status').text('');
        if (cb) {
            cb();
        }
    }).fail(function() {
        reportError('Could not load the feed. Check the network or use ?demo=1 for sample feeds.');
    });
}

$(function() {
    var feedList = $('.feed-list'),
        template = Handlebars.compile($('.tpl-feed-list-item').html());

    allFeeds.forEach(function(feed, index) {
        feedList.append(template({ name: feed.name, id: index }));
    });

    feedList.on('click', 'a', function(event) {
        event.preventDefault();
        $('body').addClass('menu-hidden');
        loadFeed($(this).data('id'));
    });

    $('.menu-icon-link').on('click', function(event) {
        event.preventDefault();
        $('body').toggleClass('menu-hidden');
    });

    if (demoMode) {
        $('.data-mode').text('Demo mode: local sample feeds, not live RSS.');
    }
    // Initial rendering must finish before specs begin to avoid competing
    // requests. The Jasmine boot callback is deferred in index.html.
    loadFeed(0, function() {
        if (window.startFeedReaderTests) {
            window.startFeedReaderTests();
        }
    });
});

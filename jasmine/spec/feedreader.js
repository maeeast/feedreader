/* global allFeeds, loadFeed, describe, it, expect, beforeEach, afterEach */
$(function() {
    'use strict';

    // Capture the startup state before any spec can change it. Resetting the
    // class before this assertion would hide a broken default in index.html.
    var initiallyHidden = $('body').hasClass('menu-hidden');

    describe('RSS Feeds', function() {
        it('are defined and nonempty', function() {
            expect(allFeeds).toBeDefined();
            expect(Array.isArray(allFeeds)).toBe(true);
            expect(allFeeds.length).toBeGreaterThan(0);
        });

        it('each have a nonempty URL', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(typeof feed.url).toBe('string');
                expect(String(feed.url || '').trim().length).toBeGreaterThan(0);
            });
        });

        it('each have a nonempty name', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(typeof feed.name).toBe('string');
                expect(String(feed.name || '').trim().length).toBeGreaterThan(0);
            });
        });
    });

    describe('The menu', function() {
        afterEach(function() {
            $('body').addClass('menu-hidden');
        });

        it('is hidden by default', function() {
            expect(initiallyHidden).toBe(true);
        });

        it('shows on one click and hides on the next click', function() {
            $('body').addClass('menu-hidden');
            expect($('.menu-icon-link').length).toBe(1);
            $('.menu-icon-link').trigger('click');
            expect($('body').hasClass('menu-hidden')).toBe(false);
            $('.menu-icon-link').trigger('click');
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    describe('Initial Entries', function() {
        beforeEach(function(done) {
            // Clear stale entries so a failed request cannot pass this test.
            $('.feed').empty();
            loadFeed(0, function(error) {
                if (error) {
                    done.fail(error);
                    return;
                }
                done();
            });
        }, 20000);

        it('contains at least one entry after loading', function() {
            expect($('.feed .entry').length).toBeGreaterThan(0);
        });
    });

    describe('New Feed Selection', function() {
        var firstContent;

        beforeEach(function(done) {
            firstContent = undefined;
            $('.feed').empty();
            // Nest callbacks to compare completed renders in order. Neither
            // request relies on entries left behind by another test suite.
            loadFeed(0, function(error) {
                if (error) {
                    done.fail(error);
                    return;
                }
                expect($('.feed .entry').length).toBeGreaterThan(0);
                firstContent = $('.feed').html();
                loadFeed(1, function(nextError) {
                    if (nextError) {
                        done.fail(nextError);
                        return;
                    }
                    done();
                });
            });
        }, 35000);

        it('changes the entry content when a different feed loads', function() {
            expect($('.feed .entry').length).toBeGreaterThan(0);
            expect($('.feed').html()).not.toBe(firstContent);
        });
    });
});

# Feed Reader Testing

Completed Jasmine tests for the Udacity Feed Reader project.

## Run the application and tests

1. Extract the ZIP and open a terminal in the folder containing `index.html`.
2. Start a static HTTP server. On Windows with Python installed, run
   `py -m http.server 8000`. On macOS/Linux run `python3 -m http.server 8000`.
3. Open `http://localhost:8000/?demo=1` in a browser for the repeatable demo.
4. Scroll to the Jasmine report. A passing run displays **7 specs, 0 failures**.
5. To check live feeds instead, open `http://localhost:8000/` without `?demo=1`.
6. Stop the server with Ctrl+C when finished.

Do not open the HTML directly as a file. Local JSON requests need an HTTP server.
No npm installation or build step is required. Python is only the static server;
another static server can be used instead. The JavaScript dependencies are
bundled under `vendor`, so demo mode does not need external services.

## Coverage

- RSS Feeds: the array exists and is nonempty; every URL and name is a nonempty string.
- The menu: startup state is hidden; two clicks show and hide the menu.
- Initial Entries: a completed load creates at least one `.feed .entry`.
- New Feed Selection: sequential completed loads of feeds 0 and 1 change entry content.

Tests run with Jasmine's randomized order. Menu state is restored after each
menu spec. Feed specs clear existing content and load their own data. The default
menu assertion captures the original startup state rather than resetting it.
Asynchronous setup calls `done()` only after rendering finishes; errors fail the
spec explicitly. Initial app loading finishes before Jasmine starts.

## Demo and live data

Demo mode uses asynchronous local JSON fixtures through the real `loadFeed`
function and rendering code. Sample data is visibly labeled and does not verify
live RSS connectivity. No test spies or replacement rendering functions are used.

Live mode preserves the starter's feed URLs and Udacity RSS-to-JSON endpoint.
The endpoint returned HTTP 502 during development in this environment. Live
integration passing results have therefore **not** been verified. Failed live
requests display an error and fail affected feed tests; there is no automatic
sample-data fallback. Some original feeds may also no longer be available.

## Changes from the starter

Completed `jasmine/spec/feedreader.js`, corrected DOM-ready callbacks, removed the
obsolete Google JSAPI startup dependency, added explicit request errors/timeouts,
and deferred Jasmine startup until the initial load finishes. Added opt-in local
fixtures and bundled the starter's existing JavaScript dependency versions.

## Submission

Commit this folder's contents to your repository and submit its default branch.
There are no build tools, so separate `src` and `dist` directories are unnecessary.
Do not commit `node_modules`. Preserve `License.md` and the third-party notices.

## Third-party dependencies

Bundled unmodified CDN distributions: Jasmine 3.3.0 (MIT), jQuery 3.3.1 (MIT), and
Handlebars 4.0.12 (MIT). These are the versions supplied by the starter, retained
for project compatibility. Their distribution headers retain copyright notices.
Source distributions: https://cdnjs.com/libraries/jasmine/3.3.0,
https://cdnjs.com/libraries/jquery/3.3.1, and
https://cdnjs.com/libraries/handlebars.js/4.0.12.

## Verification performed

On October 8, 2026, Jasmine reported **7 specs, 0 failures** in demo mode
for random seeds 123, 456, and 789 using jsdom 26 (a simulated browser DOM).
No script errors were reported. A full browser run was not completed because
the Chromium download failed. Check the Jasmine report in your own browser
before submission. Live RSS integration remains unverified as described above.

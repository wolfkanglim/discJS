# Status

Early but functional prototype. Up-to-date Chrome seems to provide the best audio experience.

# What is discJS?

DiscJS provides a simple launchpad-like experience for live play. You'll need to work with a prior collection of samples adjusted to a particular BPM (usually ones you've prepared yourself in advance for a given song or set).

Unlike other launchpad emulators, samples don't play instantly but are scheduled in relation to the base (shortest) active sample. This provides a more hands-off approach to DJing. Use other software, MIDI devices or actual instruments to complement your needs.

# Instructions

Open [this link](https://tukkek.github.io/discJS/) or a local copy of the HTML file in a browser. Select samples manually before (or during) play. Activate/deactive tracks by using their shortcut keys or clicking on individual pads. 

The spacebar starts and stops play. Holding shift will play a loop immediately instead of scheduling it.

To reorganize existing pads in your layout, you can drag-and-drop them to another location.

You can set a color group for each pad. The way this works is that the same pad group is mutually exclusive. For example: if you have 6 drum loops, each one in a pad, all colored to be in the same group, then every time you activate a drum pad, all others will be immediately deactivated - making it an useful feature for mapping pads containing the same instrument, where only one should play at any given time.

The package comes with a few sample samples (🙃) that are basic but should be enough to get a feel for discJS. Note that to access these files you need to download discJS locally as a ZIP file - everything else works fine running from the web.

Your performances are automatically recorded - you can replay them with the built-in player or save them by using the save file.

Since layouts can become a work in and of themselves depending on their complexity, you can save them to an external file and restore later on as needed. discJS will automatically remember your actions as well  - but this is limited by a browser's storage policies, so to be safe export your work every so often.

# Known issues

* Currently based on ABNT2 keyboard (trivial to edit in source code)

# Wishlist

* Import and export layout setups
* Produce a more respectable set of packaged samples
    * Load a full song layout by default, have a "reset" button to start fresh
* Allow color-coded categories that automatically disable pads of the same color when activated
    * Might require a Pad rewrite into WebComponents (and new color chooser component)
    * Classic Mac palette looks good and expressive https://en.wikipedia.org/wiki/List_of_software_palettes#Apple_Macintosh_default_16-color_palette
* Panels using the space below:
    * Links to GitHub/readme, perhaps a logo as well
    * Waveform drawing
        * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
        * https://www.michaelbromley.co.uk/blog/audio-visualization-with-web-audio-canvas-and-the-soundcloud-api/

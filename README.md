<p align="center">
  <img src="src/img/icon.png" width=128 height=128>

  <h3 align="center">Crypto Miner Blocker</h3>

  <p align="center">
    This Google Chrome extension automatically blocks known crypto web mining scripts.
    <br>
    <a href="#"><strong>Install for Google Chrome &raquo;</strong></a>
    <br>
    <br>
    <a href="https://github.com/lesander/monero-blocker/archive/master.zip">Download Source</a>
    &middot;
    <a href="https://about.sander.tech">About Me</a>
    &middot;
    <a href="https://paypal.me/sanderlaarhoven">Buy me a Beer</a>
  </p>
</p>

<br>

## Why block Web Crypto Miners?
Recently ThePirateBay.org and Showtime.com were caught experimenting with [CoinHive](https://coin-hive.com), a crypto miner for websites. While this looks like a promising solution to the dying ads market, the implementation of webmasters is simply full out wrong as CoinHive itself has [concluded](https://coin-hive.com/blog/status-report):

> We're a bit saddened to see that some of our customers integrate Coinhive into their pages without disclosing to their users what's going on, let alone asking for their permission. We believe there's so much more potential for our solution, but we have to be respectful to our end users. [...]
>
-- CoinHive

A webmaster following the instructions of CoinHive's [documentation](https://coin-hive.com/documentation) will by default end up consuming up to 70% of every visitor's CPU until they close the website. While this might not be a problem for desktops engergy-wise, it will drain the battery of laptops and smartphones. And we haven't even talked about the CPU usage slowing the machine down, fan noise, heat and a shorter hardware life.

Until a proper fix is released by CoinHive - for example requiring every visitor's consent before starting mining - I recommend manually adding a few block rules to your favorite ad blocker or installing this extension.

## Contributing
Have you found a web crypto miner that is currently not blocked by this extension? For suggestions, issues or feedback please head over to the [issue tracker](https://github.com/lesander/monero-blocker/issues) or open a [pull request](https://github.com/lesander/monero-blocker/pulls).

Contributors can easily set up a work environment as follows:
1. Clone the repository `git clone https://github.com/lesander/crypto-miner-blocker.git`
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable Developer Mode by clicking the checkbox in the top right corner.
4. Click the 'Load unpacked extension' button and select the directory you just cloned.
5. Enable the extension and start contributing!


## License
Code and documentation copyright 2017 Sander Laarhoven. Code released under the [MIT License](https://github.com/lesander/monero-blocker/blob/master/README.md).

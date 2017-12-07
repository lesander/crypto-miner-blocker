/**
 * Crypto Miner Blocker.
 * https://git.io/crypto-miner-blocker
 * Licensed under the MIT License
 * Copyright (c) 2017 Sander Laarhoven All Rights Reserved.
 */

/**
 * Handle the getting and setting of configuration values.
 */
isBlockerEnabled = true
areBlockNotificationEnabled = true
areBlockStatisticsEnabled = true

chrome.storage.local.get(['blockerEnabled', 'notificationsEnabled', 'statisticsEnabled'], function (values) {
  if (typeof values['blockerEnabled'] !== 'undefined') isBlockerEnabled = values['blockerEnabled']
  if (typeof values['notificationsEnabled'] !== 'undefined') areBlockNotificationEnabled = values['notificationsEnabled']
  if (typeof values['statisticsEnabled'] !== 'undefined') areBlockStatisticsEnabled = values['statisticsEnabled']
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes['blockerEnabled']) isBlockerEnabled = changes['blockerEnabled'].newValue
  if (changes['notificationsEnabled']) areBlockNotificationEnabled = changes['notificationsEnabled'].newValue
  if (changes['statisticsEnabled']) areBlockStatisticsEnabled = changes['statisticsEnabled'].newValue
})

/**
 * We block outgoing requests to blacklisted domains (http, https, ws, wss)
 * using a named event listener to avoid conflicts with other blocking extensions.
 */
Blocker = function (details) {
  if (isBlockerEnabled && areBlockStatisticsEnabled) IncrementBlockCount()
  if (isBlockerEnabled && areBlockNotificationEnabled) NotifyUser(details)
  return { cancel: isBlockerEnabled }
}

/**
 * The WebSocket protocols ws and wss have to be added explicitly
 * since the protocol wildcard *:// does not include WebSockets.
 * (https://bugs.chromium.org/p/chromium/issues/detail?id=129353#c102)
 *
 * CoinHive uses multiple domains (coinhive.com and coin-hive.com).
 *
 * If coinhive.js is ever loaded from a different source not in this blacklist,
 * the blacklist will still block the WebSocket requests.
 */
BlackList = [

  // CoinHive
  '*://*.coin-hive.com/*',
  '*://*.coinhive.com/*',
  'wss://*.coinhive.com/*',
  'ws://*.coinhive.com/*',
  'wss://*.coin-hive.com/*',
  'ws://*.coin-hive.com/*',
  '*://*/*coinhive*.js*',
  '*://*/*coin-hive*.js*',

  // JSECoin
  '*://*.jsecoin.com/*',

  // CryptoLoot
  'wss://*.crypto-loot.com/*',
  
  // Minr
  '*://*.host.d-ns.ga/*',
  'wss://*.host.d-ns.ga/*',
  'ws://*.host.d-ns.ga/*',
  
  // Others
  '*://*.reasedoper.pw/*',
  '*://*.mataharirama.xyz/*',
  '*://*.listat.biz/*',
  '*://*.lmodr.biz/*',
  '*://*.minecrunch.co/*',
  '*://*.minemytraffic.com/*',
  '*://*.crypto-loot.com/*',
  'wss://*.crypto-loot.com/*',
  '*://*.2giga.link/*',
  'wss://*.2giga.link/*',
  '*://*.ppoi.org/*',
  '*://*.coinerra.com/*',
  '*://*.coin-have.com/*',
  '*://*.kisshentai.net/*',
  '*://*.joyreactor.cc/ws/ch/*',
  '*://*.ppoi.org/lib/*',
  '*://*.coinnebula.com/lib/*',
  '*://*.afminer.com/code/*',
  '*://*.coinblind.com/lib/*',
  '*://*.webmine.cz/miner*',
  '*://*.papoto.com/lib/*',
  
  // Specific scripts
  '*://*/*javascriptminer*.js*',
  '*://*/*miner.js*',
  '*://*/*miner.min.js*',
  '*://*/*xmr.js*',
  '*://*/*xmr.min.js*',
  '*://*/*coinlab.js*',
  '*://*/*c-hive.js*',
  '*://*/*cloudcoins*.js*',
  '*://*/*miner.js*',
  
  // Specific script hosts
  '*://miner.pr0gramm.com/xmr.min.js*',
  '*://*.kiwifarms.net/js/Jawsh/xmr/xmr.min.js*',
  '*://anime.reactor.cc/js/ch/cryptonight.wasm*',
  '*://cdn.cloudcoins.co/javascript/cloudcoins.min.js*',
  '*://*.kissdoujin.com/Content/js/c-hive.js*',
  '*://*.coinlab.biz/lib/coinlab.js*',
  '*://*.monerominer.rocks/scripts/miner.js*',
  '*://*.monerominer.rocks/miner.php*',
  '*://*.minero.pw/miner.min.js*'
]

/**
 * Using Chrome API's webRequest.onBeforeRequest we enforce our blacklist.
 * This method requires access to Chrome API's webRequest and webRequestBlocking permissions.
 * We also need access to <all_urls>, since we wouldn't be able to intercept any
 * requests made from websites if we didn't have access to them in the first place.
 */
chrome.webRequest.onBeforeRequest.addListener(Blocker, { urls: BlackList }, ['blocking'])

/**
 * The overview page provides information such as the total amount of blocked scripts.
 *
 * To communicate between the background process (this file) and the overview page and
 * in order to save the statistics as mentioned above, we need access to the storage API.
 * Statistics saving has zero impact on browser speed performance but can be disabled if desired.
 *
 * On a side note, it's callback hell here since ES6 is not natively supported in all popular Chrome versions.
 * (And I can't be bothered to set up a Babel compiler for this extension tbh.)
 */
IncrementBlockCount = function () {
  chrome.storage.local.get('blockCount', function (values) {
    storedCount = values['blockCount'] || 0
    count = parseInt(storedCount) + 1
    chrome.storage.local.set({'blockCount': count}, function() {})
  })
}

NotifyUser = function (details) {

  // Get information on the tab that requested the Crypto Miner.
  chrome.tabs.get(details.tabId, function (tab) {

    // Create a notification to be displayed immediately.
    options = {
      type: 'list',
      title: `Crypto Miner Script Blocked`,
      message: `${tab.title}`,
      items: [
        { title: 'Title', message: `${tab.title}` },
        { title: 'URL', message: `${tab.url}` },
        { title: 'Script URL', message: `${details.url}` }
      ],
      iconUrl: 'src/img/icon.png',
      buttons: [{ title: 'View More' }, { title: 'Disable Notifications' }]
    }
    chrome.notifications.create(null, options, function () {})

    // Store this offender.
    // TODO: Only if history is enabled!
    stamp = new Date().getTime()
    caseId = 'block_' + stamp + '_' + Math.round(Math.random() * 10e10)
    caseData = { page: tab, request: details, date: stamp }
    caseObject = {}
    caseObject[caseId] = caseData
    chrome.storage.local.set(caseObject, function (res) { console.log('saved case', res) })

  })


  // We disable notifications on button click.
  chrome.notifications.onButtonClicked.addListener(function (notifId, btnIndex) {

    if (btnIndex === 0) {
      window.open('src/history.html')
      return
    }

    // Close all currently open or waiting notifications.
    chrome.notifications.getAll(function (notifications) {
      for (var notif in notifications) {
        if (notifications.hasOwnProperty(notif)) {
          chrome.notifications.clear(notif)
        }
      }
    })

    // Disable the notification setting.
    chrome.storage.local.set({'notificationsEnabled': false}, function() {})
    areBlockNotificationEnabled = false
  })
}

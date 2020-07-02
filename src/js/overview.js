/**
 * Crypto Miner Blocker.
 * https://git.io/crypto-miner-blocker
 * Licensed under the MIT License
 * Copyright (c) 2017 All Rights Reserved.
 */

$elVersion = document.getElementById('version')
$elHeader = document.getElementsByClassName('header')[0]
$elBlockCount = document.getElementById('stat-block-count')
$elSettings = document.getElementsByClassName('settings')[0]
$elSettingsBlocker = document.getElementById('blockerEnabled')
$elSettingsNotifs = document.getElementById('notificationsEnabled')
$elSettingsStats = document.getElementById('statisticsEnabled')

// Populate the header with the package version.
$elVersion.innerText = chrome.app.getDetails().version

// Get the current block count.
// Set the checked/unchecked value for the settings.
chrome.storage.local.get(['blockCount', 'blockerEnabled', 'notificationsEnabled', 'statisticsEnabled'], function (values) {
  $elBlockCount.innerText = values['blockCount'] || 0
  if (values['blockerEnabled'] !== false) $elSettingsBlocker.setAttribute('checked', 'checked')
  if (values['notificationsEnabled'] !== false) $elSettingsNotifs.setAttribute('checked', 'checked')
  if (values['statisticsEnabled'] !== false) $elSettingsStats.setAttribute('checked', 'checked')
})

// Listen for future block count updates.
// TODO: disable listener if stats are disabled.
chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log(changes)
  if (changes['blockCount']) $elBlockCount.innerText = changes['blockCount'].newValue
  if (changes['blockerEnabled']) $elSettingsBlocker.setAttribute('checked', (changes['blockerEnabled'].newValue == true ? 'checked': false))
  if (changes['notificationsEnabled']) $elSettingsNotifs.setAttribute('checked', (changes['notificationsEnabled'].newValue == true ? 'checked': false))
  if (changes['statisticsEnabled']) $elSettingsStats.setAttribute('checked', (changes['statisticsEnabled'].newValue == true ? 'checked': false))
})

// Update settings as they change.
$elSettings.addEventListener('click', function (event) {
  values = {}
  values[event.target.id] = (event.target.checked == true ? true : false)
  if (event.target.id) chrome.storage.local.set(values, function() {})
})

// Open the project website on click of the header.
$elHeader.addEventListener('click', function () {
  window.open('https://git.io/crypto-miner-blocker')
})

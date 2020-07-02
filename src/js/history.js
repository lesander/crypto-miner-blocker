/**
 * Crypto Miner Blocker.
 * https://git.io/crypto-miner-blocker
 * Licensed under the MIT License
 * Copyright (c) 2017 All Rights Reserved.
 */

$elHistory = document.getElementsByClassName('history')[0]
$elRemoveHistory = document.getElementsByClassName('clear-history')[0]
caseHistoryIds = []

/**
 * We will construct a simple table to display the full stored history.
 * We obtain the full local storage and select all key-value pairs
 * starting with our prefix.
 */
chrome.storage.local.get(null, function(storage) {
  var history = []
  var table = ''
  for (var caseId in storage) {
    if (storage.hasOwnProperty(caseId) && caseId.startsWith('block_')) {
      history.push(storage[caseId])
      caseHistoryIds.push(caseId)
      table = constructTableData(storage[caseId]) + table
    }
  }
  if (history.length > 0) $elHistory.innerHTML = constructTable(table)
})

constructTableData = function (caseObject) {
  return `
  <tr>
    <td>${new Date(caseObject.date).toLocaleString()}</td>
    <td>${caseObject.page.title}</td>
    <td><a href="${caseObject.page.url}">${caseObject.page.url}</a></td>
    <td>${caseObject.request.url}</td>
  </tr>
  `
}

constructTable = function (tableData) {
  return `
  <table>
    <thead>
      <th>Date and Time</th>
      <th>Page Title</th>
      <th>Page URL</th>
      <th>Bad Script or Website</th>
    </thead>
    <tbody>${tableData}</tbody>
  </table>`
}

/**
 * Clear the accumulated history if the user wants to.
 * Should we remind the user that an incognito mode is available? ;)
 */
$elRemoveHistory.addEventListener('click', function (event) {
  if (!confirm("Are you sure you want to delete the Blocked History?")) return
  chrome.storage.local.remove(caseHistoryIds, function () {
    location.reload()
  })
})

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { Ci } = require("chrome");
const { Class } = require("sdk/core/heritage");
const xpcom = require("sdk/platform/xpcom");
let events = require("sdk/system/events");

/**
 * The goal of the content policy is to intercept loading URLs that are
 * potentially embarrassing. If REJECT_TYPE is returned, then the url loader
 * should prompt the user to open a new window in private browsing mode before
 * loading the URL.
 */
exports.pbContentPolicy = Class({
  extends: xpcom.Unknown,
  interfaces: ["nsIContentPolicy"],

  shouldLoad: function(aContentType, aContentLocation, aRequestOrigin,
                       aContext, aMimeType, aExtra) {
    // NOP (just setting up the machinery)
    if (aContentLocation.host.indexOf("chartbeat.com") != -1) {
      console.log("blocked ", aContentLocation.host);
      let e = {};
      e.data = aContentLocation.host;
      e.subject = this;
      events.emit("privacy-badger-block-element", e);
      return Ci.nsIContentPolicy.REJECT;
    }
    return Ci.nsIContentPolicy.ACCEPT;
  },

  shouldProcess: function(aContentType, aContentLocation, aRequestOrigin,
                          aContext, aMimeType, aExtra) {
    return Ci.nsIContentPolicy.ACCEPT;
  }
});

exports.pbContentPolicyFactory = xpcom.Factory({
  Component: exports.pbContentPolicy,
  contract: "@privacybadger/PrivacyBadgerContentPolicy",
  description: "Privacy Badger Content Policy"
});

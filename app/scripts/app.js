/*
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  
  // Sets app default base URL
  app.baseUrl = '/';
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  // Debug function to log data
  app.log = function(text) {
    console.log(text);
  }

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    // app.log('Our app is ready to rock!');
  });
  
  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  // go to the base URL
  app.redirectHome = function() {
    page.redirect(app.baseUrl);
  };

  // go to the profile page on 'profile-edit' event
  window.addEventListener('profile-edit', function() {
    if (page.current != '/profile') {
      page.redirect('/profile');
    }
  });

  // are we on the proposal list page?
  app.isProposalList = function(route) {
    return route == "proposals";
  }

  // display a toast message
  app.message = function(txt) {
    app.$.appToast.set("text", txt);
    app.$.appToast.open();
  }

  // open cfp auth dialog on the 'login' event
  window.addEventListener('login', function() {
    app.$.authDialog.open();
  });

  // perform a log-out on the 'logout' event
  window.addEventListener('logout', function() {
    app.$.auth.signOut()
    .then(function(e) {
      app.log(e);
      app.message("You are now logged out");
      app.fire('logout-success');
    })
    .catch(function(e) {
      app.log(e);
      app.message("Logout failed!");
      app.fire('logout-failure');
    });
  });

  // bubble login-success to the login dialog
  window.addEventListener('login-success', function(e) {
    app.$.authDialog.fire('login-success', e.details);
  });

  // bubble login-failure to the login dialog
  window.addEventListener('login-failure', function(e) {
    app.$.authDialog.fire('login-failure', e.details);
  });
  
  // act on login via provider
  window.addEventListener('login-provider', function(e) {
    app.$.auth.provider = e.detail.provider;
    app.$.auth.signInWithPopup()
    .then(function(e) {
      app.log(e);
      app.log(app.$.auth.user);
      app.message("Thanks for logging in!");
      app.fire('login-success');
    })
    .catch(function(e) {
      console.log(e);
      app.$.auth.signInWithRedirect()
      .then(function(e) {
        app.log(e);
        app.message("Thanks for logging in!");
        app.fire('login-success');
      })
      .catch(function(e) {
        app.log(e);
        app.message("Login failed");
        app.fire('login-failure');
      });
    });
  });

  // act on login with password
  window.addEventListener('login-password', function(e) {
    app.log(e);
    app.$.auth.signInWithEmailAndPassword(
      e.detail.email,
      e.detail.password
    )
    .then(function(e) {
      app.message("Thanks for logging in!");
      app.fire('login-success');
    })
    .catch(function(e) {
      app.message("Login failed. Did you provide the correct email or password?");
      app.fire('login-failure');
    });
  });

  // act on password reset
  window.addEventListener('reset-password', function(e) {
    app.log(e);
  });

  // act on signup with password
  window.addEventListener('signup-password', function(e) {
    app.log(e);
    app.$.auth.createUserWithEmailAndPassword(
      e.detail.email,
      e.detail.password
    )
    .then(function(e) {
      app.message("Thank you for registering!");
      app.fire('register-success');
    })
    .catch(function(e) {
      app.message("Sign-Up failed");
      app.fire('register-failure');
    });
  });

})(document);

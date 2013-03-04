#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import base64
import json
from boilerplate import BaseHandler

from api import ProjectsEndpoint, ProjectEndpoint

from google.appengine.api import memcache
from google.appengine.api import users

providers = {
    'Google'   : 'https://www.google.com/accounts/o8/id',
    'Yahoo'    : 'yahoo.com',
    'AOL'      : 'aol.com',
    'MyOpenID' : 'myopenid.com',
    # add more here
}

class MainHandler(BaseHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            self.render("app.html", {
                "title": " - Dashboard",
                "name":user.nickname(),
                "logout_url":users.create_logout_url("/login")
            })
        else:
            self.render('landing.html', {"title":""})

class LoginHandler(BaseHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            self.redirect('/')
        else:
            pros = {}
            for name, uri in providers.items():
                pros[name] = users.create_login_url(federated_identity=uri)
            self.render('login.html',{"title":" - Login","providers":pros})


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    # CLIENT SIDE PAGES (ROUTE TO MAIN)
    (r'/project/.+', MainHandler),
    ('/create', MainHandler),
    ('/settings', MainHandler),
    ('/help', MainHandler),
    ('/profile', MainHandler),
    # SERVER SIDE PAGES
    ('/login', LoginHandler),
    # RESTful API endpoints
    (r'/projects', ProjectsEndpoint),
    (r'/projects/([\dA-Za-z\-]+)', ProjectEndpoint),
], debug=True)

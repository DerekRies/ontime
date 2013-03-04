import time
import json
import datetime
import logging
import base64

from boilerplate import BaseHandler

from google.appengine.api import urlfetch
from google.appengine.api import memcache
from google.appengine.ext import ndb
from google.appengine.api import users


def makeJson(ndb_entities):
    return json.dumps([t.to_dict() for t in ndb_entities])


class ProjectsEndpoint(BaseHandler):
    """
    The /projects endpoint. Responsible for dealing with all projects at once

    /projects -> deals with all
    GET -> Get all projects
    POST -> Creates a new Tracker with post data
    PUT -> Bulk update all projects
    DELETE -> Delete all projects

    Permissions:
    Users can only access projects that belong to them
    
    """
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            self.write("good")
        else:
            self.abort(403)

    def post(self): # Creating a new Tracker
        # time.sleep(.5)
        user = users.get_current_user()

        if user:
            self.write(self.request.POST)
        else:
            self.abort(403)

    def put(self):
        self.write("PUT Trackers")

    def delete(self):
        self.write("DELETE Trackers")

class ProjectEndpoint(BaseHandler):
    """
    The /projects/id endpoint. Responsible for dealing with individual projects

    /projects/1234 -> deals with project of id 1234
    GET -> Get project 1234 and all of its logs
    POST -> Error
    PUT -> If there is a project 1234, update it. Else Error
    DELETE -> Deletes project 1234

    Permissions:
    Users can only access projects that belong to them
    
    """
    def get(self, id):
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            self.write("good")
        else:
            self.write("no user mate, fuck off")

    def post(self, id):
        self.write("There is no POST for a single Tracker")

    def put(self, id):
        # only updating incognito mode for now
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        time.sleep(1.5)
        if user:
            self.write("good")
        else:
            self.write(json.dumps({"status":"fail"}))


    def delete(self, id):
        # time.sleep(.5)
        user = users.get_current_user()
        if user:
            self.write("good")
        else:
            self.write("no user mate, fuck off")


# Models

class Project(ndb.Model):
    name = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    deadline = ndb.DateTimeProperty()
    description = ndb.StringProperty()
    founder = ndb.StringProperty()
    tags = ndb.StringProperty(repeated=True)
    complete = ndb.BooleanProperty(default=False)
    public_viewing = ndb.BooleanProperty(default=True)
    public_editing = ndb.BooleanProperty(default=False)

    @classmethod
    def query_projects(cls,ancestor_key):
        return cls.query(ancestor=ancestor_key)


class Task(ndb.Model):
    name = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    complete = ndb.BooleanProperty(default=False)
    time_logged = ndb.IntegerProperty(default=0)




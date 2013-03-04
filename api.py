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

def projectsJSON(projects):
    output = []
    for project in projects:
        k = project.key.urlsafe()
        project = project.to_dict()
        project["date"] = str(project["date"])
        project["key"] = k
        output.append(project)
    return json.dumps(output)


class ProjectsEndpoint(BaseHandler):
    """
    The /projects endpoint. Responsible for dealing with all projects at once

    /projects -> deals with all
    GET -> Get all projects
    POST -> Creates a new Tracker with post data
    PUT -> Bulk update all projects
    DELETE -> Delete all projects
    
    """
    def get(self): # Get All Projects
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            ancestor_key = ndb.Key("Account",user.user_id())
            projects = Project.query_projects(ancestor_key)
            self.write(projectsJSON(projects))
        else:
            self.abort(403)

    def post(self): # Creating a new Project
        user = users.get_current_user()

        if user:
            name = self.request.get('name')
            description = self.request.get('description')
            tags = self.request.get_all('tags[]')
            viewable = self.request.get('viewable')
            viewable = True if viewable == 'true' else False
            editable = self.request.get('editable')
            logging.info(editable)
            editable = True if editable == 'true' else False
            logging.info(editable)

            project = Project(parent=ndb.Key("Account", user.user_id()))

            project.populate(name=name,
                             description = description,
                             tags = tags,
                             user_id = user.user_id(),
                             founder = user.nickname(),
                             public_viewing = viewable,
                             public_editing = editable)

            key = project.put()

            self.write(key.urlsafe())

        else:
            self.abort(403)

    def put(self): # Batch Update Projects
        self.write("PUT Projects")

    def delete(self):
        self.write("DELETE Projects")



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
        self.write("There is no POST for a single Project")

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
class Account(ndb.Model):
    display_name = ndb.StringProperty()


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
    user_id = ndb.StringProperty(required=True)

    @classmethod
    def query_projects(cls,ancestor_key):
        return cls.query(ancestor=ancestor_key)


class Task(ndb.Model):
    name = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    complete = ndb.BooleanProperty(default=False)
    time_logged = ndb.IntegerProperty(default=0)




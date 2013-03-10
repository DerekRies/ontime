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
            logging.info("CMON QUIT FUCKING DYING HERE YOU BITCH")
            logging.info(key)
            keyurl = key.urlsafe()
            # logging.info(keyurl)

            self.write(keyurl)

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
        # time.sleep(3)
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            
            key = ndb.Key(urlsafe=id)
            project = key.get()
            if project and project.user_id == user.user_id():
                project = project.to_dict()
                project["date"] = str(project["date"])
                tasks = Task.query_tasks(key)
                output = []
                for task in tasks:
                    tkey = task.key.urlsafe()
                    task = task.to_dict()
                    task["date"] = str(task["date"])
                    task["key"] = tkey
                    output.append(task)
                self.write(json.dumps({"project":project,"tasks":output}))

            else:
                self.abort(404)

        else:
            self.write("no user mate, fuck off")

    def post(self, id):
        self.write("There is no POST for a single Project")

    def put(self, id):
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            key = ndb.Key(urlsafe=id)
            project = key.get()
            if project and project.user_id == user.user_id():
                project.name = self.request.get("name")
                project.description = self.request.get("description")
                project.tags = self.request.get_all("tags[]")
                project.put()
                self.write(json.dumps({"status":"success"}))
            else:
                self.write(json.dumps({"status":"fail"}))
                

    def delete(self, id):
        # time.sleep(.5)
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            key = ndb.Key(urlsafe=id)
            project = key.get()
            if project and project.user_id == user.user_id():
                key.delete()
                self.write(json.dumps({"status":"success"}))
            else:
                self.write(json.dumps({"status":"fail"}))
        else:
            self.write("no user mate, fuck off")



class TaskEndpoint(BaseHandler):
    """
    The /task/:id endpoint, handles individual tasks
    GET -> Return relevant data, not needed though
    POST -> NOTHING
    PUT -> Update a given task
    DELETE -> Delete a given task
    """
    def get(self,id):
        self.write("no endpoint")
    def post(self,id):
        self.write("no endpoint")
    def put(self,id):
        """
        The edit action really only has to worry about several of the fields:
        1. task name
        2. Complete status
        3. Priority
        4. Time Logged
        """
        self.response.headers['Content-Type'] = 'application/json'
        tkey = ndb.Key(urlsafe=id)
        task = tkey.get()

        name = self.request.get('name')
        if name != '':
            logging.info(name)
            task.name = name

        complete = self.request.get('complete')
        if complete != '':
            # also don't update that field
            complete = True if complete == 'true' else False
            logging.info(complete)
            task.complete = complete

        time_logged = self.request.get('time_logged')
        if time_logged != '':
            logging.info(time_logged)
            task.time_logged = int(time_logged)

        priority = self.request.get('priority')
        if priority != '':
            logging.info(priority)
            task.priority = int(priority)

        task.put()



        self.write(json.dumps({"status": "success","key":id}))
    def delete(self,id):
        user = users.get_current_user()
        if user:
            key = ndb.Key(urlsafe=id)
            task = key.get()
            if task and task.user_id == user.user_id():
                key.delete()
                self.write("true")
            else:
                self.write("false")
        else:
            self.write("no user")

class TasksEndpoint(BaseHandler):
    """
    The /task endpoint, handles multiple tasks
    GET -> Return all tasks associated with this user_id
    POST -> Create a new Task
    PUT -> Update a batch of tasks
    DELETE -> Delete a batch of tasks

    """

    def get(self):
        self.write("getting all tasks for user")
    def post(self):
        time.sleep(5)
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
        if user:
            project_key_str = self.request.get('projectKey')
            project_key = ndb.Key(urlsafe=project_key_str)

            name = self.request.get('name')
            category = self.request.get('category')
            priority = int(self.request.get('priority'))
            task = Task(parent=project_key)

            task.populate(name=name,
                          category=category,
                          priority=priority)

            task_key = task.put()
            self.write(json.dumps({"status":"success","task_key":task_key.urlsafe()}))
        else:
            self.write("No user")
    def put(self):
        self.write("updating task batch")
    def delete(self):
        self.write("deleting task batch")



# Models
class Account(ndb.Model):
    display_name = ndb.StringProperty()


class Project(ndb.Model):
    name = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)
    deadline = ndb.DateTimeProperty()
    description = ndb.TextProperty(indexed=False)
    founder = ndb.StringProperty(indexed=False)
    tags = ndb.StringProperty(repeated=True, indexed=False)
    complete = ndb.BooleanProperty(default=False)
    public_viewing = ndb.BooleanProperty(default=True, indexed=False)
    public_editing = ndb.BooleanProperty(default=False, indexed=False)
    user_id = ndb.StringProperty(required=True, indexed=False)

    @classmethod
    def query_projects(cls,ancestor_key):
        return cls.query(ancestor=ancestor_key)


class Task(ndb.Model):
    name = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True, indexed=False)
    complete = ndb.BooleanProperty(default=False)
    time_logged = ndb.IntegerProperty(default=0, indexed=False)
    priority = ndb.IntegerProperty(default=1, indexed=False)
    category = ndb.StringProperty(indexed=False)

    @classmethod
    def query_tasks(cls,ancestor_key):
        return cls.query(ancestor=ancestor_key)






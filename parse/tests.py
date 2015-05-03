import unittest

from parse_rest.connection import register, ParseBatcher, SessionToken
from parse_rest.user import User
from parse_rest.datatypes import Object, Function
"""
# Prod
register(
  "8fhsO5d7WTt6c7ffpVrPpHTVvuAi6vArrciyt8cK",
  "tBnfG7a0P38w0ka3jWVTRkqcDxMIOdUXxNv8sZFp",
  master_key="jzR5jZnCeVphODcgqP4Ee7ZJLzxGTGR51SoI6dIC",
)
"""

# Test
def register_app(**kw):
  register(
    "KkFLXaPKXsFkBcTonFsPeNHWJmoIX1K4yvIrmI8C",
    "6qNCyI4r8YGuMnsh5bfejjQnWevfGWBnfP6vebeX",
    #master_key="MYSUyoDbkeOtEAht7lKr60EvjCXmHntd02e4wNkS",
    **kw
  )

class Task(Object):
  pass

class Ping(Object):
  pass

sample_users = [
  ("baracky", "usanumber1", "baracky.obama@gmail.com"),
  ("somethingelse", "usanumber4", "ssss@gmail.com"),
]

def signup_sample_users():
  for username, pw, email in sample_users:
    User.signup(username, pw, email=email)

def delete_sample_users():
  for username, password, email in sample_users:
    try:
      u = User.login(username, password)
      u.delete()
    except:
      pass

class TestPingBox(unittest.TestCase):
  @classmethod
  def setUpClass(cls):
    delete_sample_users()
    signup_sample_users()
    User.signup('redsox55', 'secure123', email='fred@aol.com')
    ParseBatcher().batch_delete(Task.Query.all())

  @classmethod
  def tearDownClass(cls):
    delete_sample_users()
    u = User.login('redsox55', 'secure123')
    with SessionToken(u.sessionToken):
      ParseBatcher().batch_delete(Task.Query.all())
    u.delete()

  def setUp(self):
    self.user = User.Query.get(username='redsox55')

  def tearDown(self):
    u = User.login('redsox55', 'secure123')
    with SessionToken(u.sessionToken):
      ParseBatcher().batch_delete(Task.Query.all())

  def test_create_task(self):
    assignTask = Function("assignTask")

    u = User.login('redsox55', 'secure123')
    with SessionToken(u.sessionToken):
      title = 'w45h45r4g4h'
      assignTask(
        title=title,
        description="See title",
        watchers=[user[2] for user in sample_users],
        email=None,
      )

    tasks = Task.Query.all()
    self.assertEqual(len(tasks), 1)
    t = tasks[0]
    self.assertEqual(t.title, title)
    self.assertEqual(t.creator.objectId, u.objectId)
    self.assertEqual(t.score, 0)
    self.assertEqual(len(t.watchers), len(sample_users))

    self.assertTrue(all(w["className"] == '_User' for w in t.watchers))

  def test_create_ping(self):
    assignTask = Function("assignTask")
    ping = Function("ping")
    u = User.login('redsox55', 'secure123')
    with SessionToken(u.sessionToken):
      title = 'serha34g444'
      assignTask(
        title=title,
        description="Send a ping to this task",
        watchers=[u[2] for u in sample_users],
        score=2,
      )
      task = Task.Query.get(title=title)
      self.assertEqual(task.score, 0)
      ping(taskID=task.objectId)

    task = Task.Query.get(objectId=task.objectId)
    self.assertEqual(task.score, 1)





"""
  def test_tasks_by_user(self):
    pass

  def test_tasks_by_watcher(self):
    pass

  def test_tasks_by_creator(self):
    pass

  def test_initial_score_is_zero(self):
    pass

  def test_one_user_pings_another(self):
    pass

  def test_score_increments(self):
    pass
"""


if __name__ == '__main__':
  register_app()
  unittest.main()


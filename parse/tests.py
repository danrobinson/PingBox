import unittest

from parse_rest.connection import register, ParseBatcher, SessionToken
from parse_rest.user import User
from parse_rest.datatypes import Object
"""
# Prod
register(
  "8fhsO5d7WTt6c7ffpVrPpHTVvuAi6vArrciyt8cK",
  "tBnfG7a0P38w0ka3jWVTRkqcDxMIOdUXxNv8sZFp",
  master_key="jzR5jZnCeVphODcgqP4Ee7ZJLzxGTGR51SoI6dIC",
)
"""

# Test
register(
  "KkFLXaPKXsFkBcTonFsPeNHWJmoIX1K4yvIrmI8C",
  "6qNCyI4r8YGuMnsh5bfejjQnWevfGWBnfP6vebeX",
  master_key="MYSUyoDbkeOtEAht7lKr60EvjCXmHntd02e4wNkS",
)

class Task(Object):
  pass


sample_users = [
  ("baracky", "usanumber1", "baracky.obama@gmail.com"),
  ("somethingelse", "usanumber4", "ssss@gmail.com"),
]

def signup_sample_users():
  for username, pw, email in sample_users:
    print "signing up %s" % username
    User.signup(username, pw, email=email)

def delete_sample_users():
  for username, password, email in sample_users:
    print "deleting %s" % username
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

  @classmethod
  def tearDownClass(cls):
    delete_sample_users()
    u = User.login('redsox55', 'secure123')
    u.delete()

  def setUp(self):
    self.user = User.Query.get(username='redsox55')

  def test_create_task(self):
    task = Task(
      title="Write tests for program",
      description="See title",
      watchers=[u[2] for u in sample_users],
      email=None,
    )
    with self.assertRaises(Exception):
      task.save('redsox55', 'secure123')

    u = User.login('redsox55', 'secure123')
    with SessionToken(u.sessionToken):
      task.save()

    # make sure those tasks were created
    task = Task.Query.filter()

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
barack = User.Query.get(username="barack")
barack.delete()

user = User.signup(
  username="barack",
  password="usanumber1",
  email="barack.obama@gmail.com",
)

"""

if __name__ == '__main__':
  unittest.main()


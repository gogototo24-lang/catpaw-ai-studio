import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('preflight', Path(__file__).parents[1]/'factory/preflight_a.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
class PreflightTests(unittest.TestCase):
    def fixture(self):
        return ({'pipeline_id':'A','provider':'runninghub','count':1,'duration_seconds':5,'auto_publish':False,'paid_enabled':False,'max_cost_twd':5,'credential_configured':True,'webapp_id':'123','mapping_verified':True,'node_mapping':[{'nodeId':'1','fieldName':'image','fieldValue':'{{IMAGE}}'},{'nodeId':'2','fieldName':'prompt','fieldValue':'{{PROMPT}}'}],'character_id':'X','asset_id':'Y','batch_approved':True}, {'tables':{'characters':[{'character_id':'X','canon_status':'CANON_LOCKED','asset_status':'READY','review_status':'APPROVED'}],'assets':[{'asset_id':'Y','character_id':'X','approved':True,'url':'https://example.com/test.png'}]}})
    def test_ready_does_not_execute(self):
        c,d=self.fixture(); r=m.check(c,d)
        self.assertEqual(r['readiness'],'ready_for_manual_enable')
        self.assertFalse(r['submitted']); self.assertFalse(r['live_execution_supported'])
    def test_other_lines_and_batch_blocked(self):
        for field,value in [('pipeline_id','B'),('pipeline_id','C'),('pipeline_id','D'),('count',2),('paid_enabled',True),('auto_publish',True),('max_cost_twd',None),('batch_approved',False),('mapping_verified',False)]:
            c,d=self.fixture();c[field]=value
            self.assertEqual(m.check(c,d)['readiness'],'blocked')
    def test_canon_cannot_be_claimed_by_payload(self):
        c,d=self.fixture(); d['tables']['characters'][0]['canon_status']='MASTER_FOUND'; c['canon_status']='CANON_LOCKED'
        self.assertIn('CHARACTER_CANON_NOT_LOCKED',m.check(c,d)['blocking_reasons'])

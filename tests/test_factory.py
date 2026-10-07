import importlib.util
import tempfile
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('factory', Path(__file__).parents[1] / 'factory/mock_factory.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class FactoryTests(unittest.TestCase):
    def test_four_lines_and_idempotency(self):
        with tempfile.TemporaryDirectory() as root:
            for line in m.LINES:
                job = m.sample(line)
                result = m.run(job, root)
                self.assertEqual(result['state'], 'ready')
                self.assertFalse(result['published'])
                self.assertEqual(result['cost']['actual'], 0)
                self.assertTrue(all(a['mock'] and not a['playable'] for a in result['assets']))
                self.assertEqual(result, m.run(job, root))
                job['brief'] = 'changed'
                with self.assertRaises(m.GateError): m.run(job, root)
    def test_paid_and_publish_rejected(self):
        with tempfile.TemporaryDirectory() as root:
            for field in ('paid_enabled', 'auto_publish'):
                job = m.sample('A'); job['controls'][field] = True
                with self.assertRaises(m.GateError): m.run(job, root)
            job = m.sample('A'); job['mode'] = 'live'
            with self.assertRaises(m.GateError): m.run(job, root)
    def test_review_is_not_implicit(self):
        with tempfile.TemporaryDirectory() as root:
            job = m.sample('C'); job['approval']['output'] = 'pending'
            result = m.run(job, root)
            self.assertEqual(result['state'], 'awaiting_review')
            self.assertFalse(result['success'])
            job = m.sample('B'); job['approval']['input'] = 'pending'
            with self.assertRaises(m.GateError): m.run(job, root)

if __name__ == '__main__': unittest.main()

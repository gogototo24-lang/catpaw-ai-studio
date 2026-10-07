"""CatPaw Factory v0.2: offline execution, no network or publishing adapters."""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

VERSION = 'factory.job.v0.2'
STATES = ('draft', 'validated', 'queued', 'running', 'awaiting_review', 'ready', 'failed')
LINES = {
 'A': {'label': '貓掌／喵台灣', 'steps': ['prompt', 'first_frame', 'video', 'audio', 'compose'], 'candidate': 'RunningHub existing video adapter', 'missing': ['RUNNINGHUB_API_KEY', 'WebApp ID and actual nodeInfo mapping', 'approved character/master asset and CANON database gate']},
 'B': {'label': '成人時尚寫真', 'steps': ['identity', 'image', 'quality', 'package'], 'candidate': 'RunningHub dedicated image AI App', 'missing': ['dedicated image App ID and nodeInfo', 'RUNNINGHUB_API_KEY', 'adult identity/reference authorization']},
 'C': {'label': '音樂 MV', 'steps': ['lyrics', 'voice', 'music', 'video', 'mix', 'compose'], 'candidate': 'AI Music Studio v2 existing compose service', 'missing': ['API base and service health', 'approved audio/video inputs', 'real singing provider if vocals required', 'durable MV job/result storage']},
 'D': {'label': '長篇漫劇', 'steps': ['script', 'storyboard', 'video', 'voice', 'compose', 'package'], 'candidate': 'AI Music Studio v2 per-segment compose service', 'missing': ['episode/shot bible', 'approved assets', 'segment composition config', 'durable shot DAG/resume store', 'API base and service health']}
}

class GateError(ValueError):
    pass

class MockProvider:
    """Provider interface: validate_inputs, submit, poll, fetch_outputs, normalize_result."""
    def validate_inputs(self, job, step):
        if job['mode'] != 'mock' or job['controls'] != {'paid_enabled': False, 'auto_publish': False}:
            raise GateError('Only offline mock is supported')
    def submit(self, job, step):
        self.validate_inputs(job, step)
        return 'mock-' + hashlib.sha256((job['job_id'] + step).encode()).hexdigest()[:16]
    def poll(self, task_id):
        return {'task_id': task_id, 'status': 'generated', 'mock': True}
    def fetch_outputs(self, job, step, task_id):
        return {'asset_id': task_id + '-asset', 'kind': 'mock_manifest', 'mock': True,
                'playable': False, 'asset_url': '', 'step': step}
    def normalize_result(self, output):
        return output


def validate(job):
    required = ['schema_version', 'job_id', 'pipeline_id', 'mode', 'controls', 'cost', 'approval', 'brief']
    if not isinstance(job, dict) or any(k not in job for k in required):
        raise GateError('Missing required job fields')
    if job['schema_version'] != VERSION or job['pipeline_id'] not in LINES:
        raise GateError('Unsupported version or pipeline')
    if not isinstance(job['job_id'], str) or not job['job_id'].strip():
        raise GateError('Invalid job_id')
    if not isinstance(job['brief'], str) or not job['brief'].strip():
        raise GateError('Missing brief')
    MockProvider().validate_inputs(job, '')
    if job['cost'] != {'currency': 'TWD', 'estimated': 0, 'reserved': 0, 'actual': 0, 'provider_credits': 0}:
        raise GateError('Mock costs must be zero')
    if job['approval'].get('input') != 'approved_mock' or job['approval'].get('publish') != 'pending':
        raise GateError('Mock input approval required; publishing remains pending')


def run(job, root):
    validate(job)
    root = Path(root)
    # Never use a user job ID as a path component.
    folder = root / hashlib.sha256(job['job_id'].encode()).hexdigest()[:24]
    fingerprint = hashlib.sha256(json.dumps(job, sort_keys=True).encode()).hexdigest()
    result_path = folder / 'result.json'
    if result_path.exists():
        old = json.loads(result_path.read_text())
        if old['input_hash'] != fingerprint:
            raise GateError('job_id reused with different input')
        return old
    folder.mkdir(parents=True, exist_ok=True)
    result = {**job, 'input_hash': fingerprint, 'state': 'draft', 'events': [], 'steps': [],
              'assets': [], 'missing_external_settings': LINES[job['pipeline_id']]['missing'],
              'next_provider_candidate': LINES[job['pipeline_id']]['candidate'],
              'next_provider_enabled': False, 'published': False, 'mock': True}
    def transition(state):
        result['state'] = state
        result['events'].append({'state': state, 'at': datetime.now(timezone.utc).isoformat()})
    transition('draft')
    transition('validated')
    transition('queued')
    transition('running')
    provider = MockProvider()
    try:
        for name in LINES[job['pipeline_id']]['steps']:
            task = provider.submit(job, name)
            receipt = provider.poll(task)
            asset = provider.normalize_result(provider.fetch_outputs(job, name, task))
            result['steps'].append({'step_id': name, 'provider': 'mock', 'provider_task_id': task,
                                    'state': receipt['status'], 'mock': True, 'attempt': 1})
            result['assets'].append(asset)
            (folder / (name + '.json')).write_text(json.dumps(asset, ensure_ascii=False, indent=2))
        transition('awaiting_review')
        if job['approval'].get('output') == 'approved_mock':
            transition('ready')
        elif job['approval'].get('output') != 'pending':
            raise GateError('Invalid output approval')
    except Exception as exc:
        result['error'] = str(exc)
        transition('failed')
    result['success'] = result['state'] == 'ready'
    result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    return result


def sample(line):
    return {'schema_version': VERSION, 'job_id': 'factory-v02-' + line,
            'pipeline_id': line, 'mode': 'mock', 'brief': LINES[line]['label'] + '完整離線 Mock 測試',
            'controls': {'paid_enabled': False, 'auto_publish': False},
            'cost': {'currency': 'TWD', 'estimated': 0, 'reserved': 0, 'actual': 0, 'provider_credits': 0},
            'approval': {'input': 'approved_mock', 'output': 'approved_mock', 'publish': 'pending'}}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', default='factory/results')
    parser.add_argument('--job', help='Single job JSON; omit to execute A/B/C/D fixtures')
    args = parser.parse_args()
    jobs = [json.loads(Path(args.job).read_text())] if args.job else [sample(x) for x in LINES]
    results = [run(x, args.output) for x in jobs]
    print(json.dumps(results, ensure_ascii=False, indent=2))
    raise SystemExit(0 if all(r['state'] in ('ready', 'awaiting_review') for r in results) else 1)

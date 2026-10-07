"""Offline A-only RunningHub readiness check; cannot submit or publish."""
import argparse
import json
from pathlib import Path

def check(config, canon):
    errors = []
    def require(ok, reason):
        if not ok: errors.append(reason)
    require(config.get('pipeline_id') == 'A', 'ONLY_A_ALLOWED')
    require(config.get('provider') == 'runninghub', 'PROVIDER_MUST_BE_RUNNINGHUB')
    require(config.get('count') == 1, 'SINGLE_TASK_ONLY')
    require(config.get('duration_seconds') == 5, 'TEST_DURATION_MUST_BE_5_SECONDS')
    require(config.get('auto_publish') is False, 'AUTO_PUBLISH_MUST_BE_DISABLED')
    require(config.get('paid_enabled') is False, 'PREFLIGHT_MUST_NOT_ENABLE_PAYMENT')
    budget = config.get('max_cost_twd')
    require(type(budget) in (int, float) and 0 < budget <= 100 and budget == budget, 'BOUNDED_BUDGET_REQUIRED_0_TO_100_TWD')
    require(config.get('credential_configured') is True, 'RUNNINGHUB_SECRET_NOT_CONFIRMED')
    app = config.get('webapp_id')
    require(isinstance(app, str) and app.isdigit(), 'ACTUAL_WEBAPP_ID_REQUIRED')
    mapping = config.get('node_mapping')
    valid = isinstance(mapping, list) and bool(mapping) and all(isinstance(n, dict) and all(isinstance(n.get(k), str) and n[k].strip() for k in ('nodeId','fieldName','fieldValue')) for n in mapping)
    require(valid and config.get('mapping_verified') is True, 'ACTUAL_NODE_MAPPING_NOT_VERIFIED')
    if valid:
        require(any('{{IMAGE}}' in n['fieldValue'] for n in mapping), 'IMAGE_MAPPING_REQUIRED')
        require(any('{{PROMPT}}' in n['fieldValue'] for n in mapping), 'PROMPT_MAPPING_REQUIRED')
    tables = canon.get('tables', {})
    chars = tables.get('characters', [])
    char = next((c for c in chars if c.get('character_id') == config.get('character_id')), None)
    require(char is not None, 'CHARACTER_NOT_FOUND')
    if char:
        require(char.get('canon_status') == 'CANON_LOCKED', 'CHARACTER_CANON_NOT_LOCKED')
        require(char.get('asset_status') == 'READY', 'CHARACTER_ASSET_NOT_READY')
        require(char.get('review_status') in ('APPROVED','PASS'), 'CHARACTER_REVIEW_NOT_APPROVED')
    asset = next((a for a in tables.get('assets', []) if a.get('asset_id') == config.get('asset_id') and a.get('character_id') == config.get('character_id')), None)
    require(asset is not None, 'ASSET_NOT_FOUND')
    if asset:
        require(asset.get('approved') is True, 'ASSET_NOT_APPROVED')
        require(isinstance(asset.get('url'), str) and asset['url'].startswith('https://'), 'HTTPS_ASSET_URL_REQUIRED')
    require(config.get('batch_approved') is True, 'SINGLE_PAID_BATCH_NOT_APPROVED')
    return {'version':'factory.preflight.v0.3', 'readiness':'ready_for_manual_enable' if not errors else 'blocked',
            'blocking_reasons':errors, 'submitted':False, 'paid_enabled':False, 'auto_publish':False,
            'actual_cost_twd':0, 'live_execution_supported':False,
            'note':'Readiness only; URL accessibility, live secrets, pricing and App capabilities still require verification.'}

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--config', required=True)
    p.add_argument('--canon', required=True)
    p.add_argument('--output', required=True)
    a = p.parse_args()
    result = check(json.loads(Path(a.config).read_text()), json.loads(Path(a.canon).read_text()))
    Path(a.output).write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result['readiness'] == 'ready_for_manual_enable' else 2)

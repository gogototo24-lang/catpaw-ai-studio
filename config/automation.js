window.CATPAW_AUTOMATION={
version:"2.0",
enabled:false,
test_mode:true,
provider:"n8n",
webhook_url:"",
max_retries:2,
retry_delay_ms:1500,
request_timeout_ms:12000,
send_fields:["job_id","character","duration","style","status","production_pack","created_at"],
allowed_status:["草稿","待生成","待剪輯","完成"],
security_note:"只有 enabled=true 且 webhook_url 為 https URL 時才允許送出；公開 GitHub 不保存私密 webhook、API key 或 token。"
};
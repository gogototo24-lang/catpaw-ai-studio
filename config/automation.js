window.CATPAW_AUTOMATION={
version:"1.8",
enabled:false,
test_mode:true,
provider:"n8n",
webhook_url:"",
max_retries:2,
retry_delay_ms:1500,
send_fields:["job_id","character","duration","style","status","production_pack","created_at"],
allowed_status:["草稿","待生成","待剪輯","完成"],
security_note:"公開前端不保存私密 webhook、API key 或 token；正式網址由安全後端或部署環境注入。"
};
window.CATPAW_AUTOMATION={
version:"1.6",
enabled:false,
provider:"n8n",
webhook_url:"",
send_fields:["character","duration","style","prompt","status"],
allowed_status:["草稿","待生成","待剪輯","完成"],
security_note:"不要把 API key、token 或私密 webhook 寫入公開 GitHub。正式串接時由安全後端或環境變數注入。"
};
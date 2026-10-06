window.CATPAW_PROVIDERS={
version:"2.0",
default_video:"pixverse",
video:{
 pixverse:{enabled:false,mode:"n8n_proxy",label:"PixVerse"},
 flow:{enabled:false,mode:"manual_handoff",label:"Flow"}
},
image:{openai:{enabled:false,mode:"n8n_proxy",label:"OpenAI Images"}},
rules:["前端不保存 provider API key","正式生成經 n8n/安全後端代理","角色 CANON 與 Master 狀態通過後才進生成"]
};
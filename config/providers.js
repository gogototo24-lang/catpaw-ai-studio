window.CATPAW_PROVIDERS={
version:"2.3",
factory_mode:"p2_locked",
paid_enabled:false,
publish_enabled:false,
p2:{
 pipeline_id:"A",
 provider:"runninghub",
 live_enabled:false,
 publish_enabled:false,
 max_budget_twd:15,
 duration_seconds:5,
 mode:"single_job_only"
},
defaults:{
 image:"factory_mock_image",
 video:"factory_mock_video",
 audio:"factory_mock_audio",
 mv:"factory_mock_mv",
 drama:"factory_mock_drama"
},
video:{
 runninghub:{enabled:false,mode:"worker_proxy",label:"RunningHub",paid:true},
 pixverse:{enabled:false,mode:"n8n_proxy",label:"PixVerse",paid:true},
 flow:{enabled:false,mode:"manual_handoff",label:"Flow",paid:false},
 factory_mock_video:{enabled:true,mode:"local_mock",label:"Factory Video Mock",paid:false}
},
image:{
 openai:{enabled:false,mode:"n8n_proxy",label:"OpenAI Images",paid:true},
 factory_mock_image:{enabled:true,mode:"local_mock",label:"Factory Image Mock",paid:false}
},
audio:{
 ai_music_studio_v2:{enabled:true,mode:"remote_service",label:"AI Music Studio v2",paid:false},
 factory_mock_audio:{enabled:true,mode:"local_mock",label:"Factory Audio Mock",paid:false}
},
music:{
 yue2:{enabled:false,mode:"self_hosted_gpu",label:"YuE2 Full Song",paid:false,requires:["YUE2_API_URL","MUSIC_SERVICE_TOKEN"]},
 ace_step:{enabled:false,mode:"self_hosted_gpu",label:"ACE-Step",paid:false,requires:["ACESTEP_API_URL","MUSIC_SERVICE_TOKEN"]},
 musicgen:{enabled:true,mode:"local_or_gpu",label:"MusicGen BGM",paid:false}
},
mv:{
 factory_mock_mv:{enabled:true,mode:"local_mock",label:"Factory MV Mock",paid:false}
},
drama:{
 factory_mock_drama:{enabled:true,mode:"local_mock",label:"Factory Drama Mock",paid:false}
},
rules:[
 "前端不保存 provider API key",
 "paid_enabled=false 時禁止真實付費 provider",
 "publish_enabled=false 時禁止任何自動發布",
 "所有 Mock 資產不可進正式發布佇列",
 "B 產線只允許成年、非露骨、合法授權的時尚寫真內容"
]
};
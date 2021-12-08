'ui';
var content_add;
ui.layout(
    <scroll>
    <vertical padding="16">
        <text textSize="16sp" textColor="blue" text="提示："/>
        <text textSize="16sp" textColor="blue" text="一、填写示范：依次填写每位密码的屏幕坐标"/>
        <text textSize="16sp" textColor="black" text="100,200"/>
        <text textSize="16sp" textColor="black" text="200,350"/>
        <text textSize="16sp" textColor="blue" text="二、获取坐标的方法：开发者模式中的“显示指针位置”，然后录屏或截图，最后测试运行，检查脚本操作的轨迹"/>
        <text textSize="16sp" textColor="blue" text="三、第三步需要授予读取和修改手机信息的权限(不勾选则不执行)"/>
        <text textSize="16sp" textColor="blue" text="四、自动亮度开启，亮度设置会失效，媒体音量更改一般不会影响闹钟和来电"/>

        <text textSize="16sp" textColor="red" text="1.点亮屏幕后："/>
        <horizontal>
          <text textSize="16sp" textColor="red" text="滑动"/>
          <input id="swipe_counts" inputType="number" textSize="16sp"/>
          <text textSize="16sp" textColor="red" text="次屏幕，滑动时间为"/>
          <input id="swipe_time" inputType="number" textSize="16sp"/>
          <text textSize="16sp" textColor="red" text="毫秒"/>
        </horizontal>
  
        <text textSize="16sp" textColor="red" text="2.点击或滑动的屏幕坐标"/>
        <input id="origin" textSize="16sp" hint="如示例所示：XY坐标之间用英文逗号隔开，每组坐标之间用回车隔开，无密码则不填"/>
  
        <horizontal>
        <text textColor="red" textSize="16sp">密码类型:</text>
        <spinner id="pwd_type" entries="滑动图案|点按的数字、字母"/>
        </horizontal>
  
        <horizontal>
          <checkbox id="ck_step3" checked='false'/>
          <text textSize="16sp" textColor="red" text="3.更改音量和屏幕亮度"/>
        </horizontal>
        <text textSize="16sp" textColor="red" text="屏幕亮度设置为:"/>
        <input id="brightnes" textSize="16sp" inputType="number" hint="0-1024，需自己多测试"/>
        <horizontal>
          <text textSize="16sp" textColor="red" text="媒体音量设置为:"/>
          <input id="soundvolum" textSize="16sp" inputType="number"/>
          <text textSize="16sp" textColor="red" text="%"/>
        </horizontal>
  
        <button id='save' text="保存配置" textSize="20sp"/>
        <button id='start' text="测试运行" textSize="20sp"/>

        <text textSize="16sp" textColor="black" text="保存结果："/>
        <text id="output"></text>
    </vertical>
    </scroll>
)
ui.save.click(function(){ 
  content_add = '';
  let swipe_counts = ui.swipe_counts.text();
  let swipe_time = ui.swipe_time.text();
  let save_origin = ui.origin.text();
  let pwdType = ui.pwd_type.getSelectedItemPosition();
  let ckStep3 = ui.ck_step3.checked;
  let brightnes = ui.brightnes.text();
  let soundvolum = ui.soundvolum.text();
  
  storage.put('swipe_counts', swipe_counts); 
  storage.put('swipe_time', swipe_time); 
  storage.put('save_origin', save_origin); 
  storage.put('pwdType', pwdType); 
  storage.put('ckStep3', ckStep3); 
  storage.put('brightnes', brightnes); 
  storage.put('soundvolum', soundvolum); 

  var array = convert_string(save_origin)
  if(!save_origin) add_display('保存为无密码')
  else {
    add_display('成功保存了'+(array.length - 1) +'位密码:');
    for(i = 1; i < array.length; i++){add_display('第'+i+'位 横坐标:'+array[i][0]+'，纵坐标:'+array[i][1]);}
  };
  
});

ui.start.click(function(){
  ui.output.setText('即将测试，请在5秒内按下电源键！！！'); 
  let save_origin = ui.origin.text();
  let swipe_counts = ui.swipe_counts.text();
  let swipe_time = ui.swipe_time.text();
  let pwdType = ui.pwd_type.getSelectedItemPosition();
  
  let ckStep3 = ui.ck_step3.checked;
  let brightnes = ui.brightnes.text();
  let soundvolum = ui.soundvolum.text();

  unlock_array = convert_string(save_origin);    
  threads.start(function(){
    sleep(5000);ui.output.setText('成功了没>_<');
    unlock_screen(unlock_array, swipe_counts, swipe_time, pwdType);
    light_sound(ckStep3, brightnes, soundvolum);
  });
});

//读取配置
var storage = storages.create("67pwd");
if(storage.get("swipe_counts")) ui.swipe_counts.setText(storage.get("swipe_counts"));
if(storage.get("swipe_time")) ui.swipe_time.setText(storage.get("swipe_time"));
if(storage.get("save_origin")) ui.origin.setText(storage.get("save_origin"));
if(storage.get("pwdType")) ui.pwd_type.setSelection(storage.get("pwdType"));
if(typeof(storage.get("ckStep3")) == 'boolean') ui.ck_step3.checked = storage.get("ckStep3");
if(storage.get("brightnes")) ui.brightnes.setText(storage.get("brightnes"));
if(storage.get("soundvolum")) ui.soundvolum.setText(storage.get("soundvolum"));

//息屏验证
threads.start(function(){
    if(!device.isScreenOn()) {
      unlock_screen(convert_string(storage.get("save_origin")), 
                    storage.get("swipe_counts"), 
                    storage.get("swipe_time"), 
                    storage.get("pwdType")
                   );
      
      light_sound(storage.get("ckStep3"), 
                  storage.get("brightnes"), 
                  storage.get("soundvolum")
                 );
      
      hamibot.exit();   
    }
});

//功能函数
//依次显示
function add_display(content) {
    content_add = content_add + '\n' + content;
    ui.output.setText(content_add);    
}
//字符串转换为二维数组
function convert_string(string_array){
  if(!string_array) return false;
  var two_dimensional = string_array.split('\n');
  var new_array = new Array();
  var two_text;
  for(i = 0; i < two_dimensional.length; i++){
    two_text = two_dimensional[i].split(',');
    new_array[i+1] = new Array();
    new_array[i+1][0] = two_text[0];
    new_array[i+1][1] = two_text[1];
  }
  new_array[0] = 1000;
  return new_array;
}
//环节1、2 解锁屏幕
function unlock_screen(pwd_array, counts, time, click_Or_swipe){
  device.wakeUp();sleep(1000);
  while(counts--){swipe(device.width/2, device.height*0.8, device.width/2, device.height*0.2, time);sleep(1000);}
  sleep(3000);
  if(pwd_array.length > 1){
    if(click_Or_swipe == 0) gesture.apply(null,pwd_array)    
    else{for(i = 1; i < pwd_array.length; i++){click(Number(pwd_array[i][0]),Number(pwd_array[i][1]));sleep(1000);}}           
  }
}
//环节3 亮度和音量
function light_sound(ck_step3, light, sound){
  if(!ck_step3) return false;
  sleep(1000);device.setBrightness(light);sleep(2000);
	sleep(1000);device.setMusicVolume(device.getMusicMaxVolume()*sound/100);
}


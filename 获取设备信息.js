'ui';
var content_add = '';
ui.layout(
    <scroll>
    <vertical padding="16">
    <button id='start' text="显示配置信息" textSize="20sp"/>
    <text id="output"></text>
    </vertical>
    </scroll>
)

ui.start.click(function(){
  let statu_light,statu_charging;
  if(device.getBrightnessMode()) statu_light = 'Yes'
  else statu_light = 'No';
  if(device.isCharging()) statu_charging = 'Yes'
  else statu_charging = 'No';
  
    var str = "硬件信息";
    str += "\n品牌:" + device.brand;
    str += "\n屏幕宽:" + device.width;
    str += "\n屏幕高:" + device.height;
    str += "\n型号:" + device.model;
    str += "\t名称:" + device.product;
    str += "\n安卓版本:" + device.release;
    str += "\tAPI: " + device.sdkInt;
    str += "\n可用内存: " + (device.getAvailMem()/1000000000).toFixed(2)+'G/'+(device.getTotalMem()/1000000000).toFixed(2)+'G';
    str += "\nIMEI: " + device.getIMEI();
    str += "\nSOC(处理器):" + device.hardware;
    str += "\n主板型号:" + device.board;
    str += "\n唯一标识码:" + device.fingerprint;
    str += "\n";
    str += "\n软件信息";
    str += "\n系统版本日期:" + device.securityPatch;
    str += "\nMac地址: " + device.getMacAddress();
    str += "\nAndroidId: " + device.getAndroidId();
    str += "\nBUILD_ID:" + device.buildId;
    str += "\n开发代号:" + device.codename;
    str += "\n当前媒体音量:" + (device.getMusicVolume()/device.getMusicMaxVolume()*100).toFixed(1)+'%';
    str += "\n当前通知音量:" + (device.getNotificationVolume()/device.getNotificationMaxVolume()*100).toFixed(1)+'%';
    str += "\n当前闹钟音量:" + (device.getAlarmVolume()/device.getAlarmMaxVolume()*100).toFixed(1)+'%';
    str += "\n当前电量: " + device.getBattery()+'%';
    str += "\n当前屏幕亮度:" + device.getBrightness();
    str += "\n处于自动亮度:" + statu_light;
    str += "\n处于充电:" + statu_charging;

    ui.output.setText(str);    
});

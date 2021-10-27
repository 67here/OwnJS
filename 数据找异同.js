'ui';

ui.layout(
    <scroll>
    <vertical padding="16">
        
        <text textSize="16sp" textColor="black" text="库(多)"/>
        <input id="origin" maxLines="8" hint="换行---分割线"/>

        <text textSize="16sp" textColor="black" text="对比项(少)"/>
        <input id="compare" maxLines="8" hint="换行---分割线"/>

        <button id='different' text="找不同" textSize="20sp"/>
        <button id='same' text="找相同" textSize="20sp"/>

        <text textSize="16sp" textColor="black" text="输出框"/>
        <text id="myText" textSize="20sp" textColor="blue"></text>
    </vertical>
    </scroll>
)

ui.same.click(function(){

    var same_array = new Array();
    var same_counts = 0;

    let content_origin = ui.origin.text();
    var origin_array = content_origin.split('\n');

    let content_compare = ui.compare.text();
    var compare_array = content_compare.split('\n');

    if(!content_origin || !content_compare) ui.myText.setText('没有填入内容!')
    else {
        for(i = 0; i < compare_array.length; i++){
            for(i2 = 0; i2 < origin_array.length; i2++){
                if(compare_array[i] == origin_array[i2]) {same_array[same_counts++] = compare_array[i];break;}
            }
        }
        let same_rray = same_array.join('\n');
        if(!same_rray) ui.myText.setText('没有相同')
        else ui.myText.setText('相同的抖音号'+same_array.length+'个：\n'+same_rray);
    }
})

ui.different.click(function(){

    var different_array = new Array();
    var different_counts = 0;
    var different_flag;

    let content_origin = ui.origin.text();
    var origin_array = content_origin.split('\n');

    let content_compare = ui.compare.text();
    var compare_array = content_compare.split('\n');

    if(!content_origin || !content_compare) ui.myText.setText('没有填入内容!')
    else{
        for(i = 0; i < compare_array.length; i++){
            different_flag = 1;
            for(i2 = 0; i2 < origin_array.length; i2++){
                if(compare_array[i] == origin_array[i2]) {different_flag = 0;break;}
            }
            if(different_flag) different_array[different_counts++] = compare_array[i]; 
        }
        let different_rray = different_array.join('\n');
        if(!different_rray) ui.myText.setText('没有不同项')
        else ui.myText.setText('不同的抖音号'+different_array.length+'个：\n'+different_rray);
    } 
})

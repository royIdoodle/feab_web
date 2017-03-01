/**
 * Created by Roy on 2017/2/24.
 */
$('document').ready(function(){
    var FILE_NAME_SUGGEST = "例：listing";
    //请求后台接口
    $.get('http://10.13.1.49:8082/start', function (httpData) {
        var data = httpData.data;
        var model = new Vue({
            el: 'body',
            data: {
                title:'',
                fileList: data.jsList,
                componentList: data.componentList,
                fileName: '',
                fileNameSuggest: FILE_NAME_SUGGEST,
                filePath: '',
                midway: '',
                comp :'',
                isWcShare: false,
                isAppShare: false,
                itemList:[],
                downloadLink:'',
                listCom:[]
            },
            watch: {
                itemList: function(e){

                },
                filePath: function(val){
                    if(!this.$data.midway){
                        this.$data.midway = '/' + val + '/' + this.$data.fileName + '/init.node';
                    }
                },
                title: function(val){
                    var that = this;
                    translateWord(val, function(d){
                        var result = d && d.trans_result && d.trans_result.map(function(i){return i.dst}).join(','),
                            enFileNameList = result.split(' ');
                        that.$data.fileNameSuggest =  '翻译建议：'+result;

                        for(var i=0;i<enFileNameList.length;i++){
                            if(i === 0 ){
                                enFileNameList[i]=enFileNameList[i].charAt(0).toLowerCase()+enFileNameList[i].substring(1)
                            }else{
                                enFileNameList[i]=enFileNameList[i].charAt(0).toUpperCase()+enFileNameList[i].substring(1);
                            }
                        }
                        that.$data.fileName = enFileNameList.join('');
                    })
                }
            },
            computed: {

            },
            methods: {
                ready: function (e) {
                    console.log(e)
                },
                submit: function(e){
                    var that = this;
                    //阻止默认事件
                    e.preventDefault();
                    var o = {
                        title: that.$data.title,
                        fileName: that.$data.fileName,
                        filePath: that.$data.filePath,
                        midway: that.$data.midway,
                        isWcShare: that.$data.isWcShare,
                        isAppShare: that.$data.isAppShare,
                        comp: that.$data.comp,
                        listCom: that.$data.listCom,
                        itemList: that.$data.itemList
                    };
                    console.log('--------submit---------');
                    console.log(o);
                    console.log('--------submit---------');
                    $.ajax({
                        url: 'http://10.13.1.49:8082/make',
                        method: 'GET',
                        data: {options:o},
                        success: function(data){
                            console.log('http://10.13.1.49:8082/download?fileName='+data.fileName);
                            that.$data.downloadLink = 'http://10.13.1.49:8082/download?fileName='+data.fileName;
                            setTimeout(function(){
                                window.open('http://10.13.1.49:8082/download?fileName='+data.fileName)

                            },500)
                            //history.replaceState(false, document.title,'http://10.13.1.49:8082/download?fileName='+data.fileName)
                        }
                    });
                }
            }
        })
    });

    function translateWord(word, callback){
        var appid = '2015063000000001';
        var key = '12345678';
        var salt = (new Date).getTime();
        var query = word;
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = 'zh';
        var to = 'en';
        var str1 = appid + query + salt +key;
        var sign = MD5(str1);
        $.ajax({
            url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
            type: 'get',
            dataType: 'jsonp',
            data: {
                q: query,
                appid: appid,
                salt: salt,
                from: from,
                to: to,
                sign: sign
            },
            success: callback
        });
    }
    //
});
/**
 * Created by admin on 2017/11/20.
 */
var WSUtil ={
    _ws:false,
    alreadyNotifyStoped:false,
    listeners:{
        default:function(status,data){
            if(status && data)console.info('收到websocket消息:',data);
        }
    },
    url:function(){
        console.info(util.globalurl.wsurl);
        return util.globalurl.wsurl+"?uuid="+this.uuid();
    },
    uuid:function(){
        return (new Date().getTime() * 740) + '';
    },
    connect:function(){
        if(this._ws){
            console.error("websocket已经连接");
            return;
        }
        console.info("开始连接websocket...");
        var ws = new WebSocket(this.url());
        //打开连接时触发
        ws.onopen = function() {
            console.info('websocket连接成功');
            WSUtil._ws = ws;
            WSUtil.notifyAllListenerStart();
        };
        //收到消息时触发
        ws.onmessage = function(evt) {
            var data = JSON.parse(evt.data);
            var listener = WSUtil.listeners[data.channel];
            if(listener){
                listener(true,data);
            }else{
                WSUtil.listeners.default(data);
            }
        };
        //关闭连接时触发
        ws.onclose = function(evt) {
            console.info('websocket关闭链接');
            WSUtil.notifyAllListenerStop();
        }
        //连接错误时触发
        ws.onerror = function(evt) {
            console.info('websocket链接错误');
            WSUtil.notifyAllListenerStop();
        }
    },
    isConnected : function(){
        var wsInstance = this._ws;
        return wsInstance && wsInstance.readyState == 1;
    },
    sendMsg:function(msg) {
        this._ws.send(JSON.stringify(msg));
    },
    //cbFn(status,data)
    registerListener:function(event,cbFn) {
        if(typeof cbFn == "function")this.listeners[event] = cbFn;
    },
    removeListener:function(event) {
        delete this.listeners[event];
    },
    //通知所有监听者停止监听(websocket已关闭或出错时)
    notifyAllListenerStop : function(){
        if(this.alreadyNotifyStoped)return ;//已经通知过
        console.info('通知监听者websocket通道已关闭,需自行处理');
        this._ws = null;
        this.alreadyNotifyStoped = true;//通知后置null
        for(var listener in WSUtil.listeners){
            WSUtil.listeners[listener](false);
        }
    },
    //通知所有监听者停止监听(websocket已关闭或出错时)
    notifyAllListenerStart : function(){
        this.alreadyNotifyStoped = false;
        console.info('通知监听者切换到websocket通道');
        for(var listener in WSUtil.listeners){
            WSUtil.listeners[listener](true);
        }
    }
}
$(function(){
    WSUtil.connect();//自动连接
    setInterval(function(){
        if(!WSUtil.isConnected()){
            WSUtil.connect();//定时尝试修复连接
        }
    },20*1000);
})
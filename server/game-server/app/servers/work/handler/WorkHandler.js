/**
 * Created by bot.su on 2017/6/21.
 * 处理游戏中的网路事件
 */


var cc = require("../../../game/util/cc");


module.exports = function(app) {
    return new Handler(app);
};

var Handler = cc.Class.extend({
    ctor:function (app) {
        this.app = app;
    },


    /**
     * Send messages to users
     *
     * @param {Object} msg message from client
     * @param {Object} session
     * @param  {Function} next next stemp callback
     *
     */
    chat : function(msg, session, next) {
        var channelService = this.app.get('channelService');
        var channel = channelService.getChannel(ag.jsUtil.dataChannel, true);
        channel.pushMessage('sChat', msg);
        next();


        //var channelService = this.app.get('channelService');
        //var param = {
        //    msg: msg.content,
        //    from: session.get("uid"),
        //    target: msg.target
        //};
        //var channel = channelService.getChannel(JsUtil.dataChannel, true);
        //
        ////the target is all users
        //if(msg.target == '*') {
        //    channel.pushMessage('onChat', param);
        //}
        ////the target is specific user
        //else {
        //    var tuid = msg.target;
        //    var tsid = channel.getMember(tuid)['sid'];
        //    channelService.pushMessageByUids('onChat', param, [{
        //        uid: tuid,
        //        sid: tsid
        //    }]);
        //}
        //next(null, {});
    },


    //进入游戏
    enter:function(msg, session, next) {
        ag.gameLayer.addPlayer(session.uid,msg.name,msg.type,msg.sex);
        next();
    },


    //移动
    move:function(msg, session, next) {
        var player =  ag.gameLayer.getRole(session.uid);
        if(player){
            player.move({x:msg.x,y:msg.y});
        }
        next();
    },


    //攻击
    attack:function(msg, session, next) {
        var attacker =  ag.gameLayer.getRole(session.uid);
        var locked =  ag.gameLayer.getRole(msg.id);
        if(attacker && locked){
            attacker.attack(locked);
        }
        next();
    },



    //复活请求
    relife:function(msg, session, next) {
        var player =  ag.gameLayer.getRole(session.uid);
        if(player){
            player.relife();
        }
        next();
    },
});

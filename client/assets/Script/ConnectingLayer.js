/**
 * Created by bot.su on 2017/6/21.
 * 网络链接场景
 */


cc.Class({
    extends: cc.Component,
    properties: {},

    // use this for initialization
    onLoad: function () {
        cc.sequenceEx = function(){
            if(arguments.length==1)return new cc.Sequence(arguments[0]);
            if(arguments.length==2)return new cc.Sequence(arguments[0],arguments[1]);
            if(arguments.length==3)return new cc.Sequence(arguments[0],arguments[1],arguments[2]);
            if(arguments.length==4)return new cc.Sequence(arguments[0],arguments[1],arguments[2],arguments[3]);
            if(arguments.length==5)return new cc.Sequence(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
            if(arguments.length==6)return new cc.Sequence(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
            return cc.Sequence();
        };
        window.ag = {};
        ag.jsUtil = require("JsUtil");
        ag.agAniCache = require("AGAniCache");
        ag.userInfo = require("UserInfo");
        ag.gameConst = require("GameConst");
        ag.agSocket = require("AGSocket");
        ag.gameConst.init();
        var BuffManager = require("BuffManager");
        ag.buffManager = new BuffManager();
        ag.buffManager.init();



        this._netState = cc.find("Canvas/label_netState");
        this._loadRes = cc.find("Canvas/load_res");
        this.labelPercent = cc.find("Canvas/load_res/label_percent").getComponent(cc.Label);
        this._loadRes.active = false;
        cc.loader.loadRes('prefab/nodeRoleProp',function(err,prefab){
            ag.agSocket.init(this.loadRes.bind(this));
        }.bind(this));
    },


    //加载资源
    loadRes:function(){
        this._loadRes.active = true;
        this._netState.active = false;
        //var array = [];
        //for(var i=1;i<=17;++i)array.push("ani/hum"+i);
        //for(var i=1;i<=4;++i)array.push("ani/effect"+i);
        //cc.loader.loadResArray(array, cc.SpriteAtlas,function(num, totalNum, item){
        //    this.labelPercent.string = "("+Math.floor(num/totalNum*100)+"%)";
        //}.bind(this),function (err, atlas) {
            cc.director.loadScene('FirstLayer',null,function () {
                cc.loader.onProgress = null;
            });
//        }.bind(this));
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },
});

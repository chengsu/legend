/**
 * Created by bot.su on 2017/6/21.
 * 模拟角色信息表
 */



module.exports = ag.class.extend({
    ctor:function () {
        this._infoMap = {};
        this._nLength = 0;
    },
    
    
    add:function (id) {
        if(!this._infoMap[id]){
            this._infoMap[id] = {id:id,name:'r'+this._nLength,sessions:0,score:0};
            ++this._nLength;
        }
        return this._infoMap[id];
    },
    changeName:function (id,name) {
        if(!id)return 1;
        var bFind = false;
        for(var key in this._infoMap){
            if(key!=id && this._infoMap[key].name==name){
                bFind = true;
            }
        }
        if(bFind)return 2;
        this._infoMap[key].name = name;
        return 0;
    },
    getName:function(id){
        if(id && this._infoMap[id])return this._infoMap[id].name;
        return "";
    }
});

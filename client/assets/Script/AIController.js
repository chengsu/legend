/**
 * Created by bot.su on 2017/6/21.
 * 动画
 */


cc.Class({
    extends: cc.Component,
    properties: {},


    //初始化角色
    init: function (role) {
        this._touchPointArray = [];
        this._role = role;
        this._locked = null;
        this._busy = false;
        this._spriteTouchArray = [];
        this._touchMoveDirection = -1;

        //加载
        cc.loader.loadRes('prefab/nodeTouchSprite',function(err,prefab){
            var node = cc.instantiate(prefab);
            node.parent = ag.gameLayer.node;
            node.setLocalZOrder(100);
            for(var i=0;i<8;++i){
                var spriteTouch = node.getChildByName("spriteTouch"+i).getComponent(cc.Sprite);
                var text = spriteTouch.node.getChildByName("labelText");
                if(text)text.cascadeOpacity = false;
                this._spriteTouchArray.push(spriteTouch);
            }
            this.changeTouchSprite(false);
        }.bind(this));


        var node = ag.gameLayer.node;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            ag.gameLayer.log('b');
            this._touchPointArray = this._touchPointArray.concat(event.getTouches());
            if(this._touchPointArray.length==3)this._touchPointArray.splice(0,1);//防止出现没有end的事件的情况
            this._locked = this._role.getPlayerForTouch(this._touchPointArray[0]);
            this.resetTouchDirection();
            this.changeTouchSprite(true);
        }.bind(this));
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var tempDirection = this._touchMoveDirection;
            this.resetTouchDirection();
            if(tempDirection!=this._touchMoveDirection){
                this.changeTouchSprite();
            }
        }.bind(this));
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            ag.gameLayer.log('e');
            var touches = event.getTouches();
            for(var i=this._touchPointArray.length-1;i>=0;--i)if(touches.indexOf(this._touchPointArray[i])!=-1){
                ag.gameLayer.log('m');

                this._touchPointArray.splice(i,1);
            }
            this.resetTouchDirection();
            this.changeTouchSprite();
        }.bind(this));

        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            ag.gameLayer.log('c');
            var touches = event.getTouches();
            for(var i=this._touchPointArray.length-1;i>=0;--i)if(touches.indexOf(this._touchPointArray[i])!=-1){
                this._touchPointArray.splice(i,1);
                ag.gameLayer.log('n');
            }
            this.resetTouchDirection();
            this.changeTouchSprite();
        }.bind(this));
    },



    //获得当前移动方向
    resetTouchDirection:function () {
        if(!this._locked){
            ag.gameLayer.log("1");
            if(this._touchPointArray.length==2){
                //ag.gameLayer.log("("+this._touchPointArray[0].getLocationX()+','+this._touchPointArray[0].getLocationY()+','+this._touchPointArray[1].getLocationX()+','+this._touchPointArray[1].getLocationY()+")");
                var offset1 = this._role.getTouchOffsetScreen(this._touchPointArray[0]);
                var offset2 = this._role.getTouchOffsetScreen(this._touchPointArray[1]);
                //if(cc.pointEqualToPoint(offset1,cc.p(-1,1)) && cc.pointEqualToPoint(offset2,cc.p(1,1))){
                if((offset1.x==-1 && offset1.y==1 && offset2.x==1 && offset2.y==1) || (offset1.x==1 && offset1.y==1 && offset2.x==-1 && offset2.y==1)){
                    this._touchMoveDirection = 0;
                    ag.gameLayer.log("2");
                //}else if(cc.pointEqualToPoint(offset1,cc.p(-1,-1)) && cc.pointEqualToPoint(offset2,cc.p(1,-1))){
                }else if((offset1.x==-1 && offset1.y==-1 && offset2.x==1 && offset2.y==-1) || (offset1.x==1 && offset1.y==-1 && offset2.x==-1 && offset2.y==-1)){
                    this._touchMoveDirection = 4;
                    ag.gameLayer.log("3");
                }else{
                    this._touchMoveDirection = -1;
                    ag.gameLayer.log("4");
                }
            }else if(this._touchPointArray.length==1){
                var offset1 = this._role.getTouchOffsetScreen(this._touchPointArray[0]);
                //ag.gameLayer.log("("+this._touchPointArray[0].getLocationX()+','+this._touchPointArray[0].getLocationY()+','+offset1.x+','+offset1.y+")");
                //if(cc.pointEqualToPoint(offset1,cc.p(0,0))==false){
                if(offset1.x==0 && offset1.y==0){
                    this._touchMoveDirection = -1;
                    ag.gameLayer.log("7");
                }else{
                    this._touchMoveDirection = ag.gameConst.directionStringArray.indexOf(""+offset1.x+","+offset1.y);
                    ag.gameLayer.log("6");
                }
            }else{
                this._touchMoveDirection = -1;
                ag.gameLayer.log("8");
            }
        }else{
            this._touchMoveDirection = -1;
            ag.gameLayer.log("9");
        }
    },


    //改变触摸图片
    changeTouchSprite:function (bAction) {
        if(this._touchMoveDirection!=-1){
            for(var i=0;i<this._spriteTouchArray.length;++i){
                this._spriteTouchArray[i].node.stopAllActions();
                var text = this._spriteTouchArray[i].node.getChildByName("labelText");
                if(text)text.opacity = (i==this._touchMoveDirection?255:0);
                if(bAction){
                    this._spriteTouchArray[i].node.opacity = 255*0.2;
                    if(i!=this._touchMoveDirection)this._spriteTouchArray[i].node.runAction(cc.fadeOut(1));
                }else{
                    this._spriteTouchArray[i].node.opacity = (i==this._touchMoveDirection?255*0.2:0);
                }
            }
        }else{
            for(var i=0;i<this._spriteTouchArray.length;++i) {
                this._spriteTouchArray[i].node.stopAllActions();
                this._spriteTouchArray[i].node.opacity = 0;
                var text = this._spriteTouchArray[i].node.getChildByName("labelText");
                if(text)text.opacity = 0;
            }
        }
    },


    //一次移动完成
    onMoveEnd:function(){
        this._busy = false;
        this.update(0);
    },


    //一次移动完成
    onAttackEnd:function(){
        this._busy = false;
        this.update(0);
    },


    //返回移动到锁定角色的的方向
    doMoveOperate:function (location) {
        var direction = ag.gameLayer.getDirection(this._role.getLocation(),location);
        direction = ag.gameLayer.getOffsetWithColloison(this._role, direction);
        if (direction!=-1){
            this._role.move(cc.pAdd(this._role.getLocation(),ag.gameConst.directionArray[direction]));
            this._busy = true;
        }else{
            this._role.idle();
        }
    },


    // called every frame
    update: function (dt) {
        //执行玩家操作
        if(this._busy==false && this._state != ag.gameConst.stateDead){
            if(this._locked){
                if(cc.pDistance(this._role.getLocation(),this._locked.getLocation())<=this._role.getMst().visibleDistance){
                    if(ag.gameLayer.getAttackDistance(this._role,this._locked)){
                        this._role.attack(this._locked);
                        this._busy = true;
                    }else{
                        this.doMoveOperate(this._locked.getLocation());
                    }
                }else{
                    this._role.idle();
                    this._locked = null;
                }
            }else if(this._touchMoveDirection!=-1){
                this.doMoveOperate(cc.pAdd(this._role.getLocation(),ag.gameConst.directionArray[this._touchMoveDirection]));
            }else{
                this._role.idle();
            }
        }
    },
});

"use strict";
cc._RF.push(module, '1646b9DQUpGfLaG3TGEkU5Z', 'rocker');
// Script/rocker.js

'use strict';

/**
 * 设计思路
 * 1.轮盘呼出限制区域（节点），没有限制则为全屏区域，注意节点为空时的判断
 * 2.轮盘默认为透明，触摸相应区域（呼出轮盘时）轮盘透明度提高（跟随模式则还需移动到相应位置）
 * 3.触摸移动时，stick跟随移动
 * 4.模式设计
 *      轮盘呼出（显示）   1.固定 2.跟随触摸点
 *      移动速度   1.固定 2.随stick距离轮盘中心的距离而改变（变速模式）
 *      越过边界   1.阻止   2.允许（从另一侧出现）
 * 5.任务转向速度（暂时不考虑）
 * 
 * 注意事项
 * 1.rocker节点的size需要设置，不然点击轮盘会无响应
 * 2.如果使用限制区域，则需要让rocker节点成为限制区域节点的子节点，此操作涉及轮盘呼出的位置问题
 * 3.如果不使用限制区域，则不能使用轮盘呼出的跟随模式，否则会出错
 * 
 */
var showTypeEnum = {
    FIXED: 0,
    FOLLOW: 1
};
var moveTypeEnum = {
    FIXED: 0,
    CHANGED: 1
};
var crossTypeEnum = {
    FORBID: 0,
    PERMIT: 1
};
cc.Class({
    extends: cc.Component,

    properties: {
        limitAreaNode: {
            default: null,
            type: cc.Node
        },

        playerNode: {
            default: null,
            type: cc.Node
        },

        // 每帧移动多少距离
        moveSpeedMax: {
            default: 1,
            type: cc.Float
        },
        moveDir: {
            default: cc.v2(0, 0),
            visible: false
        },

        MAX_R: {
            default: 0,
            type: cc.Float,
            visible: false
        },
        rocker_bg: {
            default: null,
            type: cc.Node,
            visible: false
        },
        stick: {
            default: null,
            type: cc.Node,
            visible: false
        },
        moveFlag: {
            default: false,
            visible: false
        },
        moveSpeed: {
            default: 0,
            type: cc.Float,
            visible: false
        },

        showType: {
            default: showTypeEnum.FIXED,
            type: cc.Enum(showTypeEnum)
        },
        moveType: {
            default: moveTypeEnum.FIXED,
            type: cc.Enum(moveTypeEnum)
        },
        crossType: {
            default: crossTypeEnum.FORBID,
            type: cc.Enum(crossTypeEnum)
        }

    },

    onLoad: function onLoad() {
        this.rocker_bg = this.node.getChildByName('rocker_bg');
        this.stick = this.node.getChildByName('stick');
        this.MAX_R = this.rocker_bg.width / 2;

        this.initTouchEvent();
    },


    // 切换轮盘显示（呼出）模式
    changeShowMode: function changeShowMode(event, type) {
        switch (type) {
            case 'FIXED':
                {
                    this.showType = showTypeEnum.FIXED;
                    this.node.getComponent(cc.Widget).enabled = true;
                    break;
                }
            case 'FOLLOW':
                {
                    this.showType = showTypeEnum.FOLLOW;
                    this.node.getComponent(cc.Widget).enabled = false;
                    break;
                }
            default:
                {
                    cc.error('类型错误');
                    break;
                }
        }
        this.initTouchEvent();
    },

    // 切换角色移动模式
    changeMoveMode: function changeMoveMode(event, type) {
        switch (type) {
            case 'FIXED':
                {
                    this.moveType = moveTypeEnum.FIXED;
                    break;
                }
            case 'CHANGED':
                {
                    this.moveType = moveTypeEnum.CHANGED;
                    break;
                }
            default:
                {
                    cc.error('类型错误');
                    break;
                }
        }
    },

    // 切换越界模式
    changeCrossMode: function changeCrossMode(event, type) {
        switch (type) {
            case 'FORBID':
                {
                    this.crossType = crossTypeEnum.FORBID;
                    break;
                }
            case 'PERMIT':
                {
                    this.crossType = crossTypeEnum.PERMIT;
                    break;
                }
            default:
                {
                    cc.error('类型错误');
                    break;
                }
        }
    },

    initTouchEvent: function initTouchEvent() {
        var node = this.node;
        if (this.showType == showTypeEnum.FOLLOW) {
            node = this.limitAreaNode;
            if (!node) {
                cc.error('使用轮盘跟随模式，没有设置限制区域');
                return;
            }
        }

        node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
        node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
    },


    touchStartEvent: function touchStartEvent(event) {
        if (this.showType == showTypeEnum.FIXED) {
            var _startTouchPos = this.node.convertToNodeSpaceAR(event.getLocation());

            var distance = _startTouchPos.sub(this.node.getPosition()).mag();
            if (distance <= this.MAX_R) {
                var pos = this.node.convertToNodeSpaceAR(event.getLocation());
                this.stick.setPosition(pos);
                this.node.opacity = 255;
            }
            return;
        }

        // 注意：虚拟摇杆节点必须是限制区域节点的子节点，不然会出现坐标系错误，导致位置不对
        var startTouchPos = this.limitAreaNode.convertToNodeSpaceAR(event.getLocation());

        this.node.setPosition(startTouchPos);
        this.node.opacity = 255;
    },

    touchMoveEvent: function touchMoveEvent(event) {
        this.moveFlag = true;

        var pos = this.node.convertToNodeSpaceAR(event.getLocation());

        var distance = pos.mag();
        if (distance > this.MAX_R) {
            // pos.x / distance == x / r
            pos.x = pos.x * this.MAX_R / distance;
            pos.y = pos.y * this.MAX_R / distance;

            distance = this.MAX_R;
        }
        this.stick.setPosition(pos);

        this.moveSpeed = this.moveSpeedMax;
        if (this.moveType == moveTypeEnum.CHANGED) {
            this.moveSpeed = this.moveSpeedMax * (distance / this.MAX_R);
        }

        // 向量归一化（将模长变为1）
        this.moveDir = pos.normalize();
    },

    touchEndEvent: function touchEndEvent(event) {
        this.stick.setPosition(0, 0);
        this.moveFlag = false;

        this.node.opacity = 150;
        this.node.getComponent(cc.Widget).enabled = true;
    },

    update: function update(dt) {
        if (this.moveFlag) {
            this.playerMove();
        }
    },


    playerMove: function playerMove() {
        // 角度
        var radians = Math.atan2(this.moveDir.y, this.moveDir.x);
        this.playerNode.rotation = 90 - cc.misc.radiansToDegrees(radians);

        // 位置
        var newPos = this.playerNode.position.add(this.moveDir.mul(this.moveSpeed));
        var parentNode = this.playerNode.getParent();

        if (this.crossType == crossTypeEnum.FORBID) {
            if (newPos.x > parentNode.width / 2) {
                newPos.x = parentNode.width / 2;
            } else if (newPos.x < -parentNode.width / 2) {
                newPos.x = -parentNode.width / 2;
            }

            if (newPos.y > parentNode.height / 2) {
                newPos.y = parentNode.height / 2;
            } else if (newPos.y < -parentNode.height / 2) {
                newPos.y = -parentNode.height / 2;
            }
        } else {
            if (newPos.x > parentNode.width / 2) {
                newPos.x -= parentNode.width;
            } else if (newPos.x < -parentNode.width / 2) {
                newPos.x += parentNode.width;
            }

            if (newPos.y > parentNode.height / 2) {
                newPos.y -= parentNode.height;
            } else if (newPos.y < -parentNode.height / 2) {
                newPos.y += parentNode.height;
            }
        }

        this.playerNode.setPosition(newPos);
    }
});

cc._RF.pop();
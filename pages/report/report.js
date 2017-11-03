//report.js
//获取应用实例
// var app = getApp()
import { report,results } from '../../data/data';
import { wikiFetch} from '../../data/fetch';

import { restart } from '../../component/restart/restart.js'


Page({
    data: {
        report: []
    },
    restartAsk: function () {
        let self = this;
        restart(self.init);
    },

    init: function () {
        this.setData({
            report: []
        })
    },

    onLoad: function () {

        let items=report.items;
        this.setData({
            report: items
        })
        for (let i = 0; i < items.length; i++) {
            let circle = "canvasCircle" + items[i].id;
            let airCir = "canvasArcCir" + items[i].id;
            this.drawCircle(circle, airCir, items[i].weight);
        }
        
    },

    drawCircle: function (circle, airCir, weight) {
        let end = weight * 2 * Math.PI / 100 + 1.5 * Math.PI;
        let ctx = wx.createCanvasContext(airCir);

        ctx.setFillStyle('white');
        ctx.clearRect(0, 0, 200, 200);
        ctx.draw();
        var x = 22, y = 22, radius = 20;
        ctx.setLineWidth(2);
        ctx.setStrokeStyle('#41B8B0');
        ctx.setLineCap('round');
        ctx.beginPath();
        ctx.arc(x, y, radius, 1.5 * Math.PI, end, false);
        ctx.stroke()
        ctx.draw()

        //创建并返回绘图上下文context对象。
        var cxt_arc = wx.createCanvasContext(circle);
        cxt_arc.setLineWidth(2);
        cxt_arc.setStrokeStyle('#eaeaea');
        cxt_arc.setLineCap('round');
        cxt_arc.beginPath();
        cxt_arc.arc(22, 22, 20, 0, 2 * Math.PI, false);
        cxt_arc.stroke();
        cxt_arc.draw();

    },

    clickDisease: function (e) {
        console.log(e.currentTarget.dataset.id);
        let _id = e.currentTarget.dataset.id;

        wx.showLoading({
            title: '加载中',
        })
        wikiFetch(_id)

    },
    //分享
    onShareAppMessage: function () {
        return {
            title: '在线智能问诊',
            path: '/pages/index/index',
            success: function (res) {

            },
            fail: function (res) {

            }
        }
    }

})

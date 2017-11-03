//index.js
//获取应用实例
// var app = getApp()
import { wiki } from '../../data/data.js';
import { restart } from '../../component/restart/restart.js'


Page({
    data: {
        wiki: []
    },

    restartAsk: function () {
        let self = this;
        restart(self.init);
    },

    init: function () {
        this.setData({
            wiki: []
        })
    },

    onLoad: function () {
        
        this.setData({
            wiki: wiki.items
        })


        wx.setNavigationBarTitle({
            title: wiki.name
        })


        

    },

    clickTitle: function (e) {
        let idx = e.currentTarget.dataset.idx;
        let {wiki} = this.data;
        let _wiki = JSON.parse(JSON.stringify(wiki));

        _wiki[idx].show = !_wiki[idx].show;

        this.setData({
            wiki: _wiki
        })
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

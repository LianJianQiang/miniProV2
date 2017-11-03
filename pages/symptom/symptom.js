//index.js
//获取应用实例
// var app = getApp()
import { symptomList, symptomSort, results, resultsListInit, optionsInit} from '../../data/data.js';
let {symptoms} = results.patient;

import { symptomListFetch, symptomCategoryFetch } from '../../data/fetch';
import { restart } from '../../component/restart/restart.js'


Page({
    firstTime:true,
    timer:null,
    data: {
        tab: [],
        currentTab: '',
        tag: [],
        // tagChoiceNum: 0,
        tagChoice: [],
        searchList: [],
        searchValue:'',

        mask: false     //cart

    },

    restartAsk: function () {
        let self = this;
        restart(self.init);
    },

    init: function () {
        this.setData({
            tab: [],
            currentTab: '',
            tag: [],
            tagChoice: [],
            searchList: [],
            searchValue: '',
            mask: false
        })
    },

    onLoad: function () {

        // let {patient} = results;
        // if (!patient.basic.gender || patient.basic.age.year == '') {
        //     this.restartAsk()
        //     return;
        // }

        // this.fetchTab();
        this.fetchTag();
        
    },

    searchChange:function(e){
        let self=this;
        let {value}=e.detail;

        this.setData({
            searchValue:value
        })


        if(value==""){
            this.setData({
                searchList:[]
            })
            return;
        }
        self.searchFetch(value);

    },

    searchFetch:function(value){
        let self=this;
        let params = {
            text: value,
            type: 'search',
            callback: self.searchSuccess
        }
        symptomListFetch(params)
    },

    searchSuccess:function(arr){
        this.setData({
            searchList:arr
        })
    },
    clickSearckList:function(e){
        let {id,name}=e.currentTarget.dataset;
        let json={
            id:id,
            text:name,
            choice:true,
            attrs:{time:{values:[]}}
        }

        let {tagChoice}=this.data;
        let _tagChoice=JSON.parse(JSON.stringify(tagChoice));
        for(let i=0;i<_tagChoice.length;i++){
            if(_tagChoice.id==id){
                return;
            }
        }
        _tagChoice.push(json);

        this.setData({
            tagChoice:_tagChoice,
            searchList:[],
            searchValue:''
        })

    },

    // fetchTab: function () {
    //     let self = this;
    //     let params = {
    //         callback: self.renderTab
    //     }
    //     symptomCategoryFetch(params)
    // },

    fetchTag: function (type) {
        let self = this;
        let params = {
            type: type || '',
            callback: self.renderTab
        }
        wx.showLoading({
            title: '加载中',
        })
        symptomListFetch(params);
    },

    renderTab: function (current) {
        let _current=current || ''
        this.setData({
            tab: symptomSort.items,
            currentTab: _current
        })
        wx.hideLoading()
        this.renderTag(_current)
    },

    renderTag: function (tabId) {
        this.setData({
            tag: symptomList[tabId]
        })
    },

    // 选择分类
    clickTabList: function (e) {

        let id = e.currentTarget.dataset.id,
            _list = JSON.parse(JSON.stringify(symptomList[id])),
            {tagChoice} = this.data;

        for (let i = 0; i < tagChoice.length; i++) {
            for (let j = 0; j < _list.length; j++) {
                if (tagChoice[i].id == _list[j].id) {

                    _list[j].choice = true;
                }
            }
        }


        this.setData({
            currentTab: id,
            tag: _list
        })


    },

    // 选择症状
    clickTag: function (e) {

        let id = e.currentTarget.dataset.id;
        let {tag,  tagChoice} = this.data;

        let _tag = JSON.parse(JSON.stringify(tag)),
            arr = JSON.parse(JSON.stringify(tagChoice));


        for (let i = 0; i < _tag.length; i++) {
            if (_tag[i].id == id) {

                if (_tag[i].choice) {

                    _tag[i].choice = false;

                    for (let j = 0; j < arr.length; j++) {
                        if (arr[j].id == id) {
                            arr.splice(j, 1);
                        }
                    }

                    // tagChoiceNum--;

                } else {
                    _tag[i].choice = true;
                    arr.push(_tag[i]);
                    // tagChoiceNum++;
                }
            }
        }

        this.setData({
            tag: _tag,
            tagChoice: arr
            // tagChoiceNum: tagChoiceNum
        })

    },

    // 确定
    sure: function () {
        resultsListInit('symptoms');
        resultsListInit('labItems');
        resultsListInit('pastDiseases');
        optionsInit()
        
        let {tagChoice}=this.data;
        if(tagChoice.length==0){
            wx.showModal({
                content: '请选择症状表现',
                showCancel:false,
                confirmText:'知道了'
            })
            return;
        }

        tagChoice.map(function(val,idx){
            let json={};
            json.id=val.id;
            json.attrs={
                time:{
                    values:[]
                }
            }
            results.patient.symptoms.push(json)
            
        })

        wx.navigateTo({
            url: '/pages/index/index?idx=3',
        })
    },


    cart: function () {

        this.setData({
            mask: true
        })

    },

    // cart中删除已选项
    deleteChoice: function (e) {
        let {tagChoice,  tag} = this.data;
        let idx = e.currentTarget.dataset.idx;
        let _tagChoice = JSON.parse(JSON.stringify(tagChoice));
        let _tag = JSON.parse(JSON.stringify(tag));

        for (let i = 0; i < _tag.length; i++) {
            if (_tag[i].id == _tagChoice[idx].id) {
                _tag[i].choice = false;
            }
        }

        _tagChoice.splice(idx, 1);
        // tagChoiceNum--;

        this.setData({
            tagChoice: _tagChoice,
            tag: _tag
            // tagChoiceNum: tagChoiceNum
        })

    },

    clickContBox: function () {
        return false;
    },

    clickMask: function () {
        this.setData({
            mask: false
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

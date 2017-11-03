//index.js
//获取应用实例
// var app = getApp()
import { results, options, labItem, resultsListInit, setSkipActions } from '../../data/data.js';
const {basic, symptoms, labItems, pastDiseases} = results.patient;
import { addAskFetch } from '../../data/fetch';

import { restart } from '../../component/restart/restart.js'

Page({
    data: {
        robot: '../../images/robot.jpg',
        idx: 0,
        fetchAskIdx: 0,
        labItem: [],
        checkboxValue: [],
        question: options.optionList
    },

    restartAsk: function () {
        let self = this;
        restart(self.init);
    },

    init: function () {
        this.setData({
            idx: 0,
            fetchAskIdx: 0,
            labItem: [],
            checkboxValue: [],
            question: []
        })
    },

    onLoad: function (opt) {

        // let {patient} = results;
        // if (!patient.basic.gender || patient.basic.age.year == '') {
        //     this.restartAsk()
        //     return;
        // }

        let idx = opt.idx || 0;

        // let optionList = data.optionList;
        // this.setData({
        //     question: optionList
        // })

        this.handleData(idx);

    },

    // 多选
    checkboxChange: function (e) {

        let {value} = e.detail;
        if (value.length == 0) {
            return;
        }
        this.setData({
            checkboxValue: value
        })
    },

    clickCheckboxBtn: function (e) {
        let {checkboxValue} = this.data;
        let {name, type} = e.currentTarget.dataset;
        if (checkboxValue.length == 0) {
            return;
        }
        this.handleChange(name, type, checkboxValue)
    },

    // 单选
    inputChange: function (e) {

        /*
            name 改成action
        */
        let {name, type, id} = e.currentTarget.dataset;
        let {value} = e.detail;
        this.handleChange(name, type, value, id)

    },

    handleChange: function (name, type, value, id) {

        let self = this;
        this.recordResult(name, value, id);

        if(name=='age'){
            let _val=Number(value);
            if(!_val ||  _val<=0){
                wx.showModal({
                    title: '提示',
                    content: '请输入正确的年龄',
                    showCancel:false
                })
                return;
            }
        }


        if (name == 'duration') {
            this.selectDuration(value)
        } else if (name == 'addAsk') {
            addAskFetch(self.fetchAsk);
        } else if (name == 'haslab') {
            this.haslab(value)
        } else if (name != 'lab') {
            this.localask(value);
        }
    },

    //选择症状列表所选症状时间
    selectDuration: function (value) {
        let self = this;
        let _symptoms = JSON.parse(JSON.stringify(results.patient.symptoms));

        for (let i = 0; i < _symptoms.length; i++) {
            if (value == 'FeatureStateUnknown') {
                _symptoms[i].state = value;

            } else {
                _symptoms[i].attrs = {
                    time: {
                        values: []
                    }
                };
                _symptoms[i].attrs.time.values.push(value);
            }
        }

        results.patient.symptoms = _symptoms;
        addAskFetch(self.fetchAsk);
    },

    recordResult: function (name, value, id) {
        let optionList = options.optionList;

        let {idx, question} = this.data,
            _question = JSON.parse(JSON.stringify(question)),
            item = _question[idx],
            action = item.action;

        item.result = value;
        if (idx < 4) {
            optionList[idx].result = value;
        }


        if (name == 'gender') {
            results.patient.basic.gender = value;

        } else if (name == 'age') {
            results.patient.basic.age.year = Number(value)

        } else if (action == 'DoctorInquiryActionAskSymptom') {  //模型追问症状

            let detail = item.detail;

            if (detail.attrs && value != 'FeatureStateUnknown') {
                detail.attrs[item.attrName].values.push(value);
            } else {
                detail.state = value;
            }
            results.patient.symptoms.push(detail);

        } else if (name == "lab") { //询问化验结果

            for (let i = 0; i < results.patient.labItems.length; i++) {
                if (results.patient.labItems[i].id == id) {
                    let _labItems = JSON.parse(JSON.stringify(results.patient.labItems));
                    let obj = _labItems[i]
                    if (value == 'FeatureStateUnknown') {
                        obj.state = value;
                        obj.value = '';
                    } else {
                        obj.value = value;
                        obj.state = 'FeatureStatePositive';

                    }
                    results.patient.labItems = _labItems;
                    return;
                }

            }
            let json = {};
            json.id = id;

            if (value == 'FeatureStateUnknown') {
                json.state = value;
            } else {
                json.value = value;
            }

            let _labItems = JSON.parse(JSON.stringify(results.patient.labItems));
            _labItems.push(json);
            results.patient.labItems = _labItems;
        }


        // this.setData({
        //     question: _question
        // })
    },

    localask: function (value) {
        let that = this;

        if (value == '') {
            return;
        }
        let {idx} = this.data;
        ++idx;
        this.handleData(idx);
    },

    // 模型追问
    fetchAsk: function (optionList) {
        let {idx, question} = this.data;
        
        this.setData({
            question: optionList
        })
        idx++;
        let len = optionList.length - 1;
        console.log(idx)
        if (len >= idx) {
            this.handleData(idx)
        } else {
            idx = len
        }

    },

    haslab: function (value) {

        let self = this;
        if (value == 'no') {
            resultsListInit('labItems');
            setSkipActions('DoctorInquiryActionAskSymptom', true);
            setSkipActions('DoctorInquiryActionAskLabItem', true);
            setTimeout(function () {
                self.setData({
                    labItem: []
                })
            }, 1000)
            this.submitLab(false);

        } else if (value == "yes") {
            setSkipActions('DoctorInquiryActionAskSymptom', false);
            setSkipActions('DoctorInquiryActionAskLabItem', false);

            this.setData({
                labItem: labItem.items
            })
        }
    },

    clickSubmitLab: function () {
        this.submitLab(true);
    },

    //提交化验结果
    submitLab: function (hasLab) {
        let self = this;

        if (hasLab && this.data.labItem.length > 0 && results.patient.labItems.length == 0) {
            wx.showModal({
                content: '请选择化验结果',
                showCancel: false
            })
            return;
        }

        addAskFetch(self.fetchAsk);
    },



    handleData: function (idx) {
        var that = this;

        this.setData({
            idx: idx,
        })
    },

    getReport: function () {
        wx.navigateTo({
            url: "/pages/report/report",
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

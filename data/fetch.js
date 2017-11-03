import {
    cfg,
    inquiryCfg,
    symptomListCfg,
    symptomCategoryCfg,
    wikiCfg
} from './config';
import {
    results,
    addAsk,
    options,
    report,
    labItem,
    symptomList,
    symptomSort,
    labItemInit,
    symptomSortInit,
    symptomListInit,
    wiki
} from './data';


module.exports = {
    addAskFetch: addAskFetch,
    symptomListFetch: symptomListFetch,
    symptomCategoryFetch: symptomCategoryFetch,
    wikiFetch:wikiFetch

}

//追问
function addAskFetch(successCallback) {
    let that = this;
    let data = JSON.stringify(results);

    wx.request({
        url: cfg + inquiryCfg,
        data: data,
        method: "POST",
        header: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            if (res.data) {
                let data = res.data;
                if (data.state) {
                    results.state = data.state;
                }
                addAskSuccess(data, successCallback)

            }
        },
        fail: function () {
            wx.showModal({
                content: '数据请求请求失败',
                showCancel: false
            })
        }
    })
}

function addAskSuccess(data, successCallback) {

    let action = data.action;

    if (action == 'DoctorInquiryActionAskSymptom') {  //询问症状
        askSympton(data, successCallback);
    } else if (action == 'DoctorInquiryActionAskLabItem') {  //询问化验项目 
        labItemInit()
        askLabItem(data, successCallback);
    } else if (action == 'DoctorInquiryActionDiagnose') {   //给出诊断
        diagnose(data)
    }

}

function askSympton(data, successCallback) {
    
    let {optionList} = options;
    
    let arr = [];
    if (data.askSymptom) {
        let askSymptom = data.askSymptom;
        askSymptom.items && askSymptom.items.length > 0 && askSymptom.items.map(function (val, idx) {

            let json = {
                id: val.id,
                name: 'addAsk',
                stem: val.question,
                action: data.action,
                options: [],
                detail: {
                    id: val.id
                }

            }

            if (val.attr) {
                json.type = val.multiValue ? 'checkbox' : 'radio';
                json.attrName = val.attr.name;
                json.detail.attrs = {
                    [val.attr.name]: {
                        values: []
                    }
                }

                val.attr.choices.map(function (val, idx) {
                    let _json = {};
                    _json.text = val.text;
                    _json.value = val.name;
                    json.options.push(_json)

                })
                json.options.push({ text: '不清楚', value: 'FeatureStateUnknown' })
            } else {
                json.type = 'radio';
                json.options = [
                    { text: '是', value: 'FeatureStatePositive' },
                    { text: '否', value: 'FeatureStateNegative' },
                    { text: '不清楚', value: 'FeatureStateUnknown' }
                ]
            }
            
            optionList.push(json);
        })
        successCallback(optionList);
    }
}

function askLabItem(data, successCallback) { //化验
    let array = [];
    let {optionList} = options;
    optionList.push(labItem.haslab);

    data.askLabItem.items.map(function (val, idx) {
        let json = {
            id: val.id,
            action: 'DoctorInquiryActionAskLabItem',
            name: 'lab',
            type: 'radio',
            stem: val.question,
            options: []
        }

        val.choices.map(function (item, index) {
            let _json = {
                text: item,
                value: item
            };
            json.options.push(_json);
        })
        json.options.push({ text: '不清楚', value: 'FeatureStateUnknown' });
        array.push(json)
    })

    labItem.items = array;
    return successCallback(optionList);
}

function diagnose(data) { //诊断结果

    let arr = [];
    if (data.diagnose) {
        let diagnose = data.diagnose;
        diagnose.items && diagnose.items.length > 0 && diagnose.items.map(function (val, idx) {
            let json = {};
            json.id = val.id;
            json.name = val.text;
            json.weight = (val.weight * 100).toFixed(1);
            json.describe = val.brief;

            arr.push(json);
        })
    }
    report.items = arr;
    wx.navigateTo({
        url: "/pages/report/report",
    })

}


//症状列表
function symptomListFetch(params) {

    let {type, text, callback} = params;
    let data = getBasic(type, text);

    wx.request({
        // url: symptomListCfg,
        url: cfg + symptomListCfg,
        data: JSON.stringify(data),
        method: "POST",
        header: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            if (res.data) {
                type == "search" ?
                    callback(res.data.items || []) :
                    handleSymptomListFetch(res.data, callback)

                // let _param=type=='search'?res.data.items:initId;
                // handleSymptomListFetch(res.data, callback)(_param)

            }
        },
        fail: function () {
            wx.showModal({
                content: '数据请求请求失败',
                showCancel: false
            })
        }
    })
}

function getBasic(type, text) {
    let _age = results.patient.basic.age.year;
    let _gender = results.patient.basic.gender;
    let data = {
        options: {
            "userType": "UserPatient",
            "gender": _gender,
            "age": {
                "year": _age
            }
        }
    }
    data.size = 100;
    if (type && type == 'search') {
        data.text = text;
        data.start = 0;
        data.size = 10
    }
    return data;
}

function handleSymptomListFetch(data, callback) {
    symptomListInit();
    data.items.map(function (val, idx) {
        let json = {};
        json.id = val.id;
        json.text = val.name;
        json.attrs = {
            time: {
                values: []
            }
        }
        json.choice = false;

        if (symptomList[val.category]) {
            symptomList[val.category].push(json);
        } else {
            symptomList[val.category] = [];
            symptomList[val.category].push(json);
        }
    })

    symptomCategoryFetch(callback)

}


//症状分类
function symptomCategoryFetch(callback) {

    wx.request({
        // url:  symptomCategoryCfg,
        url: cfg + symptomCategoryCfg,
        data: '{}',
        method: "GET",
        header: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            if (res.data) {
                handleSymptomCategoryFetch(res.data, callback)
            }
        },
        fail: function () {
            wx.showModal({
                content: '数据请求请求失败',
                showCancel: false
            })
        }
    })
}

function handleSymptomCategoryFetch(data, callback) {
    symptomSortInit();
    let one = '';
    data.items.map(function (val, idx) {
        if (idx == 0) {
            one = val.id
        }
        let json = {};
        json.id = val.id;
        json.text = val.name;
        symptomSort.items.push(json);
    })

    return callback(one)
}

function wikiFetch(id){
    wx.request({
        url: cfg + wikiCfg,
        data: {type:'disease',id:id},
        method: "GET",
        header: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: function (res) {
            if (res.data) {
                handleWiki(res.data,id)
            }
        },
        fail: function () {
            wx.showModal({
                content: '数据请求请求失败',
                showCancel: false
            })
        }
    })
}

function handleWiki(data,id){
    wiki.id=data.id;
    wiki.name=data.name;
    wiki.items=[];
    // { title: '典型症状', describe: '由于感染或非感染因素引起的气管、支气管黏膜炎性变化黏液分泌增多。', show: false },

    data.chapters.length>0 && data.chapters.map((val,idx)=>{
        wiki.items.push({
            title:val.title,
            describe:val.text,
            show:idx==0?true:false
        })
    })
    wx.hideLoading()
    wx.navigateTo({
        url: '/pages/wiki/wiki?id=' + id,
    })
    
}










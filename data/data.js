export let results = {
    "patient": {
        "basic": {
            "age": {
                "year": ''
            }
        },
        "symptoms": [],
        "labItems": [],
        "pastDiseases": []
    },
    "skipActions": [  //跳过的询问项
        "DoctorInquiryActionAskBasicInfo",  //基本信息
        "DoctorInquiryActionAskLivingHabit",  //生活习惯
        "DoctorInquiryActionAskVitalSign",   //生命体征
        "DoctorInquiryActionAskSign"    //体征
    ]
}

export let options = {
    optionList: [
        {
            id: 'gender',
            name: 'gender',
            type: 'radio',
            stem: '请选择性别',
            options: [
                { text: '男', value: 'GenderMale' },
                { text: '女', value: 'GenderFemale' }
            ]
        }, {
            id: 'age',
            name: 'age',
            type: 'text',
            stem: '请输入您的年龄'
        }, {
            name: 'symptom',
            type: 'list',
            stem: '您当前有什么症状？',
            text: '点击进入标准词列表输入',
            url: '../symptom/symptom'
        }, {
            id: 'duration',
            name: 'duration',
            type: 'radio',
            stem: '以上症状持续多久了？',
            options: [
                { text: '3天', value: '(,3d]' },
                { text: '1周', value: '(3d,7d]' },
                { text: '2周', value: '(7d,14d]' },
                { text: '1个月', value: '(14d,1m]' },
                { text: '3个月', value: '(1m,3m]' },
                { text: '6个月 ', value: '(3m,6m]' },
                { text: '1年', value: '(6m,1y]' },
                { text: '1年以上', value: '(1y,)' },
                { text: '不清楚', value: 'FeatureStateUnknown' }
            ]
        }
    ]
}


export let labItem = {
    haslab: {
        id: 'haslab',
        name: 'haslab',
        type: 'radio',
        stem: '您是否做过化验？',
        options: [
            { text: '是', value: 'yes' },
            { text: '否', value: 'no' }
        ]
    },
    items: [] //模型追问化验
}

export let symptomSort = {
    items: [
        // { id: '01', text: '常见症状' }
    ]
}

export let symptomList = {

    // '01': [
    //     { text: '头梗1', id: '101', choice: false },
    //     { text: '其他', id: '06', choice: false }
    // ],
}

export let report = {
    items: [
        // { id: '001', name: '急性上呼吸道感染', weight: '80', describe: '急性上呼吸道感染简称上感，又称普通感冒。是包括鼻腔、咽或喉部急性炎症的总称...' },
    ]
}

export let wiki = {
    name: '百科',
    id: '',
    items: []
}

export function resultsListInit(key){
    /*
        key : symptoms || labItems || pastDiseases
    */
    results.patient[key]=[]
}
export function labItemInit(){
    labItem = {
        haslab: {
            id: 'haslab',
            name: 'haslab',
            type: 'radio',
            stem: '您是否做过化验？',
            options: [
                { text: '是', value: 'yes' },
                { text: '否', value: 'no' }
            ]
        },
        items: [] //模型追问化验
    }
}

export function symptomSortInit(){
    symptomSort = {
        items: []
    }
}

export function symptomListInit() {
    symptomList = {}
}


export function reportInit() {
    report = {
        items:[]
    }
}


export function wikiInit() {
    wiki = {
        name: '',
        id: '',
        items: []
    }
}

export function setSkipActions(action,isSkip){
    
    let _skipAction = JSON.parse(JSON.stringify(results.skipActions));
    if (isSkip){
        _skipAction.push(action)
       
    }else {       
        if (_skipAction.indexOf(action) != -1) {
            _skipAction.splice(_skipAction.indexOf(action), 1)
        }
    }

    results.skipActions=_skipAction;
}

export function resultsInit(){
    results = {
        "patient": {
            "basic": {
                "age": {
                    "year": 1
                }
            },
            "symptoms": [],
            "labItems": [],
            "pastDiseases": []
        },
        "skipActions": [  //跳过的询问项
            "DoctorInquiryActionAskBasicInfo",  //基本信息
            "DoctorInquiryActionAskLivingHabit",  //生活习惯
            "DoctorInquiryActionAskVitalSign",   //生命体征
            "DoctorInquiryActionAskSign"    //体征
        ]
    }
}

export function optionsInit(){
    options = {
        optionList: [
            {
                id: 'gender',
                name: 'gender',
                type: 'radio',
                stem: '请选择性别',
                options: [
                    { text: '男', value: 'GenderMale' },
                    { text: '女', value: 'GenderFemale' }
                ]
            }, {
                id: 'age',
                name: 'age',
                type: 'text',
                stem: '请输入您的年龄'
            }, {
                name: 'symptom',
                type: 'list',
                stem: '您当前有什么症状？',
                text: '点击进入标准词列表输入',
                url: '../symptom/symptom'
            }, {
                id: 'duration',
                name: 'duration',
                type: 'radio',
                stem: '以上症状持续多久了？',
                options: [
                    { text: '3天', value: '(,3d]' },
                    { text: '1周', value: '(3d,7d]' },
                    { text: '2周', value: '(7d,14d]' },
                    { text: '1个月', value: '(14d,1m]' },
                    { text: '3个月', value: '(1m,3m]' },
                    { text: '6个月 ', value: '(3m,6m]' },
                    { text: '1年', value: '(6m,1y]' },
                    { text: '1年以上', value: '(1y,)' },
                    { text: '不清楚', value: 'FeatureStateUnknown' }
                ]
            }
        ]
    }
}

export function restartInit(){
    resultsInit();
    labItemInit();
    symptomListInit();
    symptomSortInit();
    reportInit();
    optionsInit();
    wikiInit();
}


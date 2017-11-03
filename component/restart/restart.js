
import { restartInit} from '../../data/data';

module.exports={
    restart(callback){
        restartInit();
        if (wx.reLaunch) {
            wx.reLaunch({
                url: '/pages/index/index'
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }

        callback();
    }
}
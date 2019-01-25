/**
 *
 *
 */ 

const Rtc_Conf  = require("./../rtc.conf.json")

module.exports= {

    ["RTC_wrapper"] : {
        loadRtc_Default_Conf () {
             const {config} = Rtc_Conf.PeerStreamOpt
             return config 
        } , 
        Rtc_turn_enabling  (...urlsTurns) {
            if (urlsTurns) { 
                const Turn_on =  module.exports.RTC_wrapper["loadRtc_Default_Conf"]() 
                for(let ipAddr of urlsTurns) {
                    Turn_on.iceServers.push({urls : ipAddr})
                }
                 return Turn_on 
            }else module.exports.RTC_wrapper["loadRtc_Default_Conf"]() 
        }
    },  
    user_media_default_opt:{...Rtc_Conf.UserMedia} ,

    sp_constraint (stream) {
        if (stream)
            return {
                initiator : true  , 
                stream    : stream,
                trickle   : false, 
                config :{...module.exports.RTC_wrapper["Rtc_turn_enabling"]()}
            }
         else 
            return {
                initiator : false  ,
                trickle   : false
            } 
    }, 

    sp_bindEvt(peer ,emiter, receiver , vidTag = null) {
        let targetVideoStream = vidTag ? vidTag: null 
        peer.on ("error" , err => console.log(err))
        peer.on("signal" , data => { 
            emiter.textContent = JSON.stringify(data) 
        })
        if (targetVideoStream) {
            console.log(targetVideoStream)
            peer.on("stream" , stream => {
                console.log("okk")
                targetVideoStream.srcObject= stream
                targetVideoStream.play() 
            })
        }    
    }, 

    WRTC_autoload (global_ns , _cb) {
        if (typeof global_ns != "object") false ; 
        if (Object.keys(global_ns)) {
            for (let sub_module in global_ns) {
                 _cb(global_ns[sub_module]) 
            }
        }
    } 
}

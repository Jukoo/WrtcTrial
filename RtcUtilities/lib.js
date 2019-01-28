/**
 * script name lib.js  
 */ 
const Rtc_Conf  = require("./../rtc.conf.json")

/**
 * @namespace module.export 
 */
module.exports= {
    /**
     * @access private 
     * @subnamespace RTC_wrapper 
     *
     */
    ["RTC_wrapper"] : { 
        /**
         * @access private 
         * @function loadRtc_Default_Conf - load the Default iceServer present on rtc.conf.json 
         * @param  {void} 
         * @return {void} 
         */ 
        loadRtc_Default_Conf () {
             const {config} = Rtc_Conf.PeerStreamOpt
             return config 
        } , 
        /** 
         * @access protected
         * @function Rtc_turn_enabling - enable the Turn servers if they are sets 
         * @param  {string}  - urlsTurns  - the turns urls 
         * @return {Object}  - the Config iceServers on rtc.conf.json 
         */
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
    //Enable the  userMedias  *by default it sets on true if rtc.conf.json* 
    user_media_default_opt:{...Rtc_Conf.UserMedia} ,

    /** 
     * @access public 
     * @function sp_constraint - initialize the constraint on simple-peer module 
     * @param  {Object} - stream - the stream flux 
     * @param  {array}  - turn_ip_addr - the turns ip address 
     * @return {Object}
     */
    sp_constraint (stream , ...turn_ip_addr) {
        let initConfIceServer;
        const [turnIp , turnIp2] = turn_ip_addr.length ==2 ? turn_ip_addr : [null , null]; 
        if (turnIp  && turnIp2) {
            initConfIceServer={...module.exports.RTC_wrapper["Rtc_turn_enabling"](turnIp , turnIp2)}
        }else  {
            initConfIceServer ={...module.exports.RTC_wrapper["Rtc_turn_enabling"]()}
        }
        if (stream)
            return {
                initiator : true  , 
                stream    : stream,
                trickle   : false, 
                config :{...initConfIceServer} 
            }
         else 
            return {
                initiator : false,
                trickle   : false
            } 
    }, 
    /**
     * @access public 
     * @function sp_bindEvt - bind event on simple-peer object 
     * @param {Object} - peer - the simple-peer instance 
     * @param {DOMelement} - emiter - the emiter textArea 
     * @param {DOMelement} - receiver -  the receiver textArea
     * @param {DOMelement} - vitTag  - the video tag to launch stream on receiver  
     */
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

    /** 
     * @access public 
     * @function WRTC_autoload load all module on RTC  namespace 
     * @param {Object}   global_ns  the global namespace 
     * @param {callback} _cb the callback resolution 
     * @return {void}
     */ 
    WRTC_autoload (global_ns , _cb) {
        if (typeof global_ns != "object") false ; 
        if (Object.keys(global_ns)) {
            for (let sub_module in global_ns) {
                 _cb(global_ns[sub_module]) 
            }
        }
    } 
}

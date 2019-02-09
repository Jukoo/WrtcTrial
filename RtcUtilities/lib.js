/**
 * script name lib.js  
 */ 
//=>"RTCConf" // the local folder that  stored the configuration 
const Rtc_Conf  = require("./../RTCConf/rtc.conf.json")

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
             let {config} = Rtc_Conf.PeerStreamOpt
             return config 
        } , 
        /** 
         * @access protected
         * @function Rtc_turn_enabling - enable the Turn servers if they are sets 
         * @param  {Object}  - urlsTurns  - the turns urls  urls - credential - username 
         * @return {Object}  - the Config iceServers on rtc.conf.json 
         */
        //=> destructuring input parameter
        Rtc_turn_enabling  (urlsTurns) {
            const Allowed_properties=  new Set(["urls" , "credential" , "username"])
            try { 
                Object.keys(urlsTurns).forEach(key=> {
                    if (!Allowed_properties.has(key)) throw new RangeError(`unexpected key argument`)
                })
            }catch (err) {
                if (err instanceof RangeError)console.warn(`${err.name}:${err.message}`)  
            }

            if (urlsTurns) { 
                const Turn_on =  module.exports.RTC_wrapper["loadRtc_Default_Conf"]() 
                Turn_on.iceServers.push(urlsTurns) 
                return Turn_on 
            }else return module.exports.RTC_wrapper["loadRtc_Default_Conf"]() 
        }
    }, 
    /**
     * call this method if you want to use your own config file 
     * this will be  stored on Rtc_conf file  
     * @access public 
     * Rtc_personnalConf_file 
     * @param  {bool} is_file_set  [true] if you set your file config in json syntaxe  
     * @return {Promise}  
     */ 

     Rtc_personnalConf_file (is_file_set){
        const {Rtc_turn_enabling} = module.exports.RTC_wrapper
         if(is_file_set){ 
            return new Promise((resolve , reject)=> {
                 try { 
                    resolve(Rtc_turn_enabling(require(`
                        ./../RTCConf/iSerTrun.json`
                    ))) //create file named iSerTrun.json   
                }catch(error) {
                    reject(error)
                }
            })
         }else {
             console.error(`no argument found on parameters`) ; 
             return false ; 
         }
     }, 

    //Enable the  userMedias  *by default it sets on true if rtc.conf.json* 
    user_media_default_opt (params) { 
        const allowed_properties = new Set(["width" , "height"]) 
        if(params == "object"  && params) {
          for(const params_integrity in params) {
                if(!allowed_properties.has[params_integrity]) {
                    console.error("no allowed params ")
                    return false ; 
                }
          } 
            return{["audio"]:true, ["video"]:{...params}} 
        }else {
            return {...Rtc_Conf.UserMedia}
        }
    },  

    /** 
     * @access public 
     * @function sp_constraint - initialize the constraint on simple-peer module 
     * @param  {Object} - stream - the stream flux 
     * @param  {boolean} - setting_turn_server  - if you set your own config turn Server  give true 
     * @return {Object}
     */
    //=> call this function in Promise success 
    sp_constraint (stream , iceServerTurns) {
        let initConfIceServer=new Object("") 
        if(iceServerTurns) {
            initConfIceServer = {...module.exports.RTC_wrapper["Rtc_turn_enabling"](iceServerTurns)}
        }else {
            initConfIceServer = {...module.exports.RTC_wrapper["Rtc_turn_enabling"]()}
        }
        if (stream){
            return {
                initiator : true  , 
                stream    : stream,
                trickle   : false, 
                config :{...initConfIceServer} 
            }
        }else{ 
            return {
                initiator : false,
                trickle   : false
            } 
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


const Destruc_MEX  = module => {
    
}

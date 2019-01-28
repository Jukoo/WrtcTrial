/** 
 * script name : mainrtc.js 
 * description : testing web real time communication 
 * author      : juko <funscript@outlook.fr>
 * notice      : for any issue you found on this script 
 *               please declare and issue 
 */ 
let speer = null  ; 
const [ 
    Peer= require("simple-peer")
] = process.argv.splice(1) , 
{getEltID , cp2ClipBoard} =require("./RtcUtilities/DomManip").DOMHTML, 

{
    RTC_wrapper:{loadRtc_Default_Conf, Rtc_turn_enabling} ,
    WRTC_autoload, 
    user_media_default_opt, 
    sp_constraint,
    sp_bindEvt
    } = require("./RtcUtilities/lib"), {log , warn  ,error , group} = console , 
[ 
    receiver , 
    emiter , 
    start_btn , 
    offertEmit, 
    offertReceiv, 
    btncpEmit, 
    saveOffer, 
    clipBoard
]=getEltID(
    "receive" , 
    "emiter" , 
    "start", 
    "OfferEmit", 
    "OfferReceiv",
    "btncpEmit", 
    "saveOffer",
    "clipBoard"
)  ; 
/**
 * RTC module 
 * @namespace RTC 
 */ 
log(Rtc_turn_enabling()) 

const RTC = {
    /**
     * @access public 
     * @function MediaStreamLauncher -the initiator of video stream
     * @param {void} 
     * @return {void} 
     */ 
    MediaStreamLauncher () { 
        start_btn.addEventListener("click", evt => {
            if("getUserMedia" in navigator)log("%c allowed","background-color:green")
                navigator.mediaDevices
                ["getUserMedia"](user_media_default_opt).then(stream => {
                speer = new Peer({...sp_constraint(stream)}) 
                sp_bindEvt(speer,OfferEmit , OfferReceiv)
                emiter.srcObject= stream
                emiter.play() 
            }).catch(err => warn("permission denied!!")) 
        })
    }, 
     /** 
     * @function CommitOffer - register the offer comes from the 
     * user who is the initiator of the stream 
     * @param  {void} 
     * @return {void}
     */
    CommitOffer () {
        document.querySelector("form").addEventListener("submit" , evt => {
            evt.preventDefault() ;
            if (speer == null) { 
                speer = new Peer({...sp_constraint()})
                sp_bindEvt(speer ,offertEmit , offertReceiv , receiver)
            }
            speer.signal(JSON.parse(offertReceiv.value))  
        })
    } , 
    /**
     * @function  clipBoard - just copy offer key on clip board 
     * @public{void}
     * @return{void}
     */
    clipBoard () { 
        clipBoard.addEventListener("click" , evt => {
            offertEmit.select() 
            document.execCommand("copy")
        }) 
    } 
} 

/**
 * @access  protected 
 * @function WRTC_autoload  - load module from RTC Namespace 
 * @param {Object}  RTC     - the Namespace 
 * @param {callback} module - the callback 
 */ 
WRTC_autoload(RTC , module => {
    module() 
    group(`%c${module.name}  is  loaded successfully` ,"color:green") 
})

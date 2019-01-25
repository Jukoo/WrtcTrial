/**
 * module.export as set  Global namespace 
 * @namespace module.exports 
 */
module.exports = {
     /** 
      * @subnamespace DOMHTML
      */ 
      ["DOMHTML"] : {  
        /**
         * @function getEltID just get the id elemenet specify on parameters 
         * @param {Array} - the elements tag suppose to have an id attribute 
         * @return {Set} 
         */
          getEltID (...DOM_elements) {
                const Dom_target_collection  = new Set([])
            for(let elts of DOM_elements) {
                if (elts.nodeType != document.ELEMENT_NODE) false 
                Dom_target_collection.add(document.getElementById(elts)) 
            }
            return Dom_target_collection ; 
        }, 
          /**
           * @function cp2ClipBoard copy the target area value on click 
           * @param {DOM element Target} - the field input targeted 
           * @return {void}
           */ 
          cp2ClipBoard(target_cp){
              target_cp.select() 
              document.execCommand("copy")
        }
   } 
}

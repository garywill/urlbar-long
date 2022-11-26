/* Firefox userChrome script
 * Dynamic long urlbar on focus
 * Tested on Firefox 102
 * Author: garywill (https://garywill.github.io)
 * 
 */

// ==UserScript==
// @include         main
// ==/UserScript==

console.log("dynamic_urlbar_long.uc.js");

(() => {
  
    const css_urlbarlong = `
        #nav-bar-customization-target  toolbarspring, 
        toolbaritem#urlbar-container ~ toolbaritem
        { 
            display: none; 
        }
        
        toolbaritem#urlbar-container ~ toolbarbutton, 
        toolbaritem#urlbar-container ~ toolbarbutton stack.toolbarbutton-badge-stack, 
        toolbaritem#urlbar-container ~ toolbarbutton .toolbarbutton-icon, 
        toolbaritem#urlbar-container ~ toolbarbutton .toolbarbutton-badge, 
        toolbarbutton#nav-bar-overflow-button
        {
            
            padding-left: 0.3px  !important ; 
            padding-right: 0.3px !important ; 
            
            --toolbarbutton-inner-padding: 0.3px;
            
            pointer-events: none;
        }
    ` ; 
    
    const urlbar_container = document.querySelector("toolbaritem#urlbar-container");
    const urlbar =       urlbar_container.querySelector("hbox#urlbar");
    const urlbar_input = urlbar_container.querySelector("input#urlbar-input") ;
    
    var observer = new MutationObserver(function(){
        if ( urlbar.getAttribute("focused") == "true" )
        {
            setTimeout(function() {
                if ( urlbar.getAttribute("breakout-extend") == "true"
                    && urlbar_input.getAttribute("aria-expanded") == "true"
                ) 
                    registerCss();
                
            }, 200);
        }
        else
        {
            unregisterCss();
        }
    });
    function startObserve() 
    {
        observer.disconnect();
        observer.observe(urlbar,{attributes:true});
    }
    function stopObserve()
    {
        observer.disconnect();
    }
    
    urlbar_input.addEventListener("click", function() {
        registerCss();
    } );
    urlbar_input.addEventListener("input", function() {
        registerCss();
    } );
    urlbar_input.addEventListener("keydown", function() {
        if ( ["ArrowLeft", "ArrowRight", "Home", "End"].includes( event.key ) )
            registerCss();
    } );

    
    
    var style_tag = document.createElement("style");
    style_tag.id = "styletag_urlbarlong";
    document.head.appendChild(style_tag);
    
    
    function registerCss()
    {
        if ( ! isCssRegistered() )
            style_tag.textContent = css_urlbarlong;
    }
    function unregisterCss()
    {
        style_tag.textContent = ""; 
    }
   
    function isCssRegistered()
    {
        if ( style_tag.textContent.trim().length )
            return true;
        else
            return false;
    }
    
    document.getElementById("navigator-toolbox-background").addEventListener("click", function() {
//         console.log(event);
        if ( isCssRegistered() )
        {
            const mostTop = this;
//             console.log(mostTop);
            
            const noEventArea = mostTop.querySelector("#urlbar-container");
            
            const clickTarget = event.target;
//             console.log(clickTarget);
            
            for ( var ele = clickTarget ; ele && ele !== mostTop ; ele = ele.parentNode)
            {
//                 console.log("for loop ele=", ele);
                if (ele === noEventArea)
                {
                    return;
                }
            }
            
        }
        
        stopObserve();
        setTimeout(startObserve, 1000);
        
        unregisterCss();
    } ) ; 
    
    startObserve();
    
})();
    







function defaultValue(a, b) {
    if (a !== undefined && a !== null) {
        return a;
    }
    return b;
}

function defined(value) {
    return value !== undefined && value !== null;
}

const PAI = 3.1415926;

const LOW_LINE = '_';

//发布时请将模式改为_RELEASE
const VIEW_MODE='_DEBUG';
//const VIEW_MODE='_RELEASE';


function loadCss(url,id) {
    var head = document.getElementsByTagName('head')[0];
    if(Array.isArray(url)){
        for(var i=0;i<url.length;i++){
            var link = document.createElement('link');
            link.type='text/css';
            link.rel = 'stylesheet';
            link.href = url[i];
            head.appendChild(link);
        }
    }else{        
        var link = document.createElement('link');
        if(id)
            link.id=id;
        link.type='text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
    
}


function loadJs(url,id,callback){
     var script=document.createElement('script');
     script.type="text/javascript";
    if(Array.isArray(url)&&url.length==1){
        url=url[0];
    }
    var head = document.getElementsByTagName('head')[0];
    if(Array.isArray(url)){
        var uri=url.splice(0,1);
        script.src=uri[0];
       
        head.appendChild(script);        
         if(script.readyState){
             script.onreadystatechange=function(){
              if(script.readyState == "loaded" || script.readyState == "complete"){
                  script.onreadystatechange=null;
                loadJs(url,null,callback);
              }
             }
         }else{
             script.onload=function(){
                  loadJs(url,null,callback);
             }
         }
    }else{
        if(id)
            script.id=id;
        script.src=url;
        if(typeof(callback)!="undefined"){
             if(script.readyState){
                 script.onreadystatechange=function(){
                  if(script.readyState == "loaded" || script.readyState == "complete"){
                      script.onreadystatechange=null;
                      callback();
                  }
                 }
             }else{
                 script.onload=function(){
                      callback();
                 }
             }
         }
        head.appendChild(script);
    }      
    
}

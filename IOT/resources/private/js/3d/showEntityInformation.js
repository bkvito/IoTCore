/**
 * Created by niuyl on 2019/4/25.
 */
function showInfobox(){
    /*if(entityId != "contrlArea"){

    }*/
    var fatherBox=document.createElement("div");
    //var boxHeight = document.documentElement.clientHeight;
    var divDiscription = document.createElement('div');
    var divWorkStatus = document.createElement('div');
    var divShowVideo = document.createElement('div');
    fatherBox.style.position='absolute';
    //fatherBox.style.background="white";
    fatherBox.style.right="47px";
    fatherBox.style.top="158px";
    fatherBox.style.width='360px';
    fatherBox.style.height="750px";
    fatherBox.style.zIndex=9999;
    fatherBox.setAttribute('id','outBox');
    document.body.appendChild(fatherBox); //



    //divDiscription.style.background="red";
    divDiscription.setAttribute('id','diccriptionbox');
    divDiscription.setAttribute('class','innerbox');
    document.getElementById("outBox").appendChild(divDiscription);

    //divWorkStatus.style.background="red";
    divWorkStatus.setAttribute('id','workStatu');
    divWorkStatus.setAttribute('class','innerbox');
    document.getElementById("outBox").appendChild(divWorkStatus);

    //camera 镜头改变  关闭弹窗
    // var camera = viewer.camera; 
    // viewer.camera.changed.addEventListener(function(){
    //     document.getElementById("outBox").style.display = 'none';
    // })


    /*divShowVideo.style.background="red";
     divShowVideo.setAttribute('id','showVideo');
     divShowVideo.setAttribute('class','innerbox');
     document.getElementById("outBox").appendChild(divShowVideo);*/
    $(function(){
        $.ajax({
            type: "get",
            url: "../data/facilitiesConfig.json",
            dataType: "json",
            success: function(data){

                for(var i=0;i<data.length;i++){
                    if(i== 0){
                        $('#diccriptionbox').append('<em>摄像头基础信息</em>');
                        for(var key in data[i]){


                            let span;
                            span = "<span class='txt'>" + key +"："+data[i][key] +"</span>";
                            $('#diccriptionbox').append(span);
                        }
                    }else{
                        $('#workStatu').append('<em>摄像头工作状态</em>');
                        for(var key in data[i]){
                            let span;
                            span = "<span class='txt'>" + key +"："+data[i][key] +"</span>";
                            $('#workStatu').append(span);
                        }

                    }


                }
            }
        });

    });

}
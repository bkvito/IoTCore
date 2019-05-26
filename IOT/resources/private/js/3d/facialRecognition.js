/**
 * Created by niuyl on 2019/5/6.
 */
//生成人脸识别窗口
function facialRecognition(data)
{
    //基础人脸识别的面板
    var faceVisual = '<div id= "faceVisualId"></div>';
    var arrowLeft ='<a href="javascript:;" class="arrow arrow_left">&lt;</a>';
    var arrowRight = '<a href="javascript:;" class="arrow arrow_right">&gt;</a>';
    var faceSon = '<div  id = "faceSonId"></div>';
    var arrowBox ='<div id ="arrowBoxId"></div>'
    var faceSubSonLong ='<div id = "faceSubSonLongId"><p>校园电子监控</p></div>';
    var wrapBox = '<ul id="wrapBoxId" ></ul>'
    var closeBtn = '<div id="closeBtnId" class="closeBtnClass" ><p style ="font-size: 15px"align="center">X</p></div>';
    var searchBtn = '<div id="searchBtnId" class="searchBtnClass" ></div>';
    var searchInput ='<input type="text" id ="searchInputId" placeholder="输入用户名查找"/>'
    var highLightBox = '<div id="highLightBoxId"></div>'
    var infoPersonMore  = '<p class="personControl personDiscriptionMore"><a>更多信息</a></p>'
    var infoPersonShrink  = '<p class="personControl personDiscriptionShrink"><a id="personBtn">收起面板</a></p>'
    var statusPersonBillboard=1; //表示个人信息面板是否打开的参数
    var onceCreateElement =1; //个人信息面板打开的状态下 只生成一次详细信息
    $(document.body).append(faceVisual);
    $('#faceVisualId').append(faceSon,closeBtn);    
    $('#faceSonId').append(faceSubSonLong,arrowBox,infoPersonMore,infoPersonShrink);
    $('#arrowBoxId').append(wrapBox,highLightBox);
    $('#arrowBoxId').append(arrowLeft,arrowRight); 
    $('#faceSubSonLongId').append(searchBtn,searchInput);



    //判断获取数据的长度，做分页显示  json转二维array 即为data
    //第一部分，页面初始化    
    
    var num = mydata(data)/10//data长度
    function mydata(data){
        num =0;
        for(var key in data){
            num++;                                  
        };
        return num;
    }
    var dot=new RegExp(".");
    var myInteger;
    var faceSubSonId;
    var myRemainder;
    var personInfoArr=[]//存储个人信息数组，滚动时可查询个人信息 [name,age,sex,major]
    for(var key in data){
        personInfoArr.push(data[key]);
    }    
    dot.test("num")
    if(dot.test("num")){//判断是否除尽
        //取整数部分
        myInteger = Math[num > 0 ? "floor" : "ceil"](num);
        //取余数
        myRemainder = (num-myInteger)*10;
    }else{
        myInteger = num;
    }
    //初始化加载人脸识别面板
    for(let i =1;i<=10;i++){
        faceSubSonId = 'faceSubSon' +i;
        var url = personInfoArr[i].img
        faceSubSon = '<li class = "innerDiv" '+ 'id = "'+ faceSubSonId +'"><ul class="personBox" style="background:url('+url+ ') no-repeat ;background-size: 100% 100%">'+ i +'</ul></li>'; //style="background-image:url('+url+ ') no-repeat"
        $('#wrapBoxId').append(faceSubSon)
        
        //$('.personBox')[i].style.backgroundurl="url(" + url +")";
        if(i==9)$('#wrapBoxId').animate({left:'-840px'},10000)
        //添加personimg
        // setTimeout(function(){
        //     var url = personInfoArr[i].img
        //     $('.personBox')[i].css('background',url)
        //     if(i==9)$('#wrapBoxId').animate({left:'-600px'},10000) //面板初始化后才能开始滚动    
        //     // var personInfoArr = 'personInfoArr'+ i   
        //     // personInfoArr[i][0]=data[0][i].name;
        //     // personInfoArr[i][1]=data[0][i].age;
        //     // personInfoArr[i][2]=data[0][i].sex;
        //     // personInfoArr[i][3]=data[0][i].major;
        // })        
    }




    //根据获取的数据长度生成子div 
    //原来第一部分
    // var faceSubSonId
    // for(var i =0;i<=7;i++)
    // {
    //     faceSubSonId = 'faceSubSon' +i;
    //     faceSubSon = '<li class = "innerDiv" '+ 'id = "'+ faceSubSonId +'"><ul class="personBox">'+ i+'</ul></li>';
    //     $('#wrapBoxId').append(faceSubSon)
    // }
    

    
    //给btn添加点击事件   面部识别面板的控制器 此处注意的事非得用页面的静态元素（比如document）去监听它的子元素#closeBtnId  监听事件才会生效！
    $(document).on('click','#closeBtnId',function(){
        
        $("#faceVisualId").remove();
    })
    
    //一个元素同时绑定多个事件
    // $('#searchBtnId').on({
    //     mouseover:function(){
    //         $("#searchInputId").css('display','block');
    //     },  
    //     mouseout:function(){
    //         $("#searchInputId").css('display','none');
    //     },
    //     click:function(){
    //         $("#searchInputId").css('display','block');
    //     }
    // })
    $('#wrapBoxId').animate({left:'0px'},10000) //面板初始化后开始滚动
    
    //document.getElementById('#wrapBoxId').onmouseenter()
    $('#wrapBoxId').mouseover(function(){
        $('#wrapBoxId').stop();
    });

    //innerDiv的点击事件动画执行完会才会执行这个mouseout


    // $('#wrapBoxId').mouseout(function(){
    //     // if(innerBoxStatus == 0){
    //     //     $('#wrapBoxId').animate({left:'-600px'},10000)
    //     // }
        
    //     // innerBoxStatus = 0
    //     if(statusPersonBillboard != 0 && $('#searchInputId').val() == ''){
    //         $('#wrapBoxId').animate({left:'-600px'},10000)
    //     }

    // })

    
    
    //给头像div 添加 mouseover和点击事件；或者用下面的方法
    // $('.innerDiv').on({
    //     mouseover:function(){
    //         console.log('mouseover')
    //     },  
    //     mouseout:function(){
    //         console.log('mouseout')
    //     },
    //     click:function(){
    //         console.log('click')
    //     }
    // })

    // 这样监听事件就不行
    // $('innerDiv').on('click',function(){
    //     console.log('click')
    // })

    

    
    //input 的enter事件
    //原来第三部分
    // $('#searchInputId').on({
    //     keydown:function(event){
    //         if(event.keyCode == "13") {
    //             //1.判断是否有这个人  从获取的数据中判断
    //             $('#wrapBoxId').stop();
    //             let studentName = $('#searchInputId').val()
    //             let studentNameId = Number(studentName.replace(/[^0-9]/ig,""))
    //             $('#wrapBoxId').animate({left:-studentNameId*120},500);
    //             //input 非空时可以执行查询效果
    //             if($('#searchInputId').val()){
                    
    //                 setTimeout(function(){
    //                     $('#highLightBoxId').css({
    //                         'border-color':'#aef',
    //                         'box-shadow':'0 0 8px #fff',
    //                         'display':'block'
    //                     })
    //                 },505)                
    //                 $('#wrapBoxId').animate({left:-studentNameId*120},500);
    //                 $(document).on('mouseover','#highLightBoxId',function(){
    //                     $('#highLightBoxId').css('display','none')
    //                 })
    //                 // $('#wrapBoxId').one('animationend', function(){
    //                 //     console.log('wrapBoxId已经执行完动画了')
    //                 //     $('#highLightBoxId').css('display','none')
    //                 // });
                    
                    
    //             }
                
    //         }
    //     },
    //     change:function(){$('#highLightBoxId').css({'display':'none'})}
    // })

    //第三部分 搜索框查看个人信息
    $('#searchInputId').on({
        keydown:function(event){
            let studentName = $('#searchInputId').val()
            let whetherPersonEixst;
            //var temperyR= typeof(studentName);
            let studentNameId = Number(studentName.replace(/[^0-9]/ig,""))
            if(event.keyCode == "13") {   
                //1.判断是否有这个人  从获取的数据中判断   //还需要判断输入的值是否合法
                $('#wrapBoxId').stop();
                
                if(studentName == "" ){
                    alert("请输入合法的字符")
                }else{
                        if(studentNameId == 0){
                            for(let i=0;i<10;i++){
                                if(studentName === personInfoArr[i].name){
                                    var widthX =-i*120+'px';
                                    $('#wrapBoxId').animate({left:widthX},300)
                                    // setTimeout(function(){
                                    //     personInformation();
                                    //     whetherPersonEixst =1;                            
                                    //     break;
                                    // },500)
                                    whetherPersonEixst =1;
                                    break                      
                                }else{ continue}
                            };
            
                            if(whetherPersonEixst !== 1){
                                for(let i=10;i<personInfoArr.length;i++){
                                    if(studentName === personInfoArr[i].name){ 
                                        var seartemporaryPerson ='<li class = "innerDiv" '+ 'id = "faceSubSonId11"><ul class="personBox"></ul></li>';
                                        var url ='url('+personInfoArr[i].img+') no-repeat';
                                        $('#wrapBoxId').append(seartemporaryPerson);
                                        $('#wrapBoxId').animate({left:'-1200px'},300);
                                        $('#faceSubSonId11 ul').css({
                                            "background":url,
                                            "background-size": "100% 100%"
                                        })
                                        statusPersonBillboard=0;
                                        // setTimeout(function(){
                                        //     $('#faceSubSonId11').css('width','340px');
                                        //     if(onceCreateElement ==1){
                                        //         onceCreateElement=0;
                                        //         // setTimeout(function(){
                                        //         //     $('#faceSubSonId10').append(infoPersonName,infoPersonAge,infoPersonCareer,infoPersonSex) 
                                        //         //     $('.personDiscription')[0].children().html='姓名：'+data[i][0];
                                        //         //     $('.personDiscription')[1].children().html='年龄：'+data[i][1];
                                        //         //     $('.personDiscription')[2].children().html='性别：'+data[i][2];
                                        //         //     $('.personDiscription')[3].children().html='专业：'+data[i][3];
                                        //         //     $('.personControl').css('display','block'); 
                                        //         // },500)
                                        //     }                                
                                        //     innerBoxStatus = 1;
                                        //     break        
                                        // },600)
            
                                    }else{continue}
                                }
                            }
                        }else{
                            if(studentNameId<=10 && studentNameId !=0){
                                $('#wrapBoxId').animate({left:-(studentNameId-1)*120},300); 
                            }else{alert("请输入1-10之间的数字，包括0和10")
                            //let studentNameId = Number(studentName.replace(/[^0-9]/ig,"")) //截取中文中的数字
                            
                        }
                    }
                    //判断当前搜获的人是否在这个personInfoArr二维数组里
                    //input 非空时可以执行查询效果
                    if($('#searchInputId').val()){                    
                        setTimeout(function(){
                            $('#highLightBoxId').css({
                                'border-color':'#aef',
                                'box-shadow':'0 0 8px #fff',
                                'display':'block'
                            })
                        },300)                
                        //$('#wrapBoxId').animate({left:-studentName*120},500);
                        $(document).on('mouseover','#highLightBoxId',function(){
                            $('#highLightBoxId').css('display','none')
                        })
                    }
                
                }
            }
        },
        change:function(){$('#highLightBoxId').css({'display':'none'})}
    })

    //搜索按钮
    $('#searchBtnId').click(function(){
        //1.判断是否有这个人  从获取的数据中判断
        $('#wrapBoxId').stop();
        let studentName = $('#searchInputId').val()
        let studentNameId = Number(studentName.replace(/[^0-9]/ig,"")) //解析id中的  数值
        $('#wrapBoxId').animate({left:-studentNameId*120},500);
        //input 非空时可以执行查询效果
        if($('#searchInputId').val()){
            
            setTimeout(function(){
                $('#highLightBoxId').css({
                    'border-color':'#aef',
                    'box-shadow':'0 0 8px #fff',
                    'display':'block'
                })
            },505)                
            $('#wrapBoxId').animate({left:-studentNameId*120},500);
            $(document).on('mouseover','#highLightBoxId',function(){
                $('#highLightBoxId').css('display','none')
            })
            
        }
    })

    //innerDiv点击事件
    //原来第二部分
    // var innerBoxStatus
    // var infoPersonName = '<p class="personDiscription">姓名：____________</p>'
    // var infoPersonAge = '<p class="personDiscription">年龄：____________</p>'
    // var infoPersonSex = '<p class="personDiscription">专业：____________</p>'
    // var infoPersonCareer  = '<p class="personDiscription">性别：____________</p>'    
    
    // $('.innerDiv').on({
    //         mouseover:function(){
    //             $('#highLightBoxId').css('display','none')
    //         },
    //         click:function(){
    //             let thisDiv =$(this);
    //             //获取当前id的innerdiv的left值      
    //             var someInnerDiv = -Number($(this).attr('id').replace(/[^0-9]/ig,""))*120 +'px';
    //             $('#wrapBoxId').animate({left:someInnerDiv},500)
    //             statusPersonBillboard=0;
    //             setTimeout(function(){
    //                 thisDiv.animate({width:'340px'},500);
    //                 if(onceCreateElement ==1){
    //                     onceCreateElement=0;
    //                     setTimeout(function(){
    //                         thisDiv.append(infoPersonName,infoPersonAge,infoPersonCareer,infoPersonSex) //infoPersonMore,infoPersonShrink
    //                         $('.personControl').css('display','block'); 
    //                     },500)
    //                 }
                    
    //                 innerBoxStatus = 1;        
    //             },600)
    //         }
    // })

    //第二部分点击一个人 查看信息 
    
    var infoPersonName
    var infoPersonAge
    var infoPersonSex
    var infoPersonCareer
    var thisDiv;
    var personArrMarked
    $('.innerDiv').on({
        mouseover:function(){
            $('#highLightBoxId').css('display','none')
        },
        click:function(){
            $('#wrapBoxId').stop()
            thisDiv =$(this);
            //获取当前id的innerdiv的left值      
            var someInnerDiv = -(Number($(this).attr('id').replace(/[^0-9]/ig,""))-1)*120 +'px';
            personArrMarked = Number($(this).attr('id').replace(/[^0-9]/ig,""));//将id解析成数字
            $('#wrapBoxId').animate({left:someInnerDiv},400)            
            infoPersonName = '<p class="personDiscription">姓名：<a id="personName"></a></p>'
            infoPersonAge = '<p class="personDiscription">年龄：<a id="personAge"></a></p>'
            infoPersonSex = '<p class="personDiscription">性别：<a id="personSex"></a></p>'
            infoPersonCareer  = '<p class="personDiscription">专业：<a id="personMajor"></a></p>'      
            statusPersonBillboard=0;
            setTimeout(function(){
                thisDiv.animate({width:'340px'},200);
                setTimeout(function(){
                    if(onceCreateElement ==1){
                        onceCreateElement=0; //这个参数防止同一个人的信息 反复加载
                        setTimeout(function(){
                            thisDiv.append(infoPersonName,infoPersonAge,infoPersonCareer,infoPersonSex) //infoPersonMore,infoPersonShrink
                            $('#personName').html(personInfoArr[personArrMarked].name)
                            $('#personAge').html(personInfoArr[personArrMarked].age);
                            $('#personSex').html(personInfoArr[personArrMarked].sex);
                            $('#personMajor').html(personInfoArr[personArrMarked].major);
                            $('.personControl').css('display','block'); 
                            
                        },200)
                        
                    }
                },200)                
                
                innerBoxStatus = 1;        
            },500)
        }   
    })
    function personInformation(){
        infoPersonName = '<p class="personDiscription"><a></a></p>'
        infoPersonAge = '<p class="personDiscription"><a></a></p>'
        infoPersonSex = '<p class="personDiscription"><a></a></p>'
        infoPersonCareer  = '<p class="personDiscription"><a></a></p>'      
        statusPersonBillboard=0;
        setTimeout(function(){
            thisDiv.animate({width:'340px'},500);
            if(onceCreateElement ==1){
                onceCreateElement=0; //这个参数防止同一个人的信息 反复加载
                setTimeout(function(){
                    thisDiv.append(infoPersonName,infoPersonAge,infoPersonCareer,infoPersonSex) //infoPersonMore,infoPersonShrink
                    $('.personDiscription')[0].html='姓名：'+personInfoArr[personArrMarked].name;
                    $('.personDiscription')[1].html='年龄：'+personInfoArr[personArrMarked].age;
                    $('.personDiscription')[2].html='性别：'+personInfoArr[personArrMarked].sex;
                    $('.personDiscription')[3].html='专业：'+personInfoArr[personArrMarked].major;
                    $('.personControl').css('display','block'); 
                    
                },500)
                
            }
            
            innerBoxStatus = 1;        
        },600)
    }

    //关闭个人信息面板
    $('#personBtn').click(function(){
        onceCreateElement =1
        $('.personControl').css('display','none');
        $('.personDiscription').remove();
        setTimeout(function(){
            $('.innerDiv').animate({width:'100px'},500)
        })        
        innerBoxStatus=0;
        statusPersonBillboard=1
    })

    //向左滚动的的按钮监听
    var wrapCurrentLocation
    
    var num    
    $('.arrow_left').on({
        mouseover:function(){$('#wrapBoxId').stop();},
        
        click:function(){
            var wrapBoxIdCurrentWidth =$('#wrapBoxId').css('left')
            if(statusPersonBillboard == 1 && wrapBoxIdCurrentWidth !=='0px'){
                $('#wrapBoxId').stop();
                wrapCurrentLocation = parseInt($('#wrapBoxId').css('left'));
                num = wrapCurrentLocation/120;                     
                if(typeof num === 'number' && num%1 === 0 && num === 0){                
                    $('#wrapBoxId').css('left','0px')
                }else{
                    //数组的长度由请求的数据长度决定
                    var myArrWrapLocation = [0,-120,-240,-360,-480,-600,-720,-840,-960,-1080,-1200];
                    var myMark;
                    for(var i =0;i<myArrWrapLocation.length;i++){
                        if(wrapCurrentLocation<myArrWrapLocation[i]){
                            continue;
                        }else{
                            myMark = i-1;
                            break;
                        }
                    }
                    wrapCurrentLocation = -myMark*120+'px';
                    $('#wrapBoxId').animate({left:wrapCurrentLocation},500);
                    //$('#wrapBoxId').css('left',wrapCurrentLocation);
                }
            }else if(wrapBoxIdCurrentWidth==='0px'){
                alert("显示的已经是第一个人")                         
            }else{                
                alert("请先关闭人员信息面板，再进行“上一张”操作")
            
            }  
            
        }
    });

    //向右滚动的按钮监听
    $('.arrow_right').on({
        mouseover:function(){$('#wrapBoxId').stop();},
        click:function(){
            var wrapBoxIdCurrentWidth =$('#wrapBoxId').css('left')
            $('#wrapBoxId').stop();  
            wrapCurrentLocation = parseInt($('#wrapBoxId').css('left'));
            num = wrapCurrentLocation/120;
            if(statusPersonBillboard == 1 && wrapBoxIdCurrentWidth !=='-840px'){
                if(typeof num === 'number' && num%1 === 0 && num === -840){                
                    $('#wrapBoxId').css('left','-840px')
                }else{
                    //数组的长度由请求的数据长度决定
                    var myArrWrapLocation = [0,-120,-240,-360,-480,-600,-720,-840,-960,-1080,-1200];
                    var myMark;
                    for(var i =0;i<myArrWrapLocation.length;i++){
                        if(wrapCurrentLocation<myArrWrapLocation[i]){
                            continue;
                        }else{
                            myMark = i+1;
                            break;
                        }
                    }
                    wrapCurrentLocation = -myMark*120+'px';
                    $('#wrapBoxId').animate({left:wrapCurrentLocation},500);
                    //$('#wrapBoxId').css('left',wrapCurrentLocation);
                }                
            }else if(wrapBoxIdCurrentWidth==='-840px'){
                alert("显示的已经是最后一个人")
            }else{
                alert("请先关闭人员信息面板，再进行“下一张”操作")
            }                
            
        }
    })

    // $(document).on('click','.arrow_left',function(){
        
    // })
    //向右滚动的的按钮监听
    $(document).on('click','.arrow_right',function(){
        
    })


    


    
    

}
//暂停显示
function myPerson()
{
    console.log($(this).attr('id'))
}
//wrapBox左移
// function moveToLeft()
// {
//     // var stringNum = $('#wrapBoxId').css('left');
//     // var currentLeft = parseInt(stringNum)-120 + 'px';
//     // $('#wrapBoxId').css('left',currentLeft);
//     //setTimeout('moveToLeft()', 1000)
    
// }
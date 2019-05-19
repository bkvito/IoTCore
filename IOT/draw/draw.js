//获得元素的坐标与大小。
    function findPosition(oElement) {
        var x2 = 0;
        var y2 = 0;
        var width = oElement.clientWidth;
        var height = oElement.clientHeight;
        //alert(width + "=" + height);
        if (typeof (oElement.offsetParent) != "undefined") {
            for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            x2 = posX + width;
            y2 = posY + height;
            return [posX, posY, x2, y2, width, height];

        } else {
            x2 = oElement.x + width;
            y2 = oElement.y + height;
            return [oElement.x, oElement.y, x2, y2, width, height];
        }
    }

    function moveBind(obj, evnt) {
        //获得元素坐标。
        var left = obj.offsetLeft;
        var top = obj.offsetTop;
        var width = obj.offsetWidth;
        var height = obj.offsetHeight;

        //计算出鼠标的位置与元素位置的差值。
        var cleft = evnt.clientX - left;
        var ctop = evnt.clientY - top;

        //获得容器坐标。
        var container = findPosition(document.getElementById("innerContainer"));
        var containerLeft = container[0];
        var containerTop = container[1];
        var containerWidth = container[4];
        var containerHeight = container[5];

        /*计算出容器的范围坐标。*/

        //开始 X 坐标。
        var startX = containerLeft;
        //开始 Y 坐标。
        var startY = containerTop;
        //结束 X 坐标。
        var maxX = startX + containerWidth - width;
        //结束 Y 坐标。
        var maxY = startY + containerHeight - height;

        //鼠标选中的元素设置成顶层。
        obj.style.zIndex = getMaxIndex() + 1;

        //输出显示。
        //show("idShow", startX, startY);

        document.onmousemove = function (doc) {
            //计算出移动后的坐标。
            var moveLeft = doc.clientX - cleft;
            var moveTop = doc.clientY - ctop;

            //设置成绝对定位，让元素可以移动。
            obj.style.position = "absolute";

            //不可以超出指定的范围。
            if (moveLeft >= startX && moveTop >= startY && moveLeft <= maxX && moveTop <= maxY) {
                //当移动位置在范围内时，元素跟随鼠标移动。
                obj.style.left = moveLeft + "px";
                obj.style.top = moveTop + "px";
            } else {
                /****************以下为处理当鼠标的位置不在范围内里，鼠标的移动，里面的元素也要跟着移动*****************/
                //向右移动时，如果移动坐标没有大于最大 X 坐标，则移动，否则设置成最大 X 坐标的值。
                if (moveLeft >= startX && moveLeft <= maxX) {
                    obj.style.left = moveLeft + "px";
                } else if (moveLeft > maxX) {
                    obj.style.left = maxX + "px";
                } else if (moveLeft < startX) {
                    obj.style.left = startX + "px";
                }

                //向下移动时，如果移动坐标没有大于最大 Y 坐标，则移动，否则设置成最大 Y 坐标的值。
                if (moveTop >= startY && moveTop <= maxY) {
                    obj.style.top = moveTop + "px";
                } else if (moveTop > maxY) {
                    obj.style.top = maxY + "px";
                } else if (moveTop < startY) {
                    obj.style.top = startY + "px";
                }
            }

            show("idShow", moveLeft, moveTop);
        }

        document.onmouseup = function () {
            document.onmousemove = function () { }
        };
    }

    //获得最大 Z 坐标。
    function getMaxIndex() {
        var index = 0;
        var ds = document.getElementById("innerContainer").getElementsByTagName("div");
        var length = document.getElementById("innerContainer").getElementsByTagName("div").length;

        for (var loop = 0; loop < length; loop++) {
            if (ds[loop].style.zIndex > index) index = ds[loop].style.zIndex;
        }

        return parseInt(index);
    }

    //显示坐标信息。
    function show(id, x, y) {
        document.getElementById(id).innerHTML = "left：" + x + "；top:" + y;
    }
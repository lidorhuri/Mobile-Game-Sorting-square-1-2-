

(function () {
    "use strict";

    document.addEventListener("deviceready", onDeviceReady);

    function onDeviceReady() {

        $('[data-role="myComponent"]').myComponent();
        $("#myComp0").myComponent("Initialize", 0);//בנאי
        $("#myComp1").myComponent("Initialize", 1);

    }

    function UserIsWin(idx) {
        var str = "#res" + idx;
        var tmp = $(str).html();
        tmp++;
        $(str).html(tmp); //מגדיר את ערך המשתנה לתוך הסטרינג

        $("#myComp0").myComponent("shuffle", 0);
        $("#myComp1").myComponent("shuffle", 1);
    }

    //לשלוח איוונט מהיוזר שיאתחל את הלוחות
    $('[data-role="content"]').on("won", function (event, currGameIdx) {
        UserIsWin(currGameIdx);
    });

    $(window).on('orientationchange', function (e) {
        var orientation = window.orientation;
        switch (orientation) {
            //סיבוב לאחד הצדדים
            case 90:
            case -90:
                $("#myComp1").css("left", "400px");
                $("#myComp1").css("top", "80px");

                break;

            //עומד
            case 0:
            case 180:
                $("#myComp1").css("left", "50px");
                $("#myComp1").css("top", "400px");
                break;

        }
    });


    //בנאי
    $.widget("ABCD.myComponent",
        {
            options: {
                IndexEmpty: -1,
                GameIdx: -1
            },
            getOptions: function () {
                return {
                    IndexEmpty: this.options.IndexEmpty,
                    GameIdx: this.options.GameIdx
                }
            },

            setIndexEmpty: function (IndexEmpty) {
                this.options.IndexEmpty = IndexEmpty;
            },

            Initialize: function (GameIdx) {
                var elem = this.element;

                for (var i = 0; i < 15; i++) {
                    var myButt = $("<button class='ButtonAbsPos'>");
                    myButt.attr('id', i + GameIdx * 100);
                    myButt.click(this.myClick);
                    myButt.appendTo(elem);


                }
                this.shuffle(GameIdx);
            },

            shuffle: function shuffle(GameIdx) {
                var myArr = new Array();
                for (var x = 0; x < 15; x++) {
                    myArr[x] = x + 1;
                }

                for (var y = 14; y > 0; y--) {
                    var R = Math.floor(Math.random() * (y + 1));
                    var tmp = myArr[y];
                    myArr[y] = myArr[R];
                    myArr[R] = tmp;
                }

                for (var i = 0; i < 15; i++) {
                    var str = "#" + (i + GameIdx * 100);
                    var R = 150 + Math.floor(Math.random() * 105);
                    var G = 150 + Math.floor(Math.random() * 105);
                    var B = 150 + Math.floor(Math.random() * 105);
                    $(str).css("background-color", "rgb(" + R + "," + G + "," + B + ")");

                    $(str).text(myArr[i].toString());
                    $(str).attr("tabindex", i);
                    var row = Math.floor(i / 4);
                    var col = i % 4;
                    $(str).css("left", 10 + col * 60);
                    $(str).css("top", 10 + row * 60);

                }
                this.options.IndexEmpty = 15;
                this.options.GameIdx = GameIdx;

            },


            myClick: function (e) {
                var allOptions = $(this).parent().myComponent("getOptions");
                var currTabIndex = e.target.tabIndex;

                //var $buut0 = $(document.elementFromPoint(60, 90));//1. 1
                //var $buut0 = $(document.elementFromPoint(120, 90))//1. 2
                //var $buut0 = $(document.elementFromPoint(60, 410))//2. 1
                //var $buut0 = $(document.elementFromPoint(120, 410))//2. 2

                //alert($buut0.text());

                var i1 = currTabIndex % 4;
                var j1 = currTabIndex / 4
                if (j1 != 0)
                    j1 = Math.floor(j1);

                var i2 = allOptions.IndexEmpty % 4;
                var j2 = allOptions.IndexEmpty / 4;
                if (j2 != 0)
                    j2 = Math.floor(j2)

                /*  alert(allOptions.IndexEmpty)
                  alert("i1=" + i1 + ",j1=" + j1 + "     i2=" + i2 + ",j2=" + j2)*/


                if (Math.abs(i1 - i2) + Math.abs(j1 - j2) == 1) {
                    if (i1 > i2) {
                        $(this).animate({ left: '-=60' }, 200);
                    }
                    if (i1 < i2) {
                        $(this).animate({ left: '+=60' }, 200);
                    }
                    if (j1 > j2) {
                        $(this).animate({ top: '-=60' }, 200);
                    }
                    if (j1 < j2) {
                        $(this).animate({ top: '+=60' }, 200);
                    }
                    var tmp = allOptions.IndexEmpty;
                    $(this).attr('tabindex', tmp);
                    $(this).parent().myComponent("setIndexEmpty", currTabIndex);
                }

                setTimeout(function () {
                    var cnt = 1;
                    while (cnt <= 2) {
                        for (var i = 0; i < 15; i++) {
                            var str = '#' + (i + allOptions.GameIdx);

                            if ($(str).text() == cnt ) {
                                cnt++;
                                break;
                            }
                        }

                        if (i == 15)
                            return;
                    }
                    var IsDone = check();
                    if(IsDone==0 || IsDone==1){
                        //alert("1")
                        UserIsWin(IsDone)
                    }
                   // $('[data-role="content"').trigger("won", [allOptions])
                }, 250);


                function check() {
                    var $buut1_1 = $(document.elementFromPoint(60, 90));//1. 1
                    var $buut1_2 = $(document.elementFromPoint(120, 90))//1. 2
                    var $buut2_1 = $(document.elementFromPoint(60, 410))//2. 1
                    var $buut2_2 = $(document.elementFromPoint(120, 410))//2. 2

                    var b1_1 = $buut1_1.text();
                    var b1_2 = $buut1_2.text();
                    var b2_1 = $buut2_1.text();
                    var b2_2 = $buut2_2.text();
                    if (b1_1 == "1" && b1_2 == "2") {
                        //alert("Win1")
                        return 0;
                    } else if (b2_1 == "1" && b2_2 == "2") {
                        //alert("Win2")
                        return 1;

                    }
                    return -1;
                }

            }
        })



})();
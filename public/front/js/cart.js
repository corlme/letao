$(function(){
    // 1. 一进入页面发送 ajax 请求 购物车数据，进行页面渲染
    //   还要判断下 如果已登录，就发送ajax
    //              如果未登录 拦截到登录页

   function render(){
      setTimeout(function(){
          $.ajax({
              type:"get",
              url:"/cart/queryCart",
              dataType:"json",
              success: function(info){
                  console.log(info);
                  if( info.error === 400 ){  //未登录
                      location.href = "login.html";
                      return;
                  }

                  // 已登录，渲染页面
                  var htmlStr = template("cartTpl", { arr: info });
                  $(".lt_main .mui-table-view").html(htmlStr);

                  // 请求完数据之后，关闭 下拉刷新
                  mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
              }
          })
      },500)
   }

    //2. 配置下拉刷新*/
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback : function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    console.log("下拉刷新了");
                   // 渲染页面
                    render();
                }
            }
        }
    });


     // 3.删除功能
     //       给删除按钮注册点击事件
     //        发送请求，获取商品 id 删除数据
    // 注意：在 mui 框架里 click 点击事件被默认阻止了，需要通过 tap事件
    $(".lt_main").on("tap",".btn_del",function(){
        var id = $(this).data("id");
        $.ajax({
            type:"get",
            url:"/cart/deleteCart",
            data:{
                id: [id]
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.success){
                    // 删除成功，只需要重新渲染页面
                     // 调用一次 下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                }
            }
         })

    });


    // 4. 编辑功能
    $(".lt_main").on("tap",".btn_edit",function(){

        // 获取 数据
        // 在 html5 里面有一个方法 dataset 可以一次性获取所有的 自定义属性的值
         var obj = this.dataset;
         var id = obj.id;
        console.log(obj);
        // 生成模板
         var htmlStr = template("editTpl",obj );

         // 在 mui 中 会将模板中的 \n 换行符 生成 <br> 自动换行
         //  我们这里不需要，所有要将 \n 去掉
        htmlStr = htmlStr.replace(/\n/g,"");  // 将全局的 \n 替换成 空

        // 弹出确认框
        mui.confirm( htmlStr ,"编辑商品",["确认","取消"], function( e ){
            if ( e.index === 0 ){
                // 说明用户点击的确认按钮
                //   这时候应该获取数据 发送ajax请求
                var size = $(".lt_size span.current").text(); //尺码
                var num = $(".mui-numbox-input").val();  // 数量

                $.ajax({
                    type:"post",
                    url:"/cart/updateCart",
                    data:{
                        id: id,
                        size: size,
                        num: num
                    },
                    dataType:"json",
                    success:function( info ){
                        console.log(info);
                       if( info.success ){
                           // 修改成功 重新渲染页面 这里调用一次 下拉刷新 即可
                           mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                       }

                    }
                })

            }

        });

        // 数量加减 初始化
        mui(".mui-numbox").numbox();
    });


    // 5. 让尺码可以被选中
    // 这里模态框的父元素，直接是 body
    $("body").on("tap",".lt_size span",function(){
        $(this).addClass("current").siblings().removeClass("current");
    });







});
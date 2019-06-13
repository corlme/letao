$(function(){
   // 从地址栏获取到每个商品的 id
   var productId = getSearch("productId");

   $.ajax({
       type:"get",
       url:"/product/queryProductDetail",
       data:{
           id:productId
       },
       dataType:"json",
       success:function(info){
           console.log(info);
           var htmlStr = template("productTpl",info);
           $(".lt_main .mui-scroll").html(htmlStr);

           //获得slider插件对象
           var gallery = mui('.mui-slider');
           gallery.slider({
               interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
           });

           // 手动初始化数量控件
           mui(".mui-numbox").numbox();
       }


   })

    // 让尺码可以被选中
    $(".lt_main").on("click",".lt_size span",function(){
      $(this).addClass("current").siblings().removeClass("current");
    })

    // 加入购物车
    // (1)注册点击事件
    // (2) 收集数据 尺码 和 数量
    // (3)发送ajax请求
    $("#addCart").click(function(){

        // 获取数量.获取 input 框的值
        var num = $(".mui-numbox-input").val();
        // 获取尺码
        var size = $(".lt_size span.current").text();

        if( !size ){  //如果用户没有选中尺码，弹出提示语
            mui.toast("请选择尺码");
            return;  // return 表示 后面的代码就不执行了
        }

        $.ajax({
            type:"post",
            url:"/cart/addCart",
            data:{
                productId:productId,
                num:num,
                size:size
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                if(info.error === 400 ){
                    // (1)未登录，拦截到登录页,登录成功后，还要跳转回来
                    location.href = "login.html?retUrl=" + location.href ;
                }
                 // (2)已登录 ，弹出确认框
                if( info.success){
                   mui.confirm("添加成功","温馨提示",["去购物车","继续浏览"], function( e ){
                       // 这里又要做两件事，当用户点击 去购物车 和 继续浏览
                       if( e.index === 0 ){ //点击去购物车
                           location.href = "cart.html";
                       }
                      // 点击 继续浏览 默认就关闭了 确认框 不用操作
                   })
                }
            }
        })
    })
});
// 开启进度条
// NProgress.start() ;

// setInterval(function(){
// 结束进度条
//     NProgress.done();
// },2000);

// setTimeout(function(){
//     // 结束进度条
//     NProgress.done();
// },2000);

// 实现第一个ajax发送时，开启进度条
// 所有ajax发送完之后，结束进度条

// ajax全局处理事件：查看 jquery官网里面的：APIDocumentation 下面的 Ajax 第一条 Global Ajax Evnet Handles

// ajaxStart():在第一个ajax发送是 调用
$( document ).ajaxStart(function(){
    // 开启进度条
    NProgress.start();
});

// ajaxStop():在所有ajax发送完成后 调用
$( document ).ajaxStop(function(){
    // 关闭进度条
    // NProgress.done();

    // 模拟网路延迟 (实际工作中不要加)
    setTimeout(function(){
        NProgress.done();
    },500);
});

// 登录拦截功能 （注意：登录页面不需要校验，不用登录就能访问）
//   前后端分离，前端不知道以后是否登录了，但是后台知道
//  发送ajax请求，查询用户状态即可
//    1.用户已登录，啥都不用做，让用户继续访问
//    2.用户未登录，拦截到登录页
  if( location.href.indexOf("login.html") === -1 ){
      // 说明地址栏中没有 login.html ，说明不是登录页，需要校验
      $.ajax({
          type: "get",
          url: "/employee/checkRootLogin",
          dataType: "json",
          success: function( info ){
              // console.log(info);
              if(info.success){
                  // 说明登录成功了，让用户继续访问
                  console.log("用户已登录");
              }
              if(info.error === 400 ){
                  // 说明未登录，拦截到登录页
                  location.href = "login.html";
              }

          }
      });
  }



$(function(){
    // 1.分类切换功能
   $(".nav .category").click(function(){
       // slideToggle():切换状态
      $(".nav .child").stop().slideToggle();
   });

    // 2.侧边栏切换功能
    $(".icon_menu").click(function(){
        // $(".lt_aside").hide(2000);
        // $(".lt_aside").animate({
        //     width:0
        // });
       $(".lt_aside").toggleClass("hidemenu");
       $(".lt_topbar").toggleClass("hidemenu");
       $(".lt_main").toggleClass("hidemenu");
    });

    // 3.点击topbar退出按钮，弹出模态框
     $(".icon_logout").click(function(){
         $("#logoutModal").modal('show');
     });

    // 4.点击模态框退出 实现退出功能
    $("#logoutBtn").click(function(){
        // 发送ajax请求，进行退出
        $.ajax({
            type:"get",
            url: "/employee/employeeLogout",
            dataType: "json",
            success: function(info){
                console.log(info);
                if(info.success){
                    // 退出成功 跳转登录页
                    location.href = "login.html";
                }
            }
        })
    })
});



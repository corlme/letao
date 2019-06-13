$(function(){

    // 登录功能：
    //   1. 给登录按钮注册点击事件
    //   2. 收集 用户名 和 密码
    //   3. 发送 ajax 请求，进行登录验证
            // (1)登录成功：
            //     如果是从其他页面跳过来的，跳回去
            //     如果是直接访问 login.html 跳转到个人中心
            // (2) 登录失败 提示用户

   $("#loginBtn").click(function(){
       var username = $("#username").val().trim();
       var password = $("#password").val().trim();

       // 当用户名为空时 提示用户
       if( username === '' ){
           mui.toast("请输入用户名");
           return;
       }
       if ( password === '' ){
           mui.toast("请输入密码");
           return;
       }

       $.ajax({
           type:"post",
           url:"/user/login",
           data:{
               username: username,
               password: password
           },
           dataType:"json",
           success: function( info ){
               console.log(info);
               // (1)登录失败
               if( info.error === 403 ){
                   mui.toast("用户名或者密码错误");
                   return;
               }
               // (2)登录成功
               // 如果是从其他页面跳过来的，跳回去
               // 如果是直接访问 login.html 跳转到个人中心
                 if( location.search.indexOf("?retUrl") > -1 ){
                     // location.search =>得到 "?retUrl=http://localhost:3000/front/product.html?productId=7"
                     var retUrl = location.search.replace("?retUrl=","");
                     location.href = retUrl;
                 }
                 else{
                     location.href = "user.html";
                 }
               }

       })

   })

});
$(function(){
   // 一进入页面就发送ajax请求 获取用户列表数据，通过模板引擎渲染
    $.ajax({
        type:"get",
        url:"/user/queryUser",
        data:{
            page:1,
            pageSize:5
        },
        dataType:"json",
        success:function(info){
            console.log(info);
            var htmlStr = template("tpl",info);
            $("tbody").html(htmlStr);
        }
    })

});
$(function(){

    var currentPage = 1; //当前页
    var pageSize = 5;    //每页条数
    var currentId; //当前用户点击的id
    var isDelete;


   //1. 一进入页面就发送ajax请求 获取用户列表数据，通过模板引擎渲染
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr = template("tpl",info);
                $("tbody").html(htmlStr);

                // 分页初始化
                $("#paginator").bootstrapPaginator({
                    // 指定bootstrap的版本
                    bootstrapMajorVersion: 3,
                    // 总页数
                    totalPages: Math.ceil( info.total / info.size ),
                    // 当前页
                    currentPage: info.page,
                    onPageClicked: function(a,b,c,page){
                        console.log(page);
                        // 通过page获取点击页码
                       // 更新当前页 （把page赋值给当前页）
                       currentPage=page;
                       // 页面重新渲染
                        render();
                    }
                });

            }


        });
    }


    // 2.点击启用 禁用按钮显示模态框，使用事件委托绑定事件
   $("tbody").on("click", ".btn", function(){
       // 显示模态框
       $("#userModal").modal("show");
       // 获取用户id jquery 中提供了获取用户自定义属性的方法 data()
       currentId = $(this).parent().data("id");
       // console.log(id);

       // 1:启用  0：禁用
       // 如果用户点击禁用按钮 就给后台传 0  否则传就是启用 传 1
       // 通过判断类名 决定需要传给后台的isDelete
       isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

   });

    // 3.点击确认按钮 发送ajax请求，修改对应用户状态，需要两个参数（用户id isDelete用户修改的状态）
    $("#submitBtn").click(function(){
        console.log(currentId);
        console.log("用户状态变成：" + isDelete);
        // 发送ajax请求
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType:"json",
            success: function(info){
                console.log(info);
                if(info.success){
                    // 修改成功后做两件事：
                    //  1 关闭模态框
                    $("#userModal").modal("hide");
                    // 2 页面重新渲染
                    render();
                }
            }
        })


    })

});
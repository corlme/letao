$(function(){

    var currentPage = 1; //当前页
    var pageSize = 5;    //每页条数
   // 一进入页面就发送ajax请求 获取用户列表数据，通过模板引擎渲染
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



});
$(function(){
    var currentPage = 1;
    var pageSize = 5;

    // 1.一进入页面发送ajax请求，获取数据，通过模板引擎渲染
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType: "json",
            success:function(info){
                console.log(info);
                    var htmlStr = template("secondTpl",info);
                    $("tbody").html(htmlStr);

                // 2.分页初始化
                $("#paginator").bootstrapPaginator({
                    // 指定版本
                    bootstrapMajorVersion:3,
                    // 总页数
                    totalPages:Math.ceil(info.total / info.size),
                    // 当前页
                    currentPage: info.page,

                    // 给页码添加点击事件
                    onPageClicked: function(a,b,c,page){
                        currentPage = page;
                        // 页面重新渲染
                        render();
                    }

                });

            }
        })
    }


});
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

                // 分页初始化
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

    // 2.点击分类按钮 显示模态框
     $("#addBtn").click(function(){
         $("#addModal").modal("show");

         // 一点击分类按钮就发送ajax请求 获取数据 通过模板引擎渲染
         // 通过设置 page=1  pageSize=100 来模拟数据
         $.ajax({
             type:"get",
             url:"/category/queryTopCategoryPaging",
             data: {
                 page:1,
                 pageSize:100
             },
             dataType:"json",
             success:function(info){
                 console.log(info);
                 var htmlStr = template("dropdownTpl", info);
                 $(".dropdown-menu").html(htmlStr);
             }
         })
     })

    // 3.通过事件委托 给 dropdown-menu 下面所有的 a 绑定点击事件
    $(".dropdown-menu").on("click","a", function(){
        // 获取 a 的文本
        var txt = $(this).text();
        // 把这个文本赋值给 ul
         $("#dropdownText").html(txt);

         // 获取选中的一级分类中 a 的 id
        var id = $(this).data( 'id' );
         // 把id 赋值给input框（val）
        $('[name="categoryId"]').val(id);
    });

    // 4.进行文件上传初始化
    $("#fileupload").fileupload({
        // 配置返回的数据格式
        dataType:"json",
        // 配置图片上传完成后会调用的 done 回调函数
        done:function( e, data ){
            var imgUrl = data.result.picAddr;
            $("#imgBox img" ).attr("src",imgUrl);

            $('[name="brandLogo"]').val( imgUrl );

        }
    });

    // 文件上传思路整理
   // 1，引包
   //  2 准备结构 name  data-url
   //  3 进行文件上传初始化 配置 done 回调函数

});
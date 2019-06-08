$(function(){
    var currentPage = 1;
    var pageSize = 5;
   // 一进入页面就发送ajax请求 进行页面渲染
    render();
   function render(){
       $.ajax({
           type: "get",
           url: "/category/queryTopCategoryPaging",
           data: {
               page: currentPage,
               pageSize: pageSize
           },
           dataType: "json",
           success: function(info){
               console.log(info);
               var htmlStr = template("tpl",info);
               $("tbody").html(htmlStr);

               // 分页初始化
               $("#paginator").bootstrapPaginator({
                   // 指定版本
                   bootstrapMajorVersion:3,
                   // 总页数
                   totalPages: Math.ceil(info.total / info.size),
                   // 当前页
                   currentPage: info.page,
                   // 给页码添加点击事件
                   onPageClicked:function(a,d,c,page){
                       currentPage = page;
                       // 重新渲染页面
                       render();
                   }

               });
           }
       })
   }
});